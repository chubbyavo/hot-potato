import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Minter from "./Minter";

const HotPotatoApp: React.FC = () => {
  return (
    <Router>
      <div className="container w-screen">
        <NavBar />
        <Switch>
          <Route path="/about">TODO: about page</Route>
          <Route path="/mint">
            <Minter />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default HotPotatoApp;
