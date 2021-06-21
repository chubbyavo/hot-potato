import { expect } from "chai";
import { ethers, network } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("HotPotato contract", function () {
  let HotPotato: ContractFactory;
  let hotPotato: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    HotPotato = await ethers.getContractFactory("HotPotato");
    hotPotato = await HotPotato.deploy();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("ERC721", function () {
    it("Should have expected name and symbol", async function () {
      expect(await hotPotato.name()).to.equal("HotPotato");
      expect(await hotPotato.symbol()).to.equal("HOT");
    });

    it("Should mint with auto-incremented id", async function () {
      hotPotato = await HotPotato.deploy();

      await hotPotato.safeMint(owner.address);
      expect(await hotPotato.ownerOf(0)).to.equal(owner.address);
      expect(await hotPotato.balanceOf(owner.address)).to.equal(1);

      await hotPotato.connect(addr1).safeMint(addr2.address);
      expect(await hotPotato.ownerOf(1)).to.equal(addr2.address);
      expect(await hotPotato.balanceOf(addr2.address)).to.equal(1);
    });
  });

  describe("HotPotato Logic", function () {
    it("Minted potato should be hot", async function () {
      hotPotato = await HotPotato.deploy();
      await hotPotato.safeMint(owner.address);
      expect(await hotPotato.isHot(0)).to.true;
    });

    it("Potato is still hot after 23 hours", async function () {
      hotPotato = await HotPotato.deploy();
      await hotPotato.safeMint(owner.address);
      expect(await hotPotato.isHot(0)).to.true;

      await network.provider.send("evm_increaseTime", [3600 * 23]);
      await network.provider.send("evm_mine");

      expect(await hotPotato.isHot(0)).to.true;
    });

    it("Potato becomes cold after 1 day", async function () {
      hotPotato = await HotPotato.deploy();
      await hotPotato.safeMint(owner.address);
      expect(await hotPotato.isHot(0)).to.true;

      await network.provider.send("evm_increaseTime", [3600 * 24]);
      await network.provider.send("evm_mine");

      expect(await hotPotato.isHot(0)).to.false;
    });
  });
});
