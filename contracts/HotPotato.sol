//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HotPotato is ERC721, ERC721Enumerable {
  using Counters for Counters.Counter;

  uint256 private constant _HOT_DURATION = 1 days;
  Counters.Counter private _tokenIdCounter;
  mapping(uint256 => uint256) private _lastTossed;

  constructor() ERC721("HotPotato", "HOT") {}

  function safeMint(address to) public {
    _lastTossed[_tokenIdCounter.current()] = block.timestamp;
    _safeMint(to, _tokenIdCounter.current());
    _tokenIdCounter.increment();
  }

  function isHot(uint256 tokenId) public view returns (bool) {
    uint256 lastTossed = _lastTossed[tokenId];
    require(lastTossed != 0, "isHot query for nonexistent token");
    return (block.timestamp - lastTossed) < _HOT_DURATION;
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    require(isHot(tokenId), "Cannot transfer cold potato");
    _lastTossed[tokenId] = block.timestamp;
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  // TODO: set a proper token URI.
  // TODO: add a burn method.
}
