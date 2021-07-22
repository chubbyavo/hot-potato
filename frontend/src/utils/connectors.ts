import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { getRpcForWalletConnect, getSupportedChainIds } from "./network";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: getSupportedChainIds(),
});

export function getWalletConnectConnector(): WalletConnectConnector {
  return new WalletConnectConnector({
    rpc: getRpcForWalletConnect(),
  });
}
