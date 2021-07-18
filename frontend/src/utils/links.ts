import * as dotenv from "dotenv";

dotenv.config();
const { DEPLOYMENT_ENV } = process.env;

function createExplorerLink(type: string, id: string): string {
  if (DEPLOYMENT_ENV === "POLYGON") {
    return `https://polygonscan.com/${type}/${id}`;
  }

  if (DEPLOYMENT_ENV === "ROPSTEN") {
    return `https://ropsten.etherscan.io/${type}/${id}`;
  }

  if (DEPLOYMENT_ENV === "RINKEBY") {
    return `https://rinkeby.etherscan.io/${type}/${id}`;
  }

  // Fallback to mainnet etherscan;
  return `https:etherscan.io/${type}/${id}`;
}

export function createExplorerAddressLink(address: string): string {
  return createExplorerLink("address", address);
}

export function createExplorerTxLink(txHash: string): string {
  return createExplorerLink("tx", txHash);
}
