import React, { useState } from "react";
import { RefreshContext } from "../contexts/RefreshContext";
import Minter from "./Minter";
import PotatoBag from "./PotatoBag";

const MainDApp: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh(!refresh);

  return (
    <RefreshContext.Provider value={{ refresh, triggerRefresh }}>
      <div className="container mx-auto px-4">
        <Minter />
        <PotatoBag />
      </div>
    </RefreshContext.Provider>
  );
};

export default MainDApp;
