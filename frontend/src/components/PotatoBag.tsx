import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import useHotPotato from "../hooks/useHotPotato";
import { HotPotato } from "../typechain";
import TossButton from "./TossButton";
import { PotatoSpinner } from "./Spinners";
import { RefreshContext } from "../contexts/RefreshContext";
import { trimAddressForDisplay } from "../utils/misc";
import { createExplorerAddressLink } from "../utils/links";
import { ClipboardCopyIcon, ExternalLinkIcon } from "./Icons";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface Potato {
  id: number;
  isHot: boolean;
  lastTossed: number;
  from: string | null;
}

const TempPotatoImage = () => (
  <svg height="200" width="200" className="rounded-lg">
    <rect width="100%" height="100%" fill="dimgray" />
    <circle
      cx="100"
      cy="100"
      r="90"
      stroke="black"
      strokeWidth="3"
      fill="goldenrod"
    />
    <text x="63" y="100">
      {"I'm a potato"}
    </text>
  </svg>
);

interface PotatoCardProps {
  hotPotato: HotPotato | null;
  id: number;
  isHot: boolean;
  from: string | null;
}

interface ButtonProps {
  hotPotato: HotPotato | null;
  id: number;
  isHot: boolean;
  baseClassName: string;
}

const buttonPropTypes = {
  hotPotato: PropTypes.any.isRequired,
  id: PropTypes.number.isRequired,
  isHot: PropTypes.bool.isRequired,
  baseClassName: PropTypes.string.isRequired,
};

const BakeButton: React.FC<ButtonProps> = ({
  hotPotato,
  id,
  isHot,
  baseClassName,
}) => {
  const [bakeStatus, setBakeStatus] = useState("idle");
  const { triggerRefresh } = useContext(RefreshContext);

  const bake = async () => {
    if (hotPotato === null) {
      return;
    }

    setBakeStatus("baking");
    try {
      const bakeFee = await hotPotato.bakeFee();

      const tx = await hotPotato.bake(id, {
        value: bakeFee,
        gasLimit: 50000,
      });
      await tx.wait();
      triggerRefresh();
      setBakeStatus("complete");
      setTimeout(() => setBakeStatus("idle"), 5000);
    } catch (error) {
      setBakeStatus("idle");
    }
  };

  const bakeSpinner = (
    <div className="flex">
      Baking
      <div className="animate-bounce ml-1">⏲</div>
    </div>
  );

  return (
    <button
      type="button"
      className={baseClassName + (isHot ? " cursor-not-allowed" : "")}
      disabled={isHot}
      onClick={bake}
    >
      <span className="potato-tooltip">
        Make 🥔 hot again by baking it (costs 1 MATIC).
      </span>
      {bakeStatus == "baking" ? bakeSpinner : "Bake ⏲"}
    </button>
  );
};

BakeButton.propTypes = buttonPropTypes;

const BurnButton: React.FC<ButtonProps> = ({
  hotPotato,
  id,
  baseClassName,
}) => {
  const [burnStatus, setBurnStatus] = useState("idle");
  const { triggerRefresh } = useContext(RefreshContext);

  const burn = async () => {
    if (hotPotato === null) {
      return;
    }
    setBurnStatus("burning");
    try {
      const burnFee = await hotPotato.burnFee();

      const tx = await hotPotato.burn(id, {
        value: burnFee,
        gasLimit: 100000,
      });
      await tx.wait();
      triggerRefresh();
      setBurnStatus("complete");
    } catch (error) {
      setBurnStatus("idle");
    }
  };

  const burnSpinner = (
    <div className="flex">
      Burning
      <div className="animate-bounce ml-1">🔥</div>
    </div>
  );

  return (
    <button type="button" className={baseClassName} onClick={burn}>
      <span className="potato-tooltip">
        {"Burn 🥔 if don't want it (costs 1 MATIC)."}
      </span>
      {burnStatus === "burning" ? burnSpinner : "Burn 🔥"}
    </button>
  );
};

BurnButton.propTypes = buttonPropTypes;

