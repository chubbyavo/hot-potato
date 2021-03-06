import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { HotPotato, HotPotato__factory } from "../typechain";

const MINT_FEE = ethers.utils.parseEther("0.00001");
const BURN_FEE = ethers.utils.parseEther("0.00001");

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

  describe("HotPotato - Basic ERC721", function () {
    it("Should have expected name and symbol", async function () {
      expect(await hotPotato.name()).to.equal("HotPotato");
      expect(await hotPotato.symbol()).to.equal("HOT");
    });
  });

  describe("HotPotato - type and uri", function () {
    it("Should be able addType if owner", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");

      expect(await hotPotato.tokenTypeToURI(0)).to.be.equal(
        "https://foobar.com/potato/0"
      );

      await hotPotato.addType("https://foobar.com/potato/1");
      expect(await hotPotato.tokenTypeToURI(1)).to.be.equal(
        "https://foobar.com/potato/1"
      );
    });

    it("Should not be able addType if not owner", async function () {
      await expect(
        hotPotato.connect(addr1).addType("https://foobar.com/potato/0")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should be able update type if owner", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/old");
      await hotPotato.updateType(0, "https://foobar.com/potato/new");

      expect(await hotPotato.tokenTypeToURI(0)).to.be.equal(
        "https://foobar.com/potato/new"
      );
    });

    it("Should not be able updateType if not owner", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/old");
      await expect(
        hotPotato.connect(addr1).updateType(0, "https://foobar.com/potato/new")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("HotPotato - safeMintWithType", function () {
    it("Should not be able to mint without fee", async function () {
      await expect(hotPotato.safeMint(0, owner.address)).to.be.revertedWith(
        "Incorrect mint fee"
      );
    });

    it("Should not be able to mint type that doesn't exist.", async function () {
      hotPotato = await hotPotatoFactory.deploy();

      await expect(
        hotPotato.safeMint(0, owner.address, { value: MINT_FEE })
      ).to.be.revertedWith("Nonexistent token type");
    });

    it("Should mint with auto-incremented id", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");
      await hotPotato.addType("https://foobar.com/potato/1");

      await hotPotato.safeMint(0, owner.address, { value: MINT_FEE });
      expect(await hotPotato.ownerOf(0)).to.equal(owner.address);
      expect(await hotPotato.tokenURI(0)).to.equal(
        "https://foobar.com/potato/0"
      );
      expect(await hotPotato.balanceOf(owner.address)).to.equal(1);

      await hotPotato
        .connect(addr1)
        .safeMint(1, addr2.address, { value: MINT_FEE });
      expect(await hotPotato.ownerOf(1)).to.equal(addr2.address);
      expect(await hotPotato.tokenURI(1)).to.equal(
        "https://foobar.com/potato/1"
      );
      expect(await hotPotato.balanceOf(addr2.address)).to.equal(1);
    });

    it("Should emit events", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");

      await expect(hotPotato.safeMint(0, owner.address, { value: MINT_FEE }))
        .to.emit(hotPotato, "Transfer")
        .withArgs(ethers.constants.AddressZero, owner.address, 0);

      await expect(
        hotPotato.connect(addr1).safeMint(0, addr2.address, { value: MINT_FEE })
      )
        .to.emit(hotPotato, "Transfer")
        .withArgs(addr1.address, addr2.address, 1);
    });
  });

  describe("HotPotato - burn", function () {
    it("Should not be able to burn if not owner", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");

      await hotPotato.safeMint(0, owner.address, { value: MINT_FEE });

      await expect(
        hotPotato.connect(addr1).burn(0, { value: BURN_FEE })
      ).to.be.revertedWith("burn caller is not owner");
    });

    it("Should not be able to burn with incorrect fee", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");
      await hotPotato.safeMint(0, owner.address, { value: MINT_FEE });

      await expect(hotPotato.burn(0)).to.be.revertedWith("Incorrect burn fee");
    });

    it("Should update relevant details when a potato is burned", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");

      await hotPotato.safeMint(0, owner.address, { value: MINT_FEE });
      await hotPotato.safeMint(0, owner.address, { value: MINT_FEE });
      expect(await hotPotato.balanceOf(owner.address)).to.equal(2);
      expect(await hotPotato.totalSupply()).to.equal(2);

      await expect(hotPotato.burn(0, { value: BURN_FEE }))
        .to.emit(hotPotato, "Burn")
        .withArgs(owner.address, 0);

      expect(await hotPotato.balanceOf(owner.address)).to.equal(1);
      expect(await hotPotato.lastTossed(0)).to.equal(0);
      expect(await hotPotato.tokenIdToType(0)).to.equal(0);
      expect(await hotPotato.tokenOfOwnerByIndex(owner.address, 0)).to.eq(1);
      expect(await hotPotato.totalSupply()).to.equal(1);
      await expect(hotPotato.tokenURI(0)).to.be.revertedWith(
        "ERC721Metadata: URI query for nonexistent token"
      );
    });
  });

  describe("HotPotato - setFees", function () {
    it("Should not be able to setFees if not owner", async function () {
      const newFee = ethers.utils.parseEther("0.1");
      await expect(
        hotPotato.connect(addr1).setFees(newFee, newFee)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should be able to setFees if owner", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      const newMintFee = ethers.utils.parseEther("0.01");
      const newBurnFee = ethers.utils.parseEther("0.03");
      await hotPotato.setFees(newMintFee, newBurnFee);

      expect(await hotPotato.mintFee()).to.be.equal(newMintFee);
      expect(await hotPotato.burnFee()).to.be.equal(newBurnFee);
    });

    it("Should revert if previous fees are used", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");

      const newMintFee = ethers.utils.parseEther("0.01");
      const newBurnFee = ethers.utils.parseEther("0.03");
      await hotPotato.setFees(newMintFee, newBurnFee);

      await expect(
        hotPotato.safeMint(0, owner.address, { value: MINT_FEE })
      ).to.be.revertedWith("Incorrect mint fee");

      await hotPotato.safeMint(0, owner.address, { value: newMintFee });
      await expect(hotPotato.burn(0, { value: BURN_FEE })).to.be.revertedWith(
        "Incorrect burn fee"
      );
    });
  });

  describe("HotPotato - withdrawFees", function () {
    it("Should withdraw accumulated fees", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");

      await hotPotato.safeMint(0, owner.address, { value: MINT_FEE });
      await hotPotato.burn(0, { value: BURN_FEE });

      expect(await hotPotato.withdrawFees()).to.changeEtherBalance(
        owner,
        MINT_FEE.add(BURN_FEE)
      );
    });

    it("Should not be able to withdraw if not owner", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");
      await hotPotato.safeMint(0, owner.address, { value: MINT_FEE });
      await hotPotato.burn(0, { value: BURN_FEE });

      await expect(hotPotato.connect(addr1).withdrawFees()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("HotPotato - setHotDuration", function () {
    it("Should not be able to setHotDuration if not owner", async function () {
      await expect(
        hotPotato.connect(addr1).setHotDuration(42)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should be able to setHotDuration if owner", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.setHotDuration(3600 * 48);
      expect(await hotPotato.hotDuration()).to.be.equal(3600 * 48);
    });
  });

  describe("HotPotato - Hot/Cold Logic", function () {
    it("Should be hot after mint", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");

      await hotPotato.safeMint(0, owner.address, { value: MINT_FEE });
      expect(await hotPotato.isHot(0)).to.true;
    });

    it("Should be still hot after 23 hours", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");

      await hotPotato.safeMint(0, owner.address, { value: MINT_FEE });
      expect(await hotPotato.isHot(0)).to.true;

      await increaseEvmTime(3600 * 23);

      expect(await hotPotato.isHot(0)).to.true;
    });

    it("Should become cold after 1 day", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");

      await hotPotato.safeMint(0, owner.address, { value: MINT_FEE });
      expect(await hotPotato.isHot(0)).to.true;

      await increaseEvmTime(3600 * 24);

      expect(await hotPotato.isHot(0)).to.false;
    });

    it("Should use new hotDuration when it's updated", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");

      await hotPotato.safeMint(0, owner.address, { value: MINT_FEE });
      expect(await hotPotato.isHot(0)).to.true;

      await increaseEvmTime(3600 * 24);
      expect(await hotPotato.isHot(0)).to.false;

      await hotPotato.setHotDuration(3600 * 48);
      expect(await hotPotato.isHot(0)).to.true;
    });

    it("Should be able to transfer hot potato", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");

      await hotPotato.safeMint(0, owner.address, { value: MINT_FEE });
      expect(await hotPotato.isHot(0)).to.true;

      await hotPotato.transferFrom(owner.address, addr1.address, 0);
      expect(await hotPotato.ownerOf(0)).to.equal(addr1.address);
    });

    it("Hotness timer gets reset upon transfer", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");

      await hotPotato.safeMint(0, owner.address, { value: MINT_FEE });
      expect(await hotPotato.isHot(0)).to.true;

      await increaseEvmTime(3600 * 23);

      await hotPotato.transferFrom(owner.address, addr1.address, 0);
      expect(await hotPotato.ownerOf(0)).to.equal(addr1.address);

      await increaseEvmTime(3600 * 23.5);
      expect(await hotPotato.isHot(0)).to.true;
    });

    it("Should not be able to transfer cold potato", async function () {
      hotPotato = await hotPotatoFactory.deploy();
      await hotPotato.addType("https://foobar.com/potato/0");

      await hotPotato.safeMint(0, owner.address, { value: MINT_FEE });
      expect(await hotPotato.isHot(0)).to.true;

      await increaseEvmTime(3600 * 24);
      expect(await hotPotato.isHot(0)).to.false;

      await expect(
        hotPotato.transferFrom(owner.address, addr1.address, 0)
      ).to.be.revertedWith("Cannot transfer cold potato");
    });
  });
});
