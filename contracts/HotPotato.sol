//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HotPotato is ERC721, ERC721Enumerable, Ownable {
  using Counters for Counters.Counter;

  event Burn(address indexed owner, uint256 indexed tokenId);

  Counters.Counter private _tokenIdCounter;
  Counters.Counter private _tokenTypeCounter;

  mapping(uint256 => uint256) public lastTossed;
  mapping(uint256 => uint256) public tokenIdToType;
  mapping(uint256 => string) public tokenTypeToURI;
  uint256 public mintFee = 0.00001 ether;
  uint256 public burnFee = 0.00001 ether;
  uint256 public hotDuration = 1 days;

  constructor() ERC721("HotPotato", "HOT") {}

  function setFees(uint256 _mintFee, uint256 _burnFee) public onlyOwner {
    mintFee = _mintFee;
    burnFee = _burnFee;
  }

  function setHotDuration(uint256 _hotDuration) public onlyOwner {
    hotDuration = _hotDuration;
  }

  function addType(string memory _uri) public onlyOwner {
    uint256 tokenType = _tokenTypeCounter.current();
    tokenTypeToURI[tokenType] = _uri;
    _tokenTypeCounter.increment();
  }

  function updateType(uint256 _type, string memory _uri) public onlyOwner {
    require(_type < _tokenTypeCounter.current(), "Nonexistent token type");
    tokenTypeToURI[_type] = _uri;
  }

  function safeMint(uint256 _type, address to) public payable {
    require(msg.value == mintFee, "Incorrect mint fee");
    require(_type < _tokenTypeCounter.current(), "Nonexistent token type");

    uint256 tokenId = _tokenIdCounter.current();
    lastTossed[tokenId] = block.timestamp;
    tokenIdToType[tokenId] = _type;
    _safeMint(_msgSender(), tokenId);

    // Immediately toss to `address` if it's different from the minter.
    if (_msgSender() != to) {
      _transfer(_msgSender(), to, tokenId);
    }
    _tokenIdCounter.increment();
  }

  function isHot(uint256 tokenId) public view returns (bool) {
    require(lastTossed[tokenId] != 0, "isHot query for nonexistent token");
    return (block.timestamp - lastTossed[tokenId]) < hotDuration;
  }

  function burn(uint256 tokenId) public payable {
    address owner = ERC721.ownerOf(tokenId);
    require(_msgSender() == owner, "burn caller is not owner");
    require(msg.value == burnFee, "Incorrect burn fee");
    _burn(tokenId);
    lastTossed[tokenId] = 0;
    tokenIdToType[tokenId] = 0;
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

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    uint256 tokenType = tokenIdToType[tokenId];
    return tokenTypeToURI[tokenType];
  }
}
