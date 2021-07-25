import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import useEagerConnect from "../hooks/useEagerConnect";
import useEventListener from "../hooks/useEventListeners";
import About from "./About";
import Home from "./Home";
import Mint from "./Mint";
import NavBar from "./NavBar";
import PotatoBag from "./PotatoBag";

const HotPotatoApp: React.FC = () => {
  useEagerConnect();
  useEventListener();
  return (
    <Router>
      <div className="w-screen mb-20 md:mb-0">
        <NavBar />
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/mint">
            <Mint />
          </Route>
          <Route path="/potatoes">
            <PotatoBag />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default HotPotatoApp;
