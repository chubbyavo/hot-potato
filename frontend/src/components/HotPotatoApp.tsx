import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import useEagerConnect from "../hooks/useEagerConnect";
import useEventListener from "../hooks/useEventListeners";
import About from "./About";
import Home from "./Home";
import MainDApp from "./MainDApp";
import NavBar from "./NavBar";

const HotPotatoApp: React.FC = () => {
  useEagerConnect();
  useEventListener();
  return (
    <Router>
      <div className="w-screen">
        <NavBar />
        <Switch>
          <Route path="/about">
            <About />
          </Route>
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
