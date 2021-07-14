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
            <div className="container mx-auto">
              <Minter />
              <PotatoBag />
            </div>
          </Route>
          <Route path="/">TODO: home</Route>
        </Switch>
      </div>
    </Router>
  );
};

export default HotPotatoApp;
