import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
          <Route path="/">TODO: home</Route>
        </Switch>
      </div>
    </Router>
  );
};

export default HotPotatoApp;
