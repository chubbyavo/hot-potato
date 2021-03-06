import { ethers } from "ethers";
import React, { useState, useContext } from "react";
import useHotPotato from "../hooks/useHotPotato";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { RefreshContext } from "../contexts/RefreshContext";
import { RadioGroup } from "@headlessui/react";
import { PotatoImage } from "./PotatoImages";
import { isAddressOrEnsName } from "../utils/misc";

const MintConfetti: React.FC = () => {
  const { width, height } = useWindowSize();
  return <Confetti width={width} height={height} />;
};

const potatoTypes = [
  {
    potatoType: 0,
    name: "Basic",
    description: "A basic 🥔 with negative externality.",
  },
  {
    potatoType: 1,
    name: "NGMI",
    description: "The owner of this 🥔 will not going to make it!",
  },
  {
    potatoType: 2,
    name: "HFSP",
    description: "The owner of this 🥔 will have fun staying poor 😭",
  },
];

function PotatoTypeRadioGroup({
  type,
  setType,
}: {
  type: number;
  setType: (type: number) => void;
}) {
  return (
    <RadioGroup value={type} onChange={setType}>
      <RadioGroup.Label className="font-semibold">Select 🥔</RadioGroup.Label>
      <div className="flex flex-wrap md:flex-none mt-2 space-y-2 space-x-2 justify-between items-center">
        <div>
          {potatoTypes.map(({ potatoType, name, description }) => (
            <RadioGroup.Option
              key={potatoType}
              value={potatoType}
              className={({ active, checked }) =>
                `${
                  active
                    ? "ring-2 ring-offset-2 ring-offset-yellow-300 ring-white ring-opacity-60"
                    : ""
                }
                  ${
                    checked
                      ? "bg-yellow-200 bg-opacity-75 text-black"
                      : "bg-white"
                  }
                    relative rounded-lg shadow-md mt-2 px-3 py-4 cursor-pointer flex focus:outline-none`
              }
            >
              {({ active, checked }) => (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <RadioGroup.Label
                        as="p"
                        className={`font-medium  ${
                          checked ? "text-black" : "text-gray-900"
                        }`}
                      >
                        {name}
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as="span"
                        className={`inline ${
                          checked ? "text-black" : "text-gray-500"
                        }`}
                      >
                        <span>{description}</span>
                      </RadioGroup.Description>
                    </div>
                  </div>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
        <div className="flex flex-grow justify-center">
          <PotatoImage potatoType={type} />
        </div>
      </div>
    </RadioGroup>
  );
}

const Minter: React.FC = () => {
  const hotPotato = useHotPotato();

  const [toAddressOrEnsName, setToAddressOrEnsName] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { triggerRefresh } = useContext(RefreshContext);
  const [type, setType] = useState(0);

  const showAddressInputError = () =>
    errorMessage !== "" ||
    (!isAddressOrEnsName(toAddressOrEnsName) && toAddressOrEnsName !== "");

  const onInputChange = (input: string) => {
    setErrorMessage("");
    setToAddressOrEnsName(input);
  };

  const mint = async (type: number) => {
    if (hotPotato === null || !isAddressOrEnsName(toAddressOrEnsName)) {
      return;
    }

    setStatus("mint");
    try {
      const mintFee = await hotPotato.mintFee();
      const tx = await hotPotato.safeMint(type, toAddressOrEnsName, {
        value: mintFee,
        gasLimit: 250000,
      });
      await tx.wait();
      triggerRefresh();
      setStatus("complete");
      setTimeout(() => setStatus("idle"), 15000);
    } catch (error) {
      if (error.reason && error.reason.includes("ENS")) {
        setErrorMessage("Invalid ENS name");
      }
      // TODO: handle other errors
      setStatus("idle");
    }
  };

  const mintingSpinner = (
    <div className="flex">
      Minting
      <div className="animate-bounce ml-1">🥔</div>
    </div>
  );

  return (
    <div className="flex my-3">
      {status === "complete" && <MintConfetti />}
      <form className="mx-auto">
        <PotatoTypeRadioGroup type={type} setType={setType} />
        <div className="mt-2">
          <label className="font-semibold">{"Send To:"}</label>
        </div>
        <div className="relative flex justify-center">
          <input
            className={`flex-grow p-2 border-2 rounded-md ${
              showAddressInputError() ? "border-red-600" : "border-black"
            }`}
            type="text"
            placeholder="0xabcd...1234 or ENS name"
            required
            onChange={(event) => onInputChange(event?.target.value)}
          />
          <button
            type="button"
            className="w-18 md:w-24 font-medium border-2 rounded-md border-black p-2 ml-2 hover:bg-yellow-300 has-tooltip relative"
            onClick={() => mint(type)}
          >
            <span className="potato-tooltip">
              {"Mint and send 🥔 (1 MATIC)."}
            </span>
            {status === "mint" ? mintingSpinner : "Send 🥔"}
          </button>
        </div>
        {showAddressInputError() && (
          <span className="text-xs text-red-600">
            {errorMessage || "Invalid Address"}
          </span>
        )}
        {status === "complete" && (
          <span className="text-xs text-green-500">
            Successfully minted and sent a 🥔 🎉!
          </span>
        )}
        <br />
      </form>
    </div>
  );
};

export default Minter;
