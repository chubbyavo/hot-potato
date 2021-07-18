import React from "react";

const About: React.FC = () => {
  return (
    <div className="container flex justify-center mt-4">
      <article className="container prose prose-yellow lg:prose-xl">
        <h2>HotPotato</h2>
        <p>
          {
            "HotPotato is a prank NFT project. It is not cool to have a 🥔 in one's wallet. "
          }
          {"The mechanism is inspired bs inspired by "}
          <a
            href="https://en.wikipedia.org/wiki/Hot_potato"
            target="_blank"
            rel="noreferrer"
          >
            hot potato game
          </a>
          .
        </p>
        <h2>How it works</h2>
        <p>
          {"Once minted, the 🥔 is hot ♨️ for 24 hours. " +
            "The current owner of the 🥔 has 24 hours to toss to someone else. " +
            "After 24 hours the 🥔 becomes cold 🧊 and it becomes un-tossable. " +
            "When the 🥔 is successfully tossed, the timer resets and the new owner gets 24 hours to toss."}
        </p>
        <h3>Actions</h3>
        <li>
          <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full mr-2">
            Mint
          </span>
          mint a new potato
        </li>
        <li>
          <span className="bg-blue-200 text-blue-600 py-1 px-3 rounded-full mr-2">
            Toss
          </span>
          transfer unwanted potato to someone else
        </li>
        <li>
          <span className="bg-yellow-200 text-yellow-600 py-1 px-3 rounded-full mr-2">
            Bake
          </span>
          Bake: make a potato hot again (costs 1 MATIC)
        </li>
        <li>
          <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full mr-2">
            Burn
          </span>
          destroy a potato (costs 1 MATIC)
        </li>
      </article>
    </div>
  );
};
export default About;
