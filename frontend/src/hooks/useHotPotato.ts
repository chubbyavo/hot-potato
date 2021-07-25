import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { HotPotato, HotPotato__factory } from "../typechain";
import { getNetwork, Network } from "../utils/network";

function getContractAddress(): string {
  // TODO: add polygon
  switch (getNetwork()) {
    case Network.Ropsten:
      return "0x2aA9AFaB145a0d62e1FFA956B41d39a19CA4b219";
    default:
      // Hardhat Network
      return "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  }
}

const useHotPotato = (): HotPotato | null => {
  const { active, library } = useWeb3React();
  const [hotPotato, setHotPotato] = useState<HotPotato | null>(null);

  useEffect(() => {
    if (active && library) {
      const contract = HotPotato__factory.connect(
        getContractAddress(),
        library.getSigner()
      );
      setHotPotato(contract);
    }
  }, [active, library]);

  return hotPotato;
};

export default useHotPotato;
