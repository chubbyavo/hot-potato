import * as dotenv from "dotenv";

dotenv.config();
const { REACT_APP_DEPLOYMENT_ENV } = process.env;

function createExplorerLink(type: string, id: string): string {
  if (REACT_APP_DEPLOYMENT_ENV === "POLYGON") {
    return `https://polygonscan.com/${type}/${id}`;
  }

  if (REACT_APP_DEPLOYMENT_ENV === "ROPSTEN") {
    return `https://ropsten.etherscan.io/${type}/${id}`;
  }

  if (REACT_APP_DEPLOYMENT_ENV === "RINKEBY") {
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
