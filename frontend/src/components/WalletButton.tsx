import React from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { injectedConnector } from "../utils/connectors";
import { trimAddressForDisplay } from "../utils/misc";
import { CreditCardIcon } from "./Icons";
import toast from "react-hot-toast";
import { getNetwork } from "../utils/network";

function handleActivateError(error: Error): void {
  if (error instanceof UnsupportedChainIdError) {
    toast.error(`Unsupported Network - please switch to ${getNetwork()}`);
  }
}

const WalletButton: React.FC = () => {
  const { account, active, activate, deactivate } = useWeb3React();

  const connectWallet = () => {
    if (!active) {
      activate(injectedConnector, (err) => {
        handleActivateError(err);
      });
      return;
    }
    deactivate();
  };

  return (
    <button
      type="button"
      className="font-medium rounded-md border-black border-2 p-2 hover:bg-yellow-300"
      onClick={connectWallet}
    >
      {account ? (
        <div className="flex align-middle">
          <CreditCardIcon />
          <span>{trimAddressForDisplay(account)}</span>
        </div>
      ) : (
        "Connect Wallet"
      )}
    </button>
  );
};

export default WalletButton;
