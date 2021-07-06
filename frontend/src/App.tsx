import React from "react";
import { getLibrary } from "./utils/getLibrary";
import { Web3ReactProvider } from "@web3-react/core";
import HotPotatoApp from "./components/HotPotatoApp";

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <HotPotatoApp />
    </Web3ReactProvider>
  );
}

export default App;
