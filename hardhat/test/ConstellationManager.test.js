const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ConstellationManager", function () {
  let constellationManager, domainNFT, genesisEngine, fractionalizer;
  let owner, curator, user1, user2;

  beforeEach(async function () {
    [owner, curator, user1, user2] = await ethers.getSigners();

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

    // Setup
    await genesisEngine.setAddresses(
      await domainNFT.getAddress(),
      await fractionalizer.getAddress()
    );
    await domainNFT.setGenesisEngineAddress(await genesisEngine.getAddress());
    await fractionalizer.setGenesisEngineAddress(await genesisEngine.getAddress());

    // Deploy ConstellationManager
    const ConstellationManager = await ethers.getContractFactory("ConstellationManager");
    constellationManager = await ConstellationManager.deploy(await domainNFT.getAddress());
    await constellationManager.waitForDeployment();

    // Mint some NFTs for testing
    await domainNFT.setGenesisEngineAddress(owner.address); // Temporarily allow owner to mint
    await domainNFT.safeMint(curator.address, "ai-domain1.com", 850);
    await domainNFT.safeMint(curator.address, "ai-domain2.com", 900);
    await domainNFT.safeMint(curator.address, "ai-domain3.com", 875);
  });

  describe("Create Constellation", function () {
    it("Should create a constellation with multiple NFTs", async function () {
      const tokenIds = [1, 2, 3];
      const sharesPerNFT = ethers.parseEther("1000");

      // Approve NFTs
      for (let tokenId of tokenIds) {
        await domainNFT.connect(curator).approve(await constellationManager.getAddress(), tokenId);
      }

      const tx = await constellationManager.connect(curator).createConstellation(
        "Orion AI Domains",
        "ORION",
        tokenIds,
        sharesPerNFT
      );

      await expect(tx)
        .to.emit(constellationManager, "ConstellationCreated");
      // Note: We check the event was emitted, but don't check shareToken address
      // since it's dynamically created

      // Verify constellation details
      const [name, symbol, shareToken, nftCount, totalShares, curatorAddr, active] = 
        await constellationManager.getConstellation(1);

      expect(name).to.equal("Orion AI Domains");
      expect(symbol).to.equal("ORION");
      expect(nftCount).to.equal(3);
      expect(totalShares).to.equal(sharesPerNFT * 3n);
      expect(curatorAddr).to.equal(curator.address);
      expect(active).to.be.true;

      // Verify NFTs are transferred
      for (let tokenId of tokenIds) {
        expect(await domainNFT.ownerOf(tokenId)).to.equal(await constellationManager.getAddress());
      }

      // Verify curator received shares
      const ConstellationToken = await ethers.getContractFactory("ConstellationToken");
      const token = ConstellationToken.attach(shareToken);
      expect(await token.balanceOf(curator.address)).to.equal(sharesPerNFT * 3n);
    });

    it("Should reject empty constellation", async function () {
      await expect(
        constellationManager.connect(curator).createConstellation(
          "Empty",
          "EMPTY",
          [],
          ethers.parseEther("1000")
        )
      ).to.be.revertedWith("Must include at least one NFT");
    });

    it("Should reject if not NFT owner", async function () {
      await domainNFT.connect(curator).approve(await constellationManager.getAddress(), 1);

      await expect(
        constellationManager.connect(user1).createConstellation(
          "Test",
          "TEST",
          [1],
          ethers.parseEther("1000")
        )
      ).to.be.revertedWith("Not owner of NFT");
    });
  });

  describe("Add NFT to Constellation", function () {
    beforeEach(async function () {
      // Create initial constellation
      await domainNFT.connect(curator).approve(await constellationManager.getAddress(), 1);
      await constellationManager.connect(curator).createConstellation(
        "Test Constellation",
        "TEST",
        [1],
        ethers.parseEther("1000")
      );
    });

    it("Should allow curator to add NFT", async function () {
      await domainNFT.connect(curator).approve(await constellationManager.getAddress(), 2);

      const tx = await constellationManager.connect(curator).addNFTToConstellation(
        1,
        2,
        ethers.parseEther("1000")
      );

      await expect(tx)
        .to.emit(constellationManager, "NFTAddedToConstellation")
        .withArgs(1, 2);

      const nfts = await constellationManager.getConstellationNFTs(1);
      expect(nfts.length).to.equal(2);
    });

    it("Should reject non-curator", async function () {
      await domainNFT.connect(curator).transferFrom(curator.address, user1.address, 2);
      await domainNFT.connect(user1).approve(await constellationManager.getAddress(), 2);

      await expect(
        constellationManager.connect(user1).addNFTToConstellation(
          1,
          2,
          ethers.parseEther("1000")
        )
      ).to.be.revertedWith("Not the curator");
    });
  });

  describe("Redeem Shares", function () {
    beforeEach(async function () {
      // Create constellation with 3 NFTs
      const tokenIds = [1, 2, 3];
      for (let tokenId of tokenIds) {
        await domainNFT.connect(curator).approve(await constellationManager.getAddress(), tokenId);
      }

      await constellationManager.connect(curator).createConstellation(
        "Test Constellation",
        "TEST",
        tokenIds,
        ethers.parseEther("3000") // 3000 shares per NFT = 9000 total
      );

      // Get share token and transfer some to user1
      const [, , shareToken] = await constellationManager.getConstellation(1);
      const ConstellationToken = await ethers.getContractFactory("ConstellationToken");
      const token = ConstellationToken.attach(shareToken);
      await token.connect(curator).transfer(user1.address, ethers.parseEther("3000")); // 1 NFT worth
    });

    it("Should allow redeeming shares for NFTs", async function () {
      const tx = await constellationManager.connect(user1).redeemShares(
        1,
        ethers.parseEther("3000") // Redeem 1 NFT worth
      );

      await expect(tx).to.emit(constellationManager, "SharesBurned");

      // User should now own 1 NFT
      const balance = await domainNFT.balanceOf(user1.address);
      expect(balance).to.equal(1);

      // Constellation should have 2 NFTs left
      const nfts = await constellationManager.getConstellationNFTs(1);
      expect(nfts.length).to.equal(2);
    });

    it("Should reject if insufficient shares", async function () {
      await expect(
        constellationManager.connect(user1).redeemShares(
          1,
          ethers.parseEther("10000") // More than user has
        )
      ).to.be.revertedWith("Insufficient shares");
    });
  });

  describe("Query Functions", function () {
    it("Should return total constellations", async function () {
      expect(await constellationManager.totalConstellations()).to.equal(0);

      await domainNFT.connect(curator).approve(await constellationManager.getAddress(), 1);
      await constellationManager.connect(curator).createConstellation(
        "Test",
        "TEST",
        [1],
        ethers.parseEther("1000")
      );

      expect(await constellationManager.totalConstellations()).to.equal(1);
    });

    it("Should return constellation NFTs", async function () {
      const tokenIds = [1, 2, 3];
      for (let tokenId of tokenIds) {
        await domainNFT.connect(curator).approve(await constellationManager.getAddress(), tokenId);
      }

      await constellationManager.connect(curator).createConstellation(
        "Test",
        "TEST",
        tokenIds,
        ethers.parseEther("1000")
      );

      const nfts = await constellationManager.getConstellationNFTs(1);
      expect(nfts.length).to.equal(3);
      expect(nfts[0]).to.equal(1);
      expect(nfts[1]).to.equal(2);
      expect(nfts[2]).to.equal(3);
    });
  });
});
