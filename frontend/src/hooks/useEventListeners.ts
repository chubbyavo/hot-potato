import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

export default function useEventListener(): void {
  const { error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window as any;

    if (ethereum && ethereum.on && !error) {
      const handleChainChanged = (chainId: string | number) => {
        window.location.reload();
      };

      ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [error, activate]);
}
