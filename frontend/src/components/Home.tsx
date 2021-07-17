import React, { useState } from "react";
import { useEffect } from "react";
import useHotPotato from "../hooks/useHotPotato";

const ExternalLink: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
  );
};

const Home: React.FC = () => {
  const [fetched, setFetched] = useState(false);
  const hotPotato = useHotPotato();

  return (
    <div className="container mx-auto">
      <div className="text-8xl text-center mt-4">🥔</div>
      <div className="mt-4">
        <div className="text-center">
          <h1>Recent Activities</h1>
        </div>
        <div className="flex justify-center mt-4">
          <table className="xs:w-full md:w-3/4 xl:w-1/2 table-fixed border-collapse border border-yellow-600 rounded-md">
            <tr className="border border-yellow-600 ">
              <th className="w-1/4 uppercase">Action</th>
              <th className="w-1/4 uppercase">Token ID</th>
              <th className="w-1/4 uppercase">Detail</th>
              <th className="w-1/4 uppercase">Time</th>
            </tr>
            <tr>
              <td className="py-3 text-center">
                <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">
                  Mint
                </span>
              </td>
              <td className="py-3 text-center">1</td>
              <td className="py-3">by 0xa</td>
              <td className="py-3 flex">
                18 min ago <ExternalLink />
              </td>
            </tr>
            <tr>
              <td className="py-3 text-center">
                <span className="bg-blue-200 text-blue-600 py-1 px-3 rounded-full text-xs">
                  Toss
                </span>
              </td>
              <td className="py-3 text-center">1</td>
              <td className="py-3">0xa to 0xb</td>
              <td className="py-3 flex">
                1 hour ago <ExternalLink />
              </td>
            </tr>
            <tr>
              <td className="py-3 text-center">
                <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">
                  Burn
                </span>
              </td>
              <td className="py-3 text-center">2</td>
              <td className="py-3">by 0xa</td>
              <td className="py-3 flex">
                2 days ago <ExternalLink />
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
