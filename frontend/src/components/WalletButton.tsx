import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "../utils/connectors";
import { trimAddressForDisplay } from "../utils/misc";
import { CreditCardIcon } from "./Icons";

const WalletButton: React.FC = () => {
  const { account, activate } = useWeb3React();

  useEffect(() => {
    if (!account) {
      activate(injectedConnector);
    }
  }, [account, activate]);

  const connectWallet = async () => {
    await activate(injectedConnector);
  };

  return (
    <button
      type="button"
      className="font-medium rounded-md border-black border-2 p-2 hover:bg-yellow-300"
      onClick={connectWallet}
    >
      {account !== undefined && account !== null ? (
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
