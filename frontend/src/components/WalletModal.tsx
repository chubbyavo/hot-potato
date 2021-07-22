import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import {
  injectedConnector,
  getWalletConnectConnector,
} from "../utils/connectors";
import { MetamaskIcon, WalletConnectIcon, XIcon } from "./Icons";
import { getNetwork } from "../utils/network";

interface WalletModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

function handleActivateError(error: Error): void {
  if (error instanceof UnsupportedChainIdError) {
    toast.error(`Unsupported Network - please switch to ${getNetwork()}`);
  }
}

function WalletModal({ isOpen, closeModal }: WalletModalProps): JSX.Element {
  const { activate } = useWeb3React();

  const connectMetamask = () => {
    activate(injectedConnector, (err) => {
      handleActivateError(err);
    });
    closeModal();
  };

  const connectWalletConnect = () => {
    activate(getWalletConnectConnector(), (err) => {
      handleActivateError(err);
    });
    closeModal();
  };

  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-30"
      leaveTo="opacity-0"
    >
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <div className="flex">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Connect Wallet
              </Dialog.Title>
              <button type="button" className="ml-auto" onClick={closeModal}>
                <XIcon />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-y-4 justify-items-center justify-between">
              <button
                type="button"
                className="flex items-center w-40"
                onClick={connectMetamask}
              >
                <MetamaskIcon height={40} width={40} className="inline-block" />
                <span className="flex-grow ml-2">Metamask</span>
              </button>
              <button
                type="button"
                className="flex items-center w-40"
                onClick={connectWalletConnect}
              >
                <WalletConnectIcon
                  height={40}
                  width={40}
                  className="inline-block"
                />
                <span className="flex-grow ml-2">WalletConnect</span>
              </button>
            </div>
            <div className="mt-4"></div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default WalletModal;
