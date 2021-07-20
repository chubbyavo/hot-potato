import { InjectedConnector } from "@web3-react/injected-connector";
import { getSupportedChainIds } from "./network";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: getSupportedChainIds(),
});
