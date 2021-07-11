import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import useHotPotato from "../hooks/useHotPotato";

interface Potato {
  id: number;
  isHot: boolean;
  lastTossed: number;
}

const TempPotatoImage = () => (
  <svg height="200" width="200" className="rounded-lg">
    <rect width="100%" height="100%" fill="dimgray" />
    <circle
      cx="100"
      cy="100"
      r="90"
      stroke="black"
      strokeWidth="3"
      fill="goldenrod"
    />
  </svg>
);

interface PotatoCardProps {
  id: number;
  isHot: boolean;
}

const PotatoCard: React.FC<PotatoCardProps> = ({ id, isHot }) => {
  return (
    <div className="p-4 border-2 border-black rounded-md space-y-4">
      <div className="w-min mx-auto">
        <TempPotatoImage />
      </div>
      <div>
        <p>Token ID: {id}</p>
        <p>Status:{isHot ? "🔥" : "❄"} ️</p>
        <p>From: 0xabc️</p>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          className="w-24 sm:w-18 font-medium border-2 rounded-md border-black p-2 mx-2 hover:bg-yellow-300"
        >
          Toss ☄
        </button>
        <button
          type="button"
          className="w-24 sm:w-18 font-medium border-2 rounded-md border-black p-2 mx-2 hover:bg-yellow-300"
        >
          Bake ⏲
        </button>
        <button
          type="button"
          className="w-24 sm:w-18 font-medium border-2 rounded-md border-black p-2 mx-2 hover:bg-yellow-300"
        >
          Burn 🔥
        </button>
      </div>
    </div>
  );
};

PotatoCard.propTypes = {
  id: PropTypes.number.isRequired,
  isHot: PropTypes.bool.isRequired,
};

const makePotatoCards = (potatoes: Potato[]) => {
  return potatoes.map((potato) => <PotatoCard key={potato.id} {...potato} />);
};

const PotatoBag: React.FC = () => {
  const { account } = useWeb3React();
  const hotPotato = useHotPotato();

  const [potatoes, setPotatoes] = useState<Potato[]>([]);

  useEffect(() => {
    const fetchPotatoes = async (address: string) => {
      if (hotPotato === null || !ethers.utils.isAddress(address)) {
        return [];
      }

      const potatoes: Potato[] = [];
      const balance = await hotPotato.balanceOf(address);
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await hotPotato.tokenOfOwnerByIndex(address, i);
        const isHot = await hotPotato.isHot(tokenId);
        const lastTossed = await hotPotato.lastTossed(tokenId);

        potatoes.push({
          id: tokenId.toNumber(),
          isHot,
          lastTossed: lastTossed.toNumber(),
        });
      }
      setPotatoes(potatoes);
    };

    if (account) {
      fetchPotatoes(account);
    }
  }, [account, hotPotato]);

  return (
    <div className="space-y-4">
      <h2 className="text-center">Your 🥔s:</h2>
      <div className="md:w-3/4 xl:w-2/3 mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
        {makePotatoCards(potatoes)}
      </div>
    </div>
  );
};

export default PotatoBag;
