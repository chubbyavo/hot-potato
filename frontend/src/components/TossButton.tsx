import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import { HotPotato } from "../typechain";
import { Dialog, Transition } from "@headlessui/react";
import { sleep } from "../utils/misc";
import { useWeb3React } from "@web3-react/core";

interface TossButtonProps {
  hotPotato: HotPotato | null;
  id: number;
  isHot: boolean;
  baseClassName: string;
}

// Copied from https://heroicons.com/
const X: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const TossSpinner: React.FC = () => (
  <div className="flex">
    Tossing
    <div className="animate-bounce ml-1">🥔</div>
  </div>
);

const TossButton: React.FC<TossButtonProps> = ({
  hotPotato,
  id,
  baseClassName,
  isHot,
}) => {
  const { account } = useWeb3React();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [toAddress, setToAddress] = useState("");
  const [tossStatus, setTossStatus] = useState("idle");

  const toss = async () => {
    if (hotPotato === null || !account || !ethers.utils.isAddress(toAddress)) {
      return;
    }

    setTossStatus("tossing");
    try {
      const tx = await hotPotato.transferFrom(account, toAddress, id);
      await tx.wait();
      setTossStatus("complete");
      setTimeout(() => setTossStatus("idle"), 4000);
    } catch (error) {
      setTossStatus("idle");
    }
  };

  const showAddressInputError = () =>
    !ethers.utils.isAddress(toAddress) && toAddress !== "";

  return (
    <div>
      <button
        type="button"
        className={baseClassName + (isHot ? "" : " cursor-not-allowed")}
        onClick={openModal}
      >
        Toss ☄
      </button>
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
                  Tossing unwanted 🥔
                </Dialog.Title>
                <button type="button" className="ml-auto" onClick={closeModal}>
                  <X />
                </button>
              </div>
              <div className="mt-4">
                <form className="flex max-w-full">
                  <input
                    className="flex-grow p-2 border-2 rounded-md border-black"
                    type="text"
                    placeholder="0xabcd...1234"
                    onChange={(event) => setToAddress(event?.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="flex-none w-24 font-medium border-2 rounded-md border-black p-2 mx-2 hover:bg-yellow-300"
                    onClick={toss}
                  >
                    {tossStatus == "tossing" ? <TossSpinner /> : "Toss 🥔"}
                  </button>
                </form>
                {showAddressInputError() && (
                  <span className="text-xs text-red-600">Invalid Address</span>
                )}
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

TossButton.propTypes = {
  hotPotato: PropTypes.any.isRequired,
  id: PropTypes.number.isRequired,
  isHot: PropTypes.bool.isRequired,
  baseClassName: PropTypes.string.isRequired,
};

export default TossButton;
