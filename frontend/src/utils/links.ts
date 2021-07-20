import { Network, getNetwork } from "./network";

function createExplorerLink(type: string, id: string): string {
  switch (getNetwork()) {
    case Network.Polygon:
      return `https://polygonscan.com/${type}/${id}`;
    case Network.Ropsten:
      return `https://ropsten.etherscan.io/${type}/${id}`;
    default:
      return `https:etherscan.io/${type}/${id}`;
    // Fallback to mainnet etherscan;
  }
}

export function createExplorerAddressLink(address: string): string {
  return createExplorerLink("address", address);
}

export function createExplorerTxLink(txHash: string): string {
  return createExplorerLink("tx", txHash);
}
