import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { HotPotato, HotPotato__factory } from "../typechain";

const contractAddress = "0xE5549Cb177b606D96c52A9661e37695694CfCe05"; // rinkeby 2

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
