//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HotPotato is ERC721 {
    using Counters for Counters.Counter;

    uint256 private constant _HOT_DURATION = 1 days;
    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => uint256) private _lastTouched;

    constructor() ERC721("HotPotato", "HOT") {}

    function safeMint(address to) public {
        _safeMint(to, _tokenIdCounter.current());
        _lastTouched[_tokenIdCounter.current()] = block.timestamp;
        _tokenIdCounter.increment();
    }

    function isHot(uint256 tokenId) public view returns (bool) {
        uint256 lastTouched = _lastTouched[tokenId];
        require(lastTouched != 0, "isHot query for nonexistent token");
        return (block.timestamp - lastTouched) < _HOT_DURATION;
    }
}
