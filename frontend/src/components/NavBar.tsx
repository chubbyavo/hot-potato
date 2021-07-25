import React from "react";
import { Link } from "react-router-dom";
import WalletButton from "./WalletButton";

const NavBar: React.FC = () => {
  return (
    <nav className="flex items-center px-5 py-3 bg-yellow-400 w-screen">
      <div className="flex flex-shrink-0 mr-3">
        <Link to="/">
          <span className="text-3xl">🥔</span>
        </Link>
      </div>
      <div>
        <ul className="flex flex-grow text-lg font-semibold">
          <li className="mr-6">
            <Link to="/about">About</Link>
          </li>
          <li className="mr-6">
            <Link to="/mint">Mint</Link>
          </li>
          <li className="mr-6">
            <Link to="/potatoes">Your 🥔s</Link>
          </li>
        </ul>
      </div>
      <div className="ml-auto">
        <WalletButton />
      </div>
    </nav>
  );
};

export default NavBar;
