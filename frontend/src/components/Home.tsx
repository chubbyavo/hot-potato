import { BigNumber, ethers } from "ethers";
import React, { useState } from "react";
import { useEffect } from "react";
import useHotPotato from "../hooks/useHotPotato";
import { TypedEvent } from "../typechain/commons";
import { createExplorerTxLink } from "../utils/links";
import { getAddressPrefix, toTimeDescription } from "../utils/misc";

const ExternalLink: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 inline"
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
  blockNumber: number;
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

function TransactionLink({ txHash }: { txHash: string }) {
  return (
    <a href={createExplorerTxLink(txHash)} target="_blank" rel="noreferrer">
      <ExternalLink />
    </a>
  );
}

function TransactionRow({
  action,
  tokenId,
  detail,
  timeDescription,
  txHash,
}: Transaction) {
  const chipColor = getChipColor(action);
  return (
    <tr>
      <td className="px-2 py-3 text-center">
        <span
          className={`bg-${chipColor}-200 text-${chipColor}-600 py-1 px-3 rounded-full text-xs`}
        >
          {action}
        </span>
      </td>
      <td className="px-2 py-3 text-center">{tokenId}</td>
      <td className="px-2 py-3">{detail}</td>
      <td className="px-2 py-3 text-right">
        <p>
          {timeDescription} <TransactionLink txHash={txHash} />
        </p>
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
    <table className="xs:w-full md:w-3/4 xl:w-1/2 table-auto border-collapse border border-yellow-600 rounded-md">
      <tr className="border border-yellow-600 ">
        <th className="py-3 uppercase">Action</th>
        <th className="py-3 uppercase">Token ID</th>
        <th className="py-3 uppercase">Detail</th>
        <th className="py-3 uppercase">Time</th>
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

function PotatoSpinner() {
  return <span className="animate-spin text-5xl">🥔</span>;
}

type TransferEvent = TypedEvent<
  [string, string, BigNumber] & { from: string; to: string; tokenId: BigNumber }
>;

type BakeEvent = TypedEvent<
  [string, BigNumber] & { owner: string; tokenId: BigNumber }
>;

async function transferEventToTransaction(
  transferEvent: TransferEvent
): Promise<Transaction> {
  const fromAddr = transferEvent.args.from;
  const toAddr = transferEvent.args.to;
  const tokenId = transferEvent.args.tokenId.toNumber();
  const txHash = transferEvent.transactionHash;
  const blockNumber = transferEvent.blockNumber;
  const timestamp = await (await transferEvent.getBlock()).timestamp;
  const timeDescription = toTimeDescription(timestamp);

  const getAction = (fromAddr: string, toAddr: string) => {
    if (fromAddr === ethers.constants.AddressZero) {
      return Action.Mint;
    }
    if (toAddr === ethers.constants.AddressZero) {
      return Action.Burn;
    }

    return Action.Toss;
  };

  const getDetail = (action: Action, fromAddr: string, toAddr: string) => {
    if (action === Action.Toss) {
      return `${getAddressPrefix(fromAddr)} to ${getAddressPrefix(toAddr)}`;
    }
    return `by ${getAddressPrefix(toAddr)}`;
  };

  const action = getAction(fromAddr, toAddr);
  const detail = getDetail(action, fromAddr, toAddr);

  return {
    action,
    tokenId,
    detail,
    timeDescription,
    txHash,
    blockNumber,
  };
}

async function bakeEventToTransaction(
  bakeEvent: BakeEvent
): Promise<Transaction> {
  const timestamp = await (await bakeEvent.getBlock()).timestamp;
  return {
    action: Action.Bake,
    tokenId: bakeEvent.args.tokenId.toNumber(),
    detail: `by ${getAddressPrefix(bakeEvent.args.owner)}`,
    timeDescription: toTimeDescription(timestamp),
    txHash: bakeEvent.transactionHash,
    blockNumber: bakeEvent.blockNumber,
  };
}

const Home: React.FC = () => {
  const hotPotato = useHotPotato();
  const [fetched, setFetched] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!hotPotato) {
        return;
      }

      const transferEvents = (
        await hotPotato.queryFilter(hotPotato.filters.Transfer(), -200000)
      ).slice(0, 10);
      const transferTxs = await Promise.all(
        transferEvents.map(transferEventToTransaction)
      );

      const bakeEvents = (
        await hotPotato.queryFilter(hotPotato.filters.Bake(), -200000)
      ).slice(0, 5);
      const bakeTxs = await Promise.all(bakeEvents.map(bakeEventToTransaction));

      const txs = transferTxs
        .concat(bakeTxs)
        .sort((a, b) => b.blockNumber - a.blockNumber)
        .slice(0, 10);

      setTransactions(txs);
      setFetched(true);
      return;
    };

    const interval = setInterval(() => {
      fetchEvents();
    }, 15000);

    fetchEvents();
    return () => clearInterval(interval);
  }, [hotPotato]);

  return (
    <div className="container mx-auto">
      <div className="text-8xl text-center mt-4">🥔</div>
      <div className="mt-4">
        <div className="text-center">
          <h1>Recent Transactions</h1>
        </div>
        <div className="flex justify-center mt-4">
          {fetched ? (
            <RecentTransactionsTable transactions={transactions} />
          ) : (
            <PotatoSpinner />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
