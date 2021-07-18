import { ethers } from "ethers";
import React, { useState, useContext } from "react";
import useHotPotato from "../hooks/useHotPotato";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { RefreshContext } from "../contexts/RefreshContext";

const MintConfetti: React.FC = () => {
  const { width, height } = useWindowSize();
  return <Confetti width={width} height={height} />;
};

const Minter: React.FC = () => {
  const hotPotato = useHotPotato();

  const [toAddress, setToAddress] = useState("");
  const [status, setStatus] = useState("idle");
  const [isValidAddress, setIsValidAddress] = useState(false);
  const { triggerRefresh } = useContext(RefreshContext);

  const showAddressInputError = () => !isValidAddress && toAddress !== "";

  const onAddressInputChange = (address: string) => {
    setIsValidAddress(ethers.utils.isAddress(address));
    setToAddress(address);
  };

  const mint = async () => {
    // TODO: surface errors in a better way.
    if (hotPotato === null || !isValidAddress) {
      return;
    }

    setStatus("mint");
    try {
      const mintFee = await hotPotato.mintFee();
      const tx = await hotPotato.safeMint(toAddress, {
        value: mintFee,
        gasLimit: 250000,
      });
      await tx.wait();
      triggerRefresh();
      setStatus("complete");
      setTimeout(() => setStatus("idle"), 15000);
    } catch (error) {
      // TODO: surface error
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
        <label className="font-semibold">{"Mint & Send 🥔 To:"}</label>
        <br />
        <div className="relative flex">
          <input
            className={`w-72 lg:w-96 p-2 border-2 rounded-md ${
              showAddressInputError() ? "border-red-600" : "border-black"
            }`}
            type="text"
            placeholder="0xabcd...1234"
            required
            onChange={(event) => onAddressInputChange(event?.target.value)}
          />
          <button
            type="button"
            className="w-24 font-medium border-2 rounded-md border-black p-2 mx-2 hover:bg-yellow-300"
            onClick={mint}
          >
            {status === "mint" ? mintingSpinner : "Send 🥔"}
          </button>
        </div>
        {showAddressInputError() && (
          <span className="text-xs text-red-600">Invalid Address</span>
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
