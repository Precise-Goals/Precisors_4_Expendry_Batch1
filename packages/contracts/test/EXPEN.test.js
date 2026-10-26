const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EXPEN ERC-20 Token", function () {
  let expen;
  let owner;
  let operator;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, operator, user1, user2] = await ethers.getSigners();
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
  });

  describe("Operator-controlled Minting", function () {
    it("should allow owner to mint tokens to an address", async function () {
      const mintAmount = ethers.parseEther("10");
      await expen.connect(owner).mint(user1.address, mintAmount);
      expect(await expen.balanceOf(user1.address)).to.equal(mintAmount);
      expect(await expen.totalSupply()).to.equal(mintAmount);
    });

    it("should emit Transfer event on successful mint", async function () {
      const mintAmount = ethers.parseEther("10");
      await expect(expen.connect(owner).mint(user1.address, mintAmount))
        .to.emit(expen, "Transfer")
        .withArgs(ethers.ZeroAddress, user1.address, mintAmount);
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
});
