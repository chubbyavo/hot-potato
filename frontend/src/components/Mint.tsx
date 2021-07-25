import React, { useState } from "react";
import { RefreshContext } from "../contexts/RefreshContext";
import Minter from "./Minter";

const Mint: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh(!refresh);

  return (
    <RefreshContext.Provider value={{ refresh, triggerRefresh }}>
      <div className="container mx-auto mt-4 px-4">
        <h1 className="text-4xl text-center">{"Mint & Send 🥔"}</h1>
        <Minter />
      </div>
    </RefreshContext.Provider>
  );
};

export default Mint;
