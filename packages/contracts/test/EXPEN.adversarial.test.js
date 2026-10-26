const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("EXPEN Adversarial & Stress Suite", function () {
  let expen;
  let owner;
  let attacker;
  let user1;
  let user2;
  let user3;

  beforeEach(async function () {
    [owner, attacker, user1, user2, user3] = await ethers.getSigners();
    const EXPENFactory = await ethers.getContractFactory("EXPEN");
    expen = await EXPENFactory.deploy(owner.address);
    await expen.waitForDeployment();
  });

  describe("1. Mathematical Precision & Wei-level Daily Cap Boundaries", function () {
    it("should reject minting 50 EXPEN + 1 wei in a single call", async function () {
      const fiftyExpenPlusOneWei = ethers.parseEther("50") + 1n;
      await expect(
        expen.connect(owner).mint(user1.address, fiftyExpenPlusOneWei)
      ).to.be.revertedWith("EXPEN: Daily cap of 50 EXPEN exceeded");
    });

    it("should allow minting 50 EXPEN - 1 wei, then exactly 1 wei, then reject 1 additional wei", async function () {
      const fiftyMinusOneWei = ethers.parseEther("50") - 1n;
      
      // Step 1: Mint 50 EXPEN - 1 wei
      await expen.connect(owner).mint(user1.address, fiftyMinusOneWei);
      expect(await expen.balanceOf(user1.address)).to.equal(fiftyMinusOneWei);
      expect(await expen.getDailyMinted(user1.address)).to.equal(fiftyMinusOneWei);
      expect(await expen.getDailyRemaining(user1.address)).to.equal(1n);

      // Step 2: Mint the final 1 wei to reach exact cap
      await expen.connect(owner).mint(user1.address, 1n);
      expect(await expen.balanceOf(user1.address)).to.equal(ethers.parseEther("50"));
      expect(await expen.getDailyMinted(user1.address)).to.equal(ethers.parseEther("50"));
      expect(await expen.getDailyRemaining(user1.address)).to.equal(0n);

      // Step 3: Attempting 1 more wei must revert
      await expect(
        expen.connect(owner).mint(user1.address, 1n)
      ).to.be.revertedWith("EXPEN: Daily cap of 50 EXPEN exceeded");
    });

    it("should handle rapid succession micro-mints (50 mints of 1 EXPEN) accurately", async function () {
      const oneExpen = ethers.parseEther("1");
      for (let i = 1; i <= 50; i++) {
        await expen.connect(owner).mint(user1.address, oneExpen);
      }

      expect(await expen.balanceOf(user1.address)).to.equal(ethers.parseEther("50"));
      expect(await expen.getDailyMinted(user1.address)).to.equal(ethers.parseEther("50"));
      expect(await expen.getDailyRemaining(user1.address)).to.equal(0n);

      // 51st mint of 1 wei must fail
      await expect(
        expen.connect(owner).mint(user1.address, 1n)
      ).to.be.revertedWith("EXPEN: Daily cap of 50 EXPEN exceeded");
    });

    it("should reject type(uint256).max overflow attempt", async function () {
      const maxUint = ethers.MaxUint256;
      await expect(
        expen.connect(owner).mint(user1.address, maxUint)
      ).to.be.reverted;
    });
  });

  describe("2. Day Index Boundary Rollover Precision (block.timestamp / 1 days)", function () {
    it("should precisely rollover at exact 86400-second boundary", async function () {
      const currentBlockTime = await time.latest();
      const currentDayIndex = Math.floor(currentBlockTime / 86400);
      const targetDayStart = (currentDayIndex + 1) * 86400;
      
      // Advance to 100 seconds before day rollover
      await time.increaseTo(targetDayStart - 100);

      // Max out daily cap on day D
      await expen.connect(owner).mint(user1.address, ethers.parseEther("50"));
      expect(await expen.getDailyRemaining(user1.address)).to.equal(0n);

      // Pin the next block to the exact last second of day D: targetDayStart - 1
      const exactLastSecondDayD = targetDayStart - 1;
      await time.setNextBlockTimestamp(exactLastSecondDayD);

      // Still at day D: minting 1 wei in this exact block must revert
      await expect(
        expen.connect(owner).mint(user1.address, 1n)
      ).to.be.revertedWith("EXPEN: Daily cap of 50 EXPEN exceeded");

      // Pin the next block to the exact first second of day D+1: targetDayStart
      await time.setNextBlockTimestamp(targetDayStart);

      // Verify that at exact second 0 of Day D+1, minting 50 EXPEN succeeds
      await expen.connect(owner).mint(user1.address, ethers.parseEther("50"));
      expect(await expen.balanceOf(user1.address)).to.equal(ethers.parseEther("100"));
      expect(await expen.getDailyRemaining(user1.address)).to.equal(0n);

      // Advance by 86399 seconds to the exact last second of Day D+1: targetDayStart + 86399
      const exactLastSecondDayDPlus1 = targetDayStart + 86399;
      await time.setNextBlockTimestamp(exactLastSecondDayDPlus1);

      // Still day D+1: minting 1 wei must revert
      await expect(
        expen.connect(owner).mint(user1.address, 1n)
      ).to.be.revertedWith("EXPEN: Daily cap of 50 EXPEN exceeded");

      // Advance 1 second to exact second 0 of Day D+2: targetDayStart + 86400
      await time.setNextBlockTimestamp(targetDayStart + 86400);

      // Day D+2 allows fresh minting
      await expen.connect(owner).mint(user1.address, ethers.parseEther("20"));
      expect(await expen.balanceOf(user1.address)).to.equal(ethers.parseEther("120"));
    });
  });

  describe("3. Multi-wallet Isolation & Transfer Non-interference", function () {
    it("should strictly isolate caps across concurrent wallets", async function () {
      // Wallet 1 gets 50 EXPEN
      await expen.connect(owner).mint(user1.address, ethers.parseEther("50"));
      // Wallet 2 gets 30 EXPEN
      await expen.connect(owner).mint(user2.address, ethers.parseEther("30"));
      // Wallet 3 gets 10 EXPEN
      await expen.connect(owner).mint(user3.address, ethers.parseEther("10"));

      expect(await expen.getDailyRemaining(user1.address)).to.equal(0n);
      expect(await expen.getDailyRemaining(user2.address)).to.equal(ethers.parseEther("20"));
      expect(await expen.getDailyRemaining(user3.address)).to.equal(ethers.parseEther("40"));

      // User 1 cannot receive any more
      await expect(
        expen.connect(owner).mint(user1.address, 1n)
      ).to.be.revertedWith("EXPEN: Daily cap of 50 EXPEN exceeded");

      // User 2 can receive up to 20 EXPEN
      await expen.connect(owner).mint(user2.address, ethers.parseEther("20"));
      expect(await expen.getDailyRemaining(user2.address)).to.equal(0n);

      // User 3 can receive up to 40 EXPEN
      await expen.connect(owner).mint(user3.address, ethers.parseEther("40"));
      expect(await expen.getDailyRemaining(user3.address)).to.equal(0n);
    });

    it("should not allow token transfers to reset or evade daily reward cap", async function () {
      // User 1 reaches cap of 50 EXPEN
      await expen.connect(owner).mint(user1.address, ethers.parseEther("50"));

      // User 1 transfers entire balance to User 2
      await expen.connect(user1).transfer(user2.address, ethers.parseEther("50"));
      expect(await expen.balanceOf(user1.address)).to.equal(0n);
      expect(await expen.balanceOf(user2.address)).to.equal(ethers.parseEther("50"));

      // User 1 attempts to receive more rewards: must still be blocked by dailyMinted
      await expect(
        expen.connect(owner).mint(user1.address, 1n)
      ).to.be.revertedWith("EXPEN: Daily cap of 50 EXPEN exceeded");

      // User 2's dailyMinted is 0 despite having 50 EXPEN balance, so User 2 can still receive their daily reward
      expect(await expen.getDailyRemaining(user2.address)).to.equal(ethers.parseEther("50"));
      await expen.connect(owner).mint(user2.address, ethers.parseEther("50"));
      expect(await expen.balanceOf(user2.address)).to.equal(ethers.parseEther("100"));

      // User 2 transfers back to User 1
      await expen.connect(user2).transfer(user1.address, ethers.parseEther("100"));
      // User 2 is also now capped
      await expect(
        expen.connect(owner).mint(user2.address, 1n)
      ).to.be.revertedWith("EXPEN: Daily cap of 50 EXPEN exceeded");
    });
  });

  describe("4. Operator Access Control & Hostile Caller Scenarios", function () {
    it("should prevent unauthorized caller from minting, pausing, or unpausing", async function () {
      // Attacker tries mint
      await expect(
        expen.connect(attacker).mint(attacker.address, ethers.parseEther("10"))
      ).to.be.revertedWithCustomError(expen, "OwnableUnauthorizedAccount")
       .withArgs(attacker.address);

      // Attacker tries pause
      await expect(
        expen.connect(attacker).pause()
      ).to.be.revertedWithCustomError(expen, "OwnableUnauthorizedAccount")
       .withArgs(attacker.address);

      // Attacker tries unpause
      await expen.connect(owner).pause();
      await expect(
        expen.connect(attacker).unpause()
      ).to.be.revertedWithCustomError(expen, "OwnableUnauthorizedAccount")
       .withArgs(attacker.address);
    });

    it("should prevent unauthorized caller from transferring ownership", async function () {
      await expect(
        expen.connect(attacker).transferOwnership(attacker.address)
      ).to.be.revertedWithCustomError(expen, "OwnableUnauthorizedAccount")
       .withArgs(attacker.address);
    });

    it("should prevent deploying contract with zero-address initialOwner", async function () {
      const EXPENFactory = await ethers.getContractFactory("EXPEN");
      await expect(
        EXPENFactory.deploy(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(expen, "OwnableInvalidOwner")
       .withArgs(ethers.ZeroAddress);
    });

    it("should cleanly transfer ownership to new operator and revoke old operator rights", async function () {
      // Transfer ownership to user1
      await expen.connect(owner).transferOwnership(user1.address);
      expect(await expen.owner()).to.equal(user1.address);

      // Old owner can no longer mint
      await expect(
        expen.connect(owner).mint(user2.address, ethers.parseEther("10"))
      ).to.be.revertedWithCustomError(expen, "OwnableUnauthorizedAccount")
       .withArgs(owner.address);

      // New owner can mint
      await expen.connect(user1).mint(user2.address, ethers.parseEther("10"));
      expect(await expen.balanceOf(user2.address)).to.equal(ethers.parseEther("10"));
    });
  });

  describe("5. Pause & Emergency Stop Stress Testing", function () {
    it("should strictly block minting, direct transfers, and transferFrom when paused", async function () {
      // Setup initial tokens
      await expen.connect(owner).mint(user1.address, ethers.parseEther("20"));
      await expen.connect(user1).approve(user2.address, ethers.parseEther("10"));

      // Pause contract
      await expen.connect(owner).pause();
      expect(await expen.paused()).to.equal(true);

      // 1. Minting blocked
      await expect(
        expen.connect(owner).mint(user1.address, ethers.parseEther("10"))
      ).to.be.revertedWithCustomError(expen, "EnforcedPause");

      // 2. Direct transfer blocked
      await expect(
        expen.connect(user1).transfer(user3.address, ethers.parseEther("5"))
      ).to.be.revertedWithCustomError(expen, "EnforcedPause");

      // 3. Delegated transferFrom blocked
      await expect(
        expen.connect(user2).transferFrom(user1.address, user3.address, ethers.parseEther("5"))
      ).to.be.revertedWithCustomError(expen, "EnforcedPause");

      // 4. Double pause attempt reverts
      await expect(
        expen.connect(owner).pause()
      ).to.be.revertedWithCustomError(expen, "EnforcedPause");

      // Unpause contract
      await expen.connect(owner).unpause();
      expect(await expen.paused()).to.equal(false);

      // 5. Double unpause attempt reverts
      await expect(
        expen.connect(owner).unpause()
      ).to.be.revertedWithCustomError(expen, "ExpectedPause");

      // 6. Operations resume seamlessly
      await expen.connect(user1).transfer(user3.address, ethers.parseEther("5"));
      expect(await expen.balanceOf(user3.address)).to.equal(ethers.parseEther("5"));

      await expen.connect(user2).transferFrom(user1.address, user3.address, ethers.parseEther("5"));
      expect(await expen.balanceOf(user3.address)).to.equal(ethers.parseEther("10"));

      await expen.connect(owner).mint(user1.address, ethers.parseEther("10"));
      expect(await expen.balanceOf(user1.address)).to.equal(ethers.parseEther("20"));
    });
  });

  describe("6. Input Validation & Edge Boundaries", function () {
    it("should revert when minting to address(0)", async function () {
      await expect(
        expen.connect(owner).mint(ethers.ZeroAddress, ethers.parseEther("10"))
      ).to.be.revertedWith("EXPEN: cannot mint to zero address");
    });

    it("should revert when minting 0 amount", async function () {
      await expect(
        expen.connect(owner).mint(user1.address, 0)
      ).to.be.revertedWith("EXPEN: mint amount must be greater than zero");
    });

    it("should allow self-transfers without corrupting balances or daily tallies", async function () {
      await expen.connect(owner).mint(user1.address, ethers.parseEther("10"));
      await expen.connect(user1).transfer(user1.address, ethers.parseEther("5"));
      expect(await expen.balanceOf(user1.address)).to.equal(ethers.parseEther("10"));
      expect(await expen.getDailyMinted(user1.address)).to.equal(ethers.parseEther("10"));
    });
  });
});
