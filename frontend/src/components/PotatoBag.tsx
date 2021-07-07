import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import useHotPotato from "../hooks/useHotPotato";
import { useEffect } from "react";

interface Potato {
  id: number;
  isHot: boolean;
}

interface PotatoTableProps {
  potatoes: Potato[];
}

const PotatoTable: React.FC<PotatoTableProps> = ({
  potatoes,
}: PotatoTableProps) => {
  const rows = potatoes.map(({ id, isHot }) => (
    <tr key={id}>
      <td>{id}</td>
      <td>{isHot ? "🔥" : "❄️"}️</td>
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>
          <th>Token ID</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

const PotatoBag: React.FC = () => {
  const { account } = useWeb3React();
  const hotPotato = useHotPotato();

  const [potatoes, setPotatoes] = useState<Potato[]>([]);

  useEffect(() => {
    const fetchPotatoes = async (address: string) => {
      console.log("Fetching potato data");
      if (hotPotato === null || !ethers.utils.isAddress(address)) {
        return [];
      }

      const potatoes: Potato[] = [];
      const balance = await hotPotato.balanceOf(address);
      console.log("balance: " + balance.toNumber());
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await hotPotato.tokenOfOwnerByIndex(address, i);
        const isHot = await hotPotato.isHot(tokenId);
        potatoes.push({ id: tokenId.toNumber(), isHot });
      }
      console.log(potatoes);
      setPotatoes(potatoes);
    };

    if (account) {
      fetchPotatoes(account);
    }
  }, [account, hotPotato]);

  return (
    <div>
      <h2 className="text-center">Your 🥔s:</h2>
      <div className="flex justify-center">
        <PotatoTable potatoes={potatoes} />
      </div>
    </div>
  );
};

export default PotatoBag;
