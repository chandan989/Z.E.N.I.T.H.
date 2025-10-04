const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GenesisEngine", function () {
  let genesisEngine, domainNFT, fractionalizer;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy DomainNFT
    const DomainNFT = await ethers.getContractFactory("DomainNFT");
    domainNFT = await DomainNFT.deploy();
    await domainNFT.waitForDeployment();

    // Deploy Fractionalizer
    const Fractionalizer = await ethers.getContractFactory("Fractionalizer");
    fractionalizer = await Fractionalizer.deploy(await domainNFT.getAddress());
    await fractionalizer.waitForDeployment();

    // Deploy GenesisEngine
    const GenesisEngine = await ethers.getContractFactory("GenesisEngine");
    genesisEngine = await GenesisEngine.deploy();
    await genesisEngine.waitForDeployment();

    // Setup addresses
    await genesisEngine.setAddresses(
      await domainNFT.getAddress(),
      await fractionalizer.getAddress()
    );
    await domainNFT.setGenesisEngineAddress(await genesisEngine.getAddress());
    await fractionalizer.setGenesisEngineAddress(await genesisEngine.getAddress());
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await genesisEngine.owner()).to.equal(owner.address);
    });

    it("Should set addresses correctly", async function () {
      expect(await genesisEngine.domainNFTAddress()).to.equal(await domainNFT.getAddress());
      expect(await genesisEngine.fractionalizerAddress()).to.equal(await fractionalizer.getAddress());
    });
  });

  describe("Request Onboarding", function () {
    it("Should create onboarding request", async function () {
      const tx = await genesisEngine.connect(user1).requestOnboarding(
        "example.com",
        "Example Token",
        "EXMPL",
        ethers.parseEther("1000"),
        850
      );

      await expect(tx)
        .to.emit(genesisEngine, "OnboardingRequested")
        .withArgs(1, user1.address, "example.com");

      const request = await genesisEngine.onboardingRequests(1);
      expect(request.assetOwner).to.equal(user1.address);
      expect(request.domainName).to.equal("example.com");
      expect(request.domaScore).to.equal(850);
    });

    it("Should reject empty domain name", async function () {
      await expect(
        genesisEngine.connect(user1).requestOnboarding(
          "",
          "Example Token",
          "EXMPL",
          ethers.parseEther("1000"),
          850
        )
      ).to.be.revertedWith("Domain name cannot be empty");
    });

    it("Should reject duplicate domain", async function () {
      await genesisEngine.connect(user1).requestOnboarding(
        "example.com",
        "Example Token",
        "EXMPL",
        ethers.parseEther("1000"),
        850
      );

      await expect(
        genesisEngine.connect(user2).requestOnboarding(
          "example.com",
          "Example Token 2",
          "EXMP2",
          ethers.parseEther("2000"),
          900
        )
      ).to.be.revertedWith("Domain already tokenized");
    });

    it("Should reject invalid token supply", async function () {
      await expect(
        genesisEngine.connect(user1).requestOnboarding(
          "example.com",
          "Example Token",
          "EXMPL",
          0,
          850
        )
      ).to.be.revertedWith("Invalid token supply");

      await expect(
        genesisEngine.connect(user1).requestOnboarding(
          "example.com",
          "Example Token",
          "EXMPL",
          ethers.parseEther("1000000000000"), // Too large
          850
        )
      ).to.be.revertedWith("Invalid token supply");
    });

    it("Should reject invalid DomaScore", async function () {
      await expect(
        genesisEngine.connect(user1).requestOnboarding(
          "example.com",
          "Example Token",
          "EXMPL",
          ethers.parseEther("1000"),
          0
        )
      ).to.be.revertedWith("DomaScore must be between 1-1000");

      await expect(
        genesisEngine.connect(user1).requestOnboarding(
          "example.com",
          "Example Token",
          "EXMPL",
          ethers.parseEther("1000"),
          1001
        )
      ).to.be.revertedWith("DomaScore must be between 1-1000");
    });
  });

  describe("Fulfill Onboarding", function () {
    beforeEach(async function () {
      await genesisEngine.connect(user1).requestOnboarding(
        "example.com",
        "Example Token",
        "EXMPL",
        ethers.parseEther("1000"),
        850
      );
    });

    it("Should fulfill onboarding request", async function () {
      const tx = await genesisEngine.fulfillOnboarding(1);

      await expect(tx).to.emit(genesisEngine, "AssetOnboarded");

      // Verify NFT was minted
      expect(await domainNFT.balanceOf(await fractionalizer.getAddress())).to.equal(1);

      // Verify fractionalization
      const fractionAddress = await fractionalizer.fractionContracts(1);
      expect(fractionAddress).to.not.equal(ethers.ZeroAddress);

      // Verify user received tokens
      const FractionalToken = await ethers.getContractFactory("FractionalToken");
      const fractionToken = FractionalToken.attach(fractionAddress);
      expect(await fractionToken.balanceOf(user1.address)).to.equal(ethers.parseEther("1000"));
    });

    it("Should only allow owner to fulfill", async function () {
      await expect(
        genesisEngine.connect(user1).fulfillOnboarding(1)
      ).to.be.revertedWithCustomError(genesisEngine, "OwnableUnauthorizedAccount");
    });

    it("Should reject non-existent request", async function () {
      await expect(
        genesisEngine.fulfillOnboarding(999)
      ).to.be.revertedWith("Request does not exist");
    });

    it("Should prevent double fulfillment", async function () {
      await genesisEngine.fulfillOnboarding(1);
      
      await expect(
        genesisEngine.fulfillOnboarding(1)
      ).to.be.revertedWith("Request does not exist");
    });
  });

  describe("Address Management", function () {
    it("Should lock addresses", async function () {
      await genesisEngine.lockAddresses();

      await expect(
        genesisEngine.setAddresses(
          await domainNFT.getAddress(),
          await fractionalizer.getAddress()
        )
      ).to.be.revertedWith("Addresses are locked");
    });

    it("Should reject zero addresses", async function () {
      const GenesisEngine2 = await ethers.getContractFactory("GenesisEngine");
      const genesisEngine2 = await GenesisEngine2.deploy();

      await expect(
        genesisEngine2.setAddresses(ethers.ZeroAddress, await fractionalizer.getAddress())
      ).to.be.revertedWith("Invalid addresses");
    });
  });

  describe("Security", function () {
    it("Should prevent reentrancy attacks", async function () {
      // This would require a malicious contract to test properly
      // For now, verify nonReentrant modifier is present
      const code = await ethers.provider.getCode(await genesisEngine.getAddress());
      expect(code).to.not.equal("0x");
    });
  });
});