function AddressLink({ address }: { address: string | null }) {
  if (address === null) {
    return <p>error</p>;
  }

  return (
    <span>
      <span className="align-middle inline-block">
        {trimAddressForDisplay(address)}
      </span>
      <CopyToClipboard text={address}>
        <button className="ml-1" type="button">
          <ClipboardCopyIcon />
        </button>
      </CopyToClipboard>
      <a
        className="ml-1"
        href={createExplorerAddressLink(address)}
        target="_blank"
        rel="noreferrer"
      >
        <ExternalLinkIcon />
      </a>
    </span>
  );
}

const PotatoCard: React.FC<PotatoCardProps> = ({
  hotPotato,
  id,
  isHot,
  from,
}) => {
  const buttonBaseClass =
    "w-24 sm:w-18 font-medium border-2 rounded-md border-black p-2 mx-2 hover:bg-yellow-300 has-tooltip relative";
  return (
    <div className="p-4 border-2 border-black rounded-md space-y-4">
      <div className="w-min mx-auto">
        <TempPotatoImage />
      </div>
      <div>
        <p>Token ID: {id}</p>
        <p>Status: {isHot ? "♨️" : "🧊"} ️</p>
        <p>
          From: <AddressLink address={from} />
        </p>
      </div>
      <div className="flex justify-center">
        <TossButton
          hotPotato={hotPotato}
          id={id}
          isHot={isHot}
          baseClassName={buttonBaseClass}
        />
        <BakeButton
          hotPotato={hotPotato}
          id={id}
          isHot={isHot}
          baseClassName={buttonBaseClass}
        />
        <BurnButton
          hotPotato={hotPotato}
          id={id}
          isHot={isHot}
          baseClassName={buttonBaseClass}
        />
      </div>
    </div>
  );
};

PotatoCard.propTypes = {
  hotPotato: PropTypes.any.isRequired,
  id: PropTypes.number.isRequired,
  isHot: PropTypes.bool.isRequired,
  from: PropTypes.string,
};

const makePotatoCards = (hotPotato: HotPotato | null, potatoes: Potato[]) => {
  return potatoes.map((potato) => (
    <PotatoCard key={potato.id} hotPotato={hotPotato} {...potato} />
  ));
};

const PotatoBag: React.FC = () => {
  const { account } = useWeb3React();
  const hotPotato = useHotPotato();

  const [fetched, setFetched] = useState(false);
  const [potatoes, setPotatoes] = useState<Potato[]>([]);
  const { refresh } = useContext(RefreshContext);

  useEffect(() => {
    const fetchPotatoes = async (address: string) => {
      if (hotPotato === null || !ethers.utils.isAddress(address)) {
        return [];
      }

      const potatoes: Potato[] = [];
      const balance = await hotPotato.balanceOf(address);
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await hotPotato.tokenOfOwnerByIndex(address, i);
        const isHot = await hotPotato.isHot(tokenId);
        const lastTossed = await hotPotato.lastTossed(tokenId);
        const transferEvents = await hotPotato.queryFilter(
          hotPotato.filters.Transfer(null, null, tokenId)
        );
        const fromAddress =
          transferEvents.length > 0
            ? transferEvents[transferEvents.length - 1].args.from
            : null;

        potatoes.push({
          id: tokenId.toNumber(),
          isHot,
          lastTossed: lastTossed.toNumber(),
          from: fromAddress,
        });
      }
      setPotatoes(potatoes);
      setFetched(true);
    };

    if (account) {
      fetchPotatoes(account);
    }
  }, [account, hotPotato, refresh]);

  return (
    <div className="space-y-4">
      <h2 className="text-center">Your 🥔s:</h2>
      <div className="flex justify-center text-center">
        {!fetched && <PotatoSpinner />}
        {potatoes.length === 0 &&
          fetched &&
          "🎉 Yay, you don't have any potatoes! (that's a good thing!!?)"}
      </div>
      <div className="md:w-3/4 xl:w-2/3 mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
        {makePotatoCards(hotPotato, potatoes)}
      </div>
    </div>
  );
};

export default PotatoBag;
