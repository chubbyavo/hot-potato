import React from "react";
import { getLibrary } from "./utils/getLibrary";
import { Web3ReactProvider } from "@web3-react/core";
import HotPotatoApp from "./components/HotPotatoApp";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <HotPotatoApp />
      <Toaster
        position="top-center"
        toastOptions={{ className: "", duration: 5000 }}
      />
    </Web3ReactProvider>
  );
}

export default App;
