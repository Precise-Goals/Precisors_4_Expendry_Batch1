const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("EXPEN ERC-20 Token", function () {
  let expen;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const EXPENFactory = await ethers.getContractFactory("EXPEN");
    expen = await EXPENFactory.deploy(owner.address);
    await expen.waitForDeployment();
  });

  describe("Deployment & Metadata", function () {
    it("should deploy with correct name, symbol, and decimals", async function () {
      expect(await expen.name()).to.equal("EXPEN Token");
      expect(await expen.symbol()).to.equal("EXPEN");
      expect(await expen.decimals()).to.equal(18);
    });

    it("should have initial total supply of 0", async function () {
      expect(await expen.totalSupply()).to.equal(0);
    });

    it("should assign initial owner correctly", async function () {
      expect(await expen.owner()).to.equal(owner.address);
    });

    it("should have correct DAILY_CAP constant (50 EXPEN)", async function () {
      expect(await expen.DAILY_CAP()).to.equal(ethers.parseEther("50"));
    });
  });

  describe("Operator-controlled Minting", function () {
    it("should allow owner to mint tokens to an address", async function () {
      const mintAmount = ethers.parseEther("10");
      await expen.connect(owner).mint(user1.address, mintAmount);
      expect(await expen.balanceOf(user1.address)).to.equal(mintAmount);
      expect(await expen.totalSupply()).to.equal(mintAmount);
    });

    it("should emit Transfer and RewardMinted events on successful mint", async function () {
      const mintAmount = ethers.parseEther("10");
      await expect(expen.connect(owner).mint(user1.address, mintAmount))
        .to.emit(expen, "Transfer")
        .withArgs(ethers.ZeroAddress, user1.address, mintAmount)
        .and.to.emit(expen, "RewardMinted")
        .withArgs(user1.address, mintAmount, mintAmount);
    });

    it("should prevent non-owner from minting tokens", async function () {
      const mintAmount = ethers.parseEther("10");
      await expect(
        expen.connect(user1).mint(user1.address, mintAmount)
      ).to.be.revertedWithCustomError(expen, "OwnableUnauthorizedAccount");
    });

    it("should revert on zero-amount mint", async function () {
      await expect(
        expen.connect(owner).mint(user1.address, 0)
      ).to.be.revertedWith("EXPEN: mint amount must be greater than zero");
    });
  });

  describe("Daily Reward Cap Enforcement", function () {
    it("should allow minting up to 50 EXPEN per day in multiple batches", async function () {
      const tenExpen = ethers.parseEther("10");
      // 5 rewards of 10 EXPEN = 50 EXPEN
      for (let i = 0; i < 5; i++) {
        await expen.connect(owner).mint(user1.address, tenExpen);
      }
      expect(await expen.balanceOf(user1.address)).to.equal(ethers.parseEther("50"));
      expect(await expen.getDailyMinted(user1.address)).to.equal(ethers.parseEther("50"));
      expect(await expen.getDailyRemaining(user1.address)).to.equal(0);
    });

    it("should reject minting when 50 EXPEN daily cap is exceeded", async function () {
      await expen.connect(owner).mint(user1.address, ethers.parseEther("50"));
      // Attempting even 1 more wei of EXPEN should revert
      await expect(
        expen.connect(owner).mint(user1.address, ethers.parseEther("1"))
      ).to.be.revertedWith("EXPEN: Daily cap of 50 EXPEN exceeded");
    });

    it("should isolate daily caps per wallet", async function () {
      await expen.connect(owner).mint(user1.address, ethers.parseEther("50"));
      // User 2 should still be able to receive 50 EXPEN
      await expect(
        expen.connect(owner).mint(user2.address, ethers.parseEther("50"))
      ).to.not.be.reverted;
      expect(await expen.balanceOf(user2.address)).to.equal(ethers.parseEther("50"));
    });

    it("should reset daily cap when time advances by 24 hours", async function () {
      await expen.connect(owner).mint(user1.address, ethers.parseEther("50"));
      expect(await expen.getDailyRemaining(user1.address)).to.equal(0);

      // Advance time by 24 hours (86,400 seconds)
      await time.increase(86400);

      expect(await expen.getDailyRemaining(user1.address)).to.equal(ethers.parseEther("50"));
      // Minting next day should succeed
      await expect(
        expen.connect(owner).mint(user1.address, ethers.parseEther("10"))
      ).to.not.be.reverted;
      expect(await expen.balanceOf(user1.address)).to.equal(ethers.parseEther("60"));
    });
  });
});
