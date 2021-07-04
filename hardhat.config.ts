import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-waffle";

import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();
const { ROPSTEN_API_URL, RINKEBY_API_URL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    hardhat: {},
    ropsten: {
      url: ROPSTEN_API_URL!,
      accounts: [PRIVATE_KEY!],
    },
    rinkeby: {
      url: RINKEBY_API_URL!,
      accounts: [PRIVATE_KEY!],
    },
  },
};

export default config;
