import * as dotenv from "dotenv";

dotenv.config();
const {
  REACT_APP_DEPLOYMENT_ENV,
  REACT_APP_RPC_URL_ROPSTEN,
  REACT_APP_RPC_URL_POLYGON,
} = process.env;

const ROPSTEN_CHAIN_ID = 3;
const POLYGON_CHAIN_ID = 137;
const HARDHAT_CHAIN_ID = 31337;

export enum Network {
  HardHat = "HardHat",
  Ropsten = "Ropsten",
  Polygon = "Polygon",
}

export function getNetwork(): Network {
  switch (REACT_APP_DEPLOYMENT_ENV) {
    case "Ropsten":
      return Network.Ropsten;
    case "Polygon":
      return Network.Polygon;
    default:
      return Network.HardHat;
  }
}

export const networkToChainId = new Map([
  [Network.Ropsten, ROPSTEN_CHAIN_ID],
  [Network.Polygon, POLYGON_CHAIN_ID],
  [Network.HardHat, HARDHAT_CHAIN_ID],
]);

export function getSupportedChainIds(): number[] {
  const chainId = networkToChainId.get(getNetwork()) || HARDHAT_CHAIN_ID;
  return [chainId];
}

export function getRpcForWalletConnect(): { [chainId: number]: string } {
  switch (REACT_APP_DEPLOYMENT_ENV) {
    case "Ropsten":
      return { 3: REACT_APP_RPC_URL_ROPSTEN || "" };
    case "Polygon":
      return { 137: REACT_APP_RPC_URL_POLYGON || "" };
    default:
      return {};
  }
}
