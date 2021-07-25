import { HotPotato__factory } from "../typechain";

// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const accounts = await hre.ethers.getSigners();
  const hotPotato = HotPotato__factory.connect(
    "0x2aA9AFaB145a0d62e1FFA956B41d39a19CA4b219",
    accounts[0]
  );

  await hotPotato.addType("https://foobar.com/potato/2", { gasLimit: 100000 });
  console.log("Added a new type to ", hotPotato.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
