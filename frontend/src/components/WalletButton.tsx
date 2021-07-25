import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { getAddressPrefix, trimAddressForDisplay } from "../utils/misc";
import { CreditCardIcon } from "./Icons";
import WalletModal from "./WalletModal";

const WalletButton: React.FC = () => {
  const { account, active, deactivate } = useWeb3React();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const onClick = () => {
    if (!active) {
      openModal();
      return;
    }
    deactivate();
  };

  return (
    <div>
      <button
        type="button"
        className="font-medium rounded-md border-black border-2 p-2 hover:bg-yellow-300"
        onClick={onClick}
      >
        {account ? (
          <div className="flex align-middle">
            <CreditCardIcon />
            <span className="hidden md:block">
              {trimAddressForDisplay(account)}
            </span>
            <span className="block md:hidden">{getAddressPrefix(account)}</span>
          </div>
        ) : (
          "Connect Wallet"
        )}
      </button>
      <WalletModal isOpen={isOpen} closeModal={closeModal} />
    </div>
  );
};

export default WalletButton;
