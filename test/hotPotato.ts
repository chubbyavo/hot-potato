import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { HotPotato, HotPotato__factory } from "../typechain";

async function increaseEvmTime(seconds: number) {
  await network.provider.send("evm_increaseTime", [seconds]);
  await network.provider.send("evm_mine");
}

async function setNextBlockTimestamp(timestamp: number) {
  await network.provider.send("evm_setNextBlockTimestamp", [timestamp]);
}

describe("HotPotato contract", function () {
  let hotPotatoFactory: HotPotato__factory;
  let hotPotato: HotPotato;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    hotPotatoFactory = (await ethers.getContractFactory(
      "HotPotato"
    )) as HotPotato__factory;
    hotPotato = await hotPotatoFactory.deploy();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("ERC721", function () {
    it("Should have expected name and symbol", async function () {
      expect(await hotPotato.name()).to.equal("HotPotato");
      expect(await hotPotato.symbol()).to.equal("HOT");
    });

    it("Should mint with auto-incremented id", async function () {
      hotPotato = await hotPotatoFactory.deploy();

      await hotPotato.safeMint(owner.address);
      expect(await hotPotato.ownerOf(0)).to.equal(owner.address);
      expect(await hotPotato.balanceOf(owner.address)).to.equal(1);

      await hotPotato.connect(addr1).safeMint(addr2.address);
      expect(await hotPotato.ownerOf(1)).to.equal(addr2.address);
      expect(await hotPotato.balanceOf(addr2.address)).to.equal(1);
    });
  });

  describe("HotPotato - bake", function () {
    it("Should not be able to transfer if not owner", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.safeMint(owner.address);

      await expect(hotPotato.connect(addr1).bake(0)).to.be.revertedWith(
        "bake caller is not owner"
      );
    });

    it("Should update lastToss after bake", async function () {
      hotPotato = await hotPotatoFactory.deploy();

      const now = Date.now();
      setNextBlockTimestamp(now + 420);
      await hotPotato.safeMint(owner.address);
      expect(await hotPotato.lastTossed(0)).to.equal(now + 420);

      setNextBlockTimestamp(now + 840);
      await hotPotato.bake(0);
      expect(await hotPotato.lastTossed(0)).to.equal(now + 840);
    });
  });

  describe("HotPotato - Hot/Cold Logic", function () {
    it("Should be hot after mint", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.safeMint(owner.address);
      expect(await hotPotato.isHot(0)).to.true;
    });

    it("Should be still hot after 23 hours", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.safeMint(owner.address);
      expect(await hotPotato.isHot(0)).to.true;

      await increaseEvmTime(3600 * 23);

      expect(await hotPotato.isHot(0)).to.true;
    });

    it("Should become cold after 1 day", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.safeMint(owner.address);
      expect(await hotPotato.isHot(0)).to.true;

      await increaseEvmTime(3600 * 24);

      expect(await hotPotato.isHot(0)).to.false;
    });

    it("Should be able to transfer hot potato", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.safeMint(owner.address);
      expect(await hotPotato.isHot(0)).to.true;

      await hotPotato.transferFrom(owner.address, addr1.address, 0);
      expect(await hotPotato.ownerOf(0)).to.equal(addr1.address);
    });

    it("Hotness timer gets reset upon transfer", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.safeMint(owner.address);
      expect(await hotPotato.isHot(0)).to.true;

      await increaseEvmTime(3600 * 23);

      await hotPotato.transferFrom(owner.address, addr1.address, 0);
      expect(await hotPotato.ownerOf(0)).to.equal(addr1.address);

      await increaseEvmTime(3600 * 23.5);
      expect(await hotPotato.isHot(0)).to.true;
    });

    it("Should not be able to transfer cold potato", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.safeMint(owner.address);
      expect(await hotPotato.isHot(0)).to.true;

      await increaseEvmTime(3600 * 24);
      expect(await hotPotato.isHot(0)).to.false;

      await expect(
        hotPotato.transferFrom(owner.address, addr1.address, 0)
      ).to.be.revertedWith("Cannot transfer cold potato");
    });
  });
});
