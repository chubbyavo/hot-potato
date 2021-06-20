import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";

describe("HotPotato contract", function () {
  let HotPotato: ContractFactory;
  let hotPotato: Contract;

  beforeEach(async function () {
    HotPotato = await ethers.getContractFactory("HotPotato");
    hotPotato = await HotPotato.deploy();
  });

  it("Test", async function () {
    expect(true).to.be.true;
  });
});
