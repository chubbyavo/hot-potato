//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HotPotato is ERC721, ERC721Enumerable, Ownable {
  using Counters for Counters.Counter;

  event Burn(address indexed owner, uint256 indexed tokenId);

  uint256 private constant _HOT_DURATION = 1 days;
  Counters.Counter private _tokenIdCounter;

  mapping(uint256 => uint256) public lastTossed;
  uint256 public mintFee = 0.00001 ether;
  uint256 public burnFee = 0.00001 ether;

  constructor() ERC721("HotPotato", "HOT") {}

  function setFees(uint256 _mintFee, uint256 _burnFee) public onlyOwner {
    mintFee = _mintFee;
    burnFee = _burnFee;
  }

  function safeMint(address to) public payable {
    require(msg.value == mintFee, "Incorrect mint fee");
    uint256 tokenId = _tokenIdCounter.current();
    lastTossed[tokenId] = block.timestamp;
    _safeMint(_msgSender(), tokenId);

    // Immediately toss to `address` if it's different from the minter.
    if (_msgSender() != to) {
      _transfer(_msgSender(), to, tokenId);
    }
    _tokenIdCounter.increment();
  }

  function isHot(uint256 tokenId) public view returns (bool) {
    require(lastTossed[tokenId] != 0, "isHot query for nonexistent token");
    return (block.timestamp - lastTossed[tokenId]) < _HOT_DURATION;
  }

  function burn(uint256 tokenId) public payable {
    address owner = ERC721.ownerOf(tokenId);
    require(_msgSender() == owner, "burn caller is not owner");
    require(msg.value == burnFee, "Incorrect burn fee");
    _burn(tokenId);
    lastTossed[tokenId] = 0;
    emit Burn(owner, tokenId);
  }

  function withdrawFees() public onlyOwner {
    (bool sent, ) = msg.sender.call{value: address(this).balance}("");
    require(sent, "Failed to send collected fees");
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    require(isHot(tokenId), "Cannot transfer cold potato");
    lastTossed[tokenId] = block.timestamp;
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  // TODO: set a proper token URI.
}
