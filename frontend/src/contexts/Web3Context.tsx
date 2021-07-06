import { Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import React, { ReactNode } from "react";
import PropTypes from "prop-types";

export type Web3ContextData = {
  provider: Provider;
};

// TODO: add network
const defaultProvider = ethers.getDefaultProvider();

const Web3Context = React.createContext<Web3ContextData>({
  provider: defaultProvider,
});

export const Web3contextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <Web3Context.Provider value={{ provider: defaultProvider }}>
    {children}
  </Web3Context.Provider>
);

Web3contextProvider.propTypes = { children: PropTypes.node };
