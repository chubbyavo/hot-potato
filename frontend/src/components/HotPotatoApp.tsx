import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import MainDApp from "./MainDApp";
import NavBar from "./NavBar";

const HotPotatoApp: React.FC = () => {
  return (
    <Router>
      <div className="w-screen">
        <NavBar />
        <Switch>
          <Route path="/about">TODO: about page</Route>
          <Route path="/app">
            <MainDApp />
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
