// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat

import { HotPotato__factory } from "../typechain";

// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const hotPotatoFactory = (await hre.ethers.getContractFactory(
    "HotPotato"
  )) as HotPotato__factory;
  const hotPotato = await hotPotatoFactory.deploy();

  await hotPotato.deployed();
  await hotPotato.addType("https://foobar.com/potato/0", { gasLimit: 100000 });
  await hotPotato.addType("https://foobar.com/potato/1", { gasLimit: 100000 });
  await hotPotato.addType("https://foobar.com/potato/2", { gasLimit: 100000 });

  console.log("HotPotato deployed to:", hotPotato.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
