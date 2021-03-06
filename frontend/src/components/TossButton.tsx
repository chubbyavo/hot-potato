import React, { useState, useContext, Fragment } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import { HotPotato } from "../typechain";
import { Dialog, Transition } from "@headlessui/react";
import { useWeb3React } from "@web3-react/core";
import { RefreshContext } from "../contexts/RefreshContext";
import { XIcon } from "./Icons";
import { isAddressOrEnsName } from "../utils/misc";

interface TossButtonProps {
  hotPotato: HotPotato | null;
  id: number;
  isHot: boolean;
  baseClassName: string;
}

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

  const [toAddressOrEnsName, setToAddressOrEnsName] = useState("");
  const [tossStatus, setTossStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { triggerRefresh } = useContext(RefreshContext);

  const showAddressInputError = () =>
    errorMessage !== "" ||
    (!isAddressOrEnsName(toAddressOrEnsName) && toAddressOrEnsName !== "");

  const onInputChange = (input: string) => {
    setErrorMessage("");
    setToAddressOrEnsName(input);
  };

  const toss = async () => {
    if (
      hotPotato === null ||
      !account ||
      !isAddressOrEnsName(toAddressOrEnsName)
    ) {
      return;
    }

    setTossStatus("tossing");
    try {
      const tx = await hotPotato.transferFrom(account, toAddressOrEnsName, id);
      await tx.wait();
      setTossStatus("complete");
      triggerRefresh();
    } catch (error) {
      if (error.reason && error.reason.includes("ENS")) {
        setErrorMessage("Invalid ENS name");
      }
      // TODO: handle other errors
      setTossStatus("idle");
    }
  };

  return (
    <div>
      <button
        type="button"
        className={
          baseClassName + (isHot ? "" : " cursor-not-allowed disabled")
        }
        disabled={!isHot}
        onClick={openModal}
      >
        <span className="potato-tooltip">
          Toss hot 🥔 before it gets cold 🧊!
        </span>
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
                  <XIcon />
                </button>
              </div>
              <div className="mt-4">
                <form className="flex max-w-full">
                  <input
                    className="flex-grow p-2 border-2 rounded-md border-black"
                    type="text"
                    placeholder="0xabcd... or ENS name"
                    onChange={(event) => onInputChange(event?.target.value)}
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
                  <span className="text-xs text-red-600">
                    {errorMessage || "Invalid Address"}
                  </span>
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
