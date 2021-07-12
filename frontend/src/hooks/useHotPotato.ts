import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { HotPotato, HotPotato__factory } from "../typechain";

// TODO: get address from env
// const contractAddress = "0x845f8d42AFf6CfFe840DCf0967eD468f530ecAa4"; // ropsten
// const contractAddress = "0xB0F5ebB9C3Dc26CC217088635d2a76FcCCd6AC4f"; // rinkeyby
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // local

const useHotPotato = (): HotPotato | null => {
  const { active, library } = useWeb3React();
  const [hotPotato, setHotPotato] = useState<HotPotato | null>(null);

  useEffect(() => {
    if (active && library) {
      const contract = HotPotato__factory.connect(
        contractAddress,
        library.getSigner()
      );
      setHotPotato(contract);
    }
  }, [active, library]);

  return hotPotato;
};

export default useHotPotato;
