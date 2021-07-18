import { InjectedConnector } from "@web3-react/injected-connector";

// const MAINNET_CHAIN_ID = 1;
const ROPSTEN_CHAIN_ID = 3;
const RINKEYBY_CHAIN_ID = 4;
const HARDHAT_CHAIN_ID = 31337;

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [ROPSTEN_CHAIN_ID, RINKEYBY_CHAIN_ID, HARDHAT_CHAIN_ID],
});
