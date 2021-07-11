import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Minter from "./Minter";
import PotatoBag from "./PotatoBag";

const HotPotatoApp: React.FC = () => {
  return (
    <Router>
      <div className="w-screen">
        <NavBar />
        <Switch>
          <Route path="/about">TODO: about page</Route>
          <Route path="/mint">
            <div className="mx-4">
              <Minter />
              <PotatoBag />
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default HotPotatoApp;
