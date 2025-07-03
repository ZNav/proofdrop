// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProofDrop is ERC721URIStorage, Ownable {
    uint256 public tokenCount;

    constructor() ERC721("ProofDrop", "DROP") Ownable(msg.sender) {}

    /// @notice Mint a new NFT with metadata URI
    /// @param tokenURI The URI pointing to immutable metadata (Arweave JSON)
    function mint(string memory tokenURI) external payable returns (uint256) {
        require(msg.value >= 0.005 ether, "Minting costs 0.005 ETH");

        tokenCount++;
        uint256 newTokenId = tokenCount;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        return newTokenId;
    }

    /// @notice Withdraw contract balance to owner
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
