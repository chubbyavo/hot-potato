import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { HotPotato, HotPotato__factory } from "../typechain";
import * as dotenv from "dotenv";

dotenv.config();
const { REACT_APP_DEPLOYMENT_ENV } = process.env;

function getContractAddress(): string {
  switch (REACT_APP_DEPLOYMENT_ENV) {
    case "ROPSTEN":
      return "0x8bBd756cF3345F6DDeaA55295ef33211eE01815e";
    case "RINKEBY":
      return "0xB0F5ebB9C3Dc26CC217088635d2a76FcCCd6AC4f";
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
