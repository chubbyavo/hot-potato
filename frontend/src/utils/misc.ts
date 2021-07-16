export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function trimAddressForDisplay(address: string): string {
  return address.substring(0, 6) + "..." + address.substring(38);
}

export function createEtherScanAddressLink(address: string): string {
  return `https:etherscan.io/address/${address}`;
}
