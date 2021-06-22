//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HotPotato is ERC721 {
    using Counters for Counters.Counter;

    uint256 private constant _HOT_DURATION = 1 days;
    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => uint256) private _lastPassed;

    constructor() ERC721("HotPotato", "HOT") {}

    function safeMint(address to) public {
        _lastPassed[_tokenIdCounter.current()] = block.timestamp;
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function isHot(uint256 tokenId) public view returns (bool) {
        uint256 lastTouched = _lastPassed[tokenId];
        require(lastTouched != 0, "isHot query for nonexistent token");
        return (block.timestamp - lastTouched) < _HOT_DURATION;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        require(isHot(tokenId), "Cannot transfer cold potato");
        _lastPassed[tokenId] = block.timestamp;
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // TODO: set a proper token URI.
    // TODO: add a burn method.
}
