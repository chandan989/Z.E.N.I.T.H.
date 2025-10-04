const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exchange", function () {
  let exchange, paymentToken, fractionalToken;
  let owner, trader1, trader2;

  beforeEach(async function () {
    [owner, trader1, trader2] = await ethers.getSigners();

    // Deploy mock ERC20 tokens
    const MockERC20 = await ethers.getContractFactory("FractionalToken");
    paymentToken = await MockERC20.deploy("USD Coin", "USDC", ethers.parseEther("1000000"));
    fractionalToken = await MockERC20.deploy("Domain Token", "DOM", ethers.parseEther("10000"));
    await paymentToken.waitForDeployment();
    await fractionalToken.waitForDeployment();

    // Deploy Exchange
    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy();
    await exchange.waitForDeployment();

    // Set payment token
    await exchange.setPaymentToken(await paymentToken.getAddress());

    // Distribute tokens
    await paymentToken.transfer(trader1.address, ethers.parseEther("10000"));
    await paymentToken.transfer(trader2.address, ethers.parseEther("10000"));
    await fractionalToken.transfer(trader1.address, ethers.parseEther("1000"));
    await fractionalToken.transfer(trader2.address, ethers.parseEther("1000"));
  });

  describe("Deployment", function () {
    it("Should set payment token", async function () {
      expect(await exchange.paymentTokenAddress()).to.equal(await paymentToken.getAddress());
    });

    it("Should reject zero address for payment token", async function () {
      const Exchange2 = await ethers.getContractFactory("Exchange");
      const exchange2 = await Exchange2.deploy();
      
      await expect(
        exchange2.setPaymentToken(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid payment token address");
    });
  });

  describe("Create Limit Order", function () {
    it("Should create buy order", async function () {
      const amount = ethers.parseEther("100");
      const price = ethers.parseEther("10");
      // Total cost = 100 * 10 = 1000 tokens
      const totalCost = ethers.parseEther("1000");

      await paymentToken.connect(trader1).approve(await exchange.getAddress(), totalCost);

      const tx = await exchange.connect(trader1).createLimitOrder(
        await fractionalToken.getAddress(),
        true, // isBuyOrder
        amount,
        price
      );

      await expect(tx)
        .to.emit(exchange, "OrderCreated")
        .withArgs(1, await fractionalToken.getAddress(), trader1.address, true, amount, price);
    });

    it("Should create sell order", async function () {
      const amount = ethers.parseEther("100");
      const price = ethers.parseEther("10");

      await fractionalToken.connect(trader1).approve(await exchange.getAddress(), amount);

      const tx = await exchange.connect(trader1).createLimitOrder(
        await fractionalToken.getAddress(),
        false, // isSellOrder
        amount,
        price
      );

      await expect(tx)
        .to.emit(exchange, "OrderCreated")
        .withArgs(1, await fractionalToken.getAddress(), trader1.address, false, amount, price);
    });

    it("Should reject order below minimum size", async function () {
      const amount = ethers.parseEther("0.0001"); // Below MIN_ORDER_SIZE
      const price = ethers.parseEther("10");

      await paymentToken.connect(trader1).approve(await exchange.getAddress(), ethers.MaxUint256);

      await expect(
        exchange.connect(trader1).createLimitOrder(
          await fractionalToken.getAddress(),
          true,
          amount,
          price
        )
      ).to.be.revertedWith("Order too small");
    });

    it("Should prevent overflow in price calculation", async function () {
      const amount = ethers.MaxUint256;
      const price = ethers.parseEther("10");

      await paymentToken.connect(trader1).approve(await exchange.getAddress(), ethers.MaxUint256);

      await expect(
        exchange.connect(trader1).createLimitOrder(
          await fractionalToken.getAddress(),
          true,
          amount,
          price
        )
      ).to.be.revertedWith("Overflow in price calculation");
    });
  });

  describe("Fill Order", function () {
    beforeEach(async function () {
      // Create a buy order from trader1
      const amount = ethers.parseEther("100");
      const price = ethers.parseEther("10");
      // Total cost = 100 * 10 = 1000 tokens
      const totalCost = ethers.parseEther("1000");

      await paymentToken.connect(trader1).approve(await exchange.getAddress(), totalCost);
      await exchange.connect(trader1).createLimitOrder(
        await fractionalToken.getAddress(),
        true,
        amount,
        price
      );
    });

    it("Should fill buy order", async function () {
      const fillAmount = ethers.parseEther("50");
      
      await fractionalToken.connect(trader2).approve(await exchange.getAddress(), fillAmount);

      const tx = await exchange.connect(trader2).fillOrder(
        await fractionalToken.getAddress(),
        1, // orderId
        true, // isBuyOrder
        fillAmount
      );

      await expect(tx).to.emit(exchange, "OrderFilled");

      // Verify trader2 received payment
      // 50 tokens * 10 price = 500 payment tokens
      const expectedPayment = ethers.parseEther("500");
      expect(await paymentToken.balanceOf(trader2.address)).to.equal(
        ethers.parseEther("10000") + expectedPayment
      );
    });

    it("Should prevent self-trading", async function () {
      const fillAmount = ethers.parseEther("50");
      
      await fractionalToken.connect(trader1).approve(await exchange.getAddress(), fillAmount);

      await expect(
        exchange.connect(trader1).fillOrder(
          await fractionalToken.getAddress(),
          1,
          true,
          fillAmount
        )
      ).to.be.revertedWith("Cannot fill own order");
    });

    it("Should reject fill amount exceeding order", async function () {
      const fillAmount = ethers.parseEther("200"); // More than order amount
      
      await fractionalToken.connect(trader2).approve(await exchange.getAddress(), fillAmount);

      await expect(
        exchange.connect(trader2).fillOrder(
          await fractionalToken.getAddress(),
          1,
          true,
          fillAmount
        )
      ).to.be.revertedWith("Fill amount exceeds order amount");
    });

    it("Should handle partial fills", async function () {
      const fillAmount1 = ethers.parseEther("30");
      const fillAmount2 = ethers.parseEther("40");
      
      await fractionalToken.connect(trader2).approve(await exchange.getAddress(), ethers.parseEther("100"));

      // First partial fill
      await exchange.connect(trader2).fillOrder(
        await fractionalToken.getAddress(),
        1,
        true,
        fillAmount1
      );

      // Second partial fill
      await exchange.connect(trader2).fillOrder(
        await fractionalToken.getAddress(),
        1,
        true,
        fillAmount2
      );

      // Order should still exist with remaining amount
      const order = await exchange.buyOrders(await fractionalToken.getAddress(), 1);
      expect(order.amount).to.equal(ethers.parseEther("30"));
    });

    it("Should delete order when fully filled", async function () {
      const fillAmount = ethers.parseEther("100");
      
      await fractionalToken.connect(trader2).approve(await exchange.getAddress(), fillAmount);

      await exchange.connect(trader2).fillOrder(
        await fractionalToken.getAddress(),
        1,
        true,
        fillAmount
      );

      // Order should be deleted
      const order = await exchange.buyOrders(await fractionalToken.getAddress(), 1);
      expect(order.id).to.equal(0);
    });
  });

  describe("Cancel Order", function () {
    beforeEach(async function () {
      const amount = ethers.parseEther("100");
      const price = ethers.parseEther("10");
      // Total cost = 100 * 10 = 1000 tokens
      const totalCost = ethers.parseEther("1000");

      await paymentToken.connect(trader1).approve(await exchange.getAddress(), totalCost);
      await exchange.connect(trader1).createLimitOrder(
        await fractionalToken.getAddress(),
        true,
        amount,
        price
      );
    });

    it("Should cancel own order", async function () {
      const balanceBefore = await paymentToken.balanceOf(trader1.address);

      const tx = await exchange.connect(trader1).cancelOrder(
        await fractionalToken.getAddress(),
        1,
        true
      );

      await expect(tx).to.emit(exchange, "OrderCancelled");

      // Verify refund
      const balanceAfter = await paymentToken.balanceOf(trader1.address);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("Should reject cancellation by non-owner", async function () {
      await expect(
        exchange.connect(trader2).cancelOrder(
          await fractionalToken.getAddress(),
          1,
          true
        )
      ).to.be.revertedWith("Not the order owner");
    });
  });

  describe("Order Book Management", function () {
    it("Should track order IDs correctly", async function () {
      const amount = ethers.parseEther("100");
      const price = ethers.parseEther("10");
      // Total cost per order = 100 * 10 = 1000, need 2 orders = 2000
      const totalCost = ethers.parseEther("2000");

      await paymentToken.connect(trader1).approve(await exchange.getAddress(), totalCost);

      // Create multiple orders
      await exchange.connect(trader1).createLimitOrder(
        await fractionalToken.getAddress(),
        true,
        amount,
        price
      );

      await exchange.connect(trader1).createLimitOrder(
        await fractionalToken.getAddress(),
        true,
        amount,
        price
      );

      const orderIds = await exchange.getBuyOrderIds(await fractionalToken.getAddress());
      expect(orderIds.length).to.equal(2);
    });

    it("Should handle order removal correctly", async function () {
      const amount = ethers.parseEther("100");
      const price = ethers.parseEther("10");
      // Total cost per order = 100 * 10 = 1000, need 3 orders = 3000
      const totalCost = ethers.parseEther("3000");

      await paymentToken.connect(trader1).approve(await exchange.getAddress(), totalCost);

      // Create 3 orders
      await exchange.connect(trader1).createLimitOrder(
        await fractionalToken.getAddress(),
        true,
        amount,
        price
      );
      await exchange.connect(trader1).createLimitOrder(
        await fractionalToken.getAddress(),
        true,
        amount,
        price
      );
      await exchange.connect(trader1).createLimitOrder(
        await fractionalToken.getAddress(),
        true,
        amount,
        price
      );

      // Cancel middle order
      await exchange.connect(trader1).cancelOrder(
        await fractionalToken.getAddress(),
        2,
        true
      );

      const orderIds = await exchange.getBuyOrderIds(await fractionalToken.getAddress());
      expect(orderIds.length).to.equal(2);
      expect(orderIds).to.not.include(2);
    });
  });
});
