import { InjectedConnector } from "@web3-react/injected-connector";

// const MAINNET_CHAIN_ID = 1;
// const ROPSTEN_CHAIN_ID = 3;
const RINKEYBY_CHAIN_ID = 4;

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [RINKEYBY_CHAIN_ID],
});
