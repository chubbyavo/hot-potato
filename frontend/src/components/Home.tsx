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

enum Action {
  Mint = "Mint",
  Toss = "Toss",
  Bake = "Bake",
  Burn = "Burn",
}

interface Transaction {
  action: Action;
  tokenId: number;
  detail: string;
  timeDescription: string;
  txHash: string;
}

function getChipColor(action: Action): string {
  switch (action) {
    case Action.Mint:
      return "green";
    case Action.Bake:
      return "yellow";
    case Action.Toss:
      return "blue";
    case Action.Burn:
      return "red";
  }
}

function TransactionRow({
  action,
  tokenId,
  detail,
  timeDescription,
}: Transaction) {
  // TODO: create a link with txHash
  const chipColor = getChipColor(action);
  return (
    <tr>
      <td className="py-3 text-center">
        <span
          className={`bg-${chipColor}-200 text-${chipColor}-600 py-1 px-3 rounded-full text-xs`}
        >
          {action}
        </span>
      </td>
      <td className="py-3 text-center">{tokenId}</td>
      <td className="py-3">{detail}</td>
      <td className="py-3 flex">
        {timeDescription} <ExternalLink />
      </td>
    </tr>
  );
}

function RecentTransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <table className="xs:w-full md:w-3/4 xl:w-1/2 table-fixed border-collapse border border-yellow-600 rounded-md">
      <tr className="border border-yellow-600 ">
        <th className="w-1/4 py-3 uppercase">Action</th>
        <th className="w-1/4 py-3 uppercase">Token ID</th>
        <th className="w-1/4 py-3 uppercase">Detail</th>
        <th className="w-1/4 py-3 uppercase">Time</th>
      </tr>
      {transactions.map(({ action, txHash, ...props }) => (
        <TransactionRow
          key={action + txHash}
          action={action}
          txHash={txHash}
          {...props}
        />
      ))}
    </table>
  );
}

const transactions = [
  {
    action: Action.Mint,
    tokenId: 1,
    detail: "by 0xa",
    timeDescription: "18 min ago",
    txHash: "af9d290bc342gf5f",
  },
  {
    action: Action.Toss,
    tokenId: 2,
    detail: "0xa to 0xb",
    timeDescription: "1 hour ago",
    txHash: "bc342gf5faf9d290",
  },
  {
    action: Action.Burn,
    tokenId: 3,
    detail: "by 0xb",
    timeDescription: "2 hours ago",
    txHash: "bc342gf5faf9d290",
  },
  {
    action: Action.Bake,
    tokenId: 4,
    detail: "by 0xb",
    timeDescription: "2 days ago",
    txHash: "bc342gf5faf9d290",
  },
];

const Home: React.FC = () => {
  const [fetched, setFetched] = useState(false);
  const hotPotato = useHotPotato();

  return (
    <div className="container mx-auto">
      <div className="text-8xl text-center mt-4">🥔</div>
      <div className="mt-4">
        <div className="text-center">
          <h1>Recent Transactions</h1>
        </div>
        <div className="flex justify-center mt-4">
          <RecentTransactionsTable transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Home;
