ProofDrop

A simple immutable and public NFT minting smart contract for uploading proof data anonymously and immutably.

Project Setup

Prerequisites:

    Node.js (v18+ recommended)

    Yarn package manager

    MetaMask or another Ethereum-compatible wallet

Installation

    Clone the repo:
    git clone https://github.com/your-username/proofdrop.git
    cd proofdrop

    Install dependencies:
    yarn install

    Create a .env file in the root directory with the following content:
    PRIVATE_KEY=your_private_key_here
    ALCHEMY_API_KEY=your_alchemy_api_key_here

Replace your_private_key_here with your wallet private key (with or without the 0x prefix).

Hardhat Configuration

Your hardhat.config.js should include the following network setup, including Amoy network configuration:

require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
solidity: "0.8.21",
networks: {
localhost: {
url: "http://127.0.0.1:8545",
},
amoy: {
url: "https://rpc-amoy.polygon.technology/",
accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
},
},
};

Usage

Compile the contracts:
npx hardhat compile

Run a local blockchain node:
npx hardhat node

Deploy the contract locally:
npx hardhat run scripts/deploy.js --network localhost

Deploy to Amoy network:
npx hardhat run scripts/deploy.js --network amoy

Testing mint function locally

Create a script scripts/testMint.js with the following content:

const hre = require("hardhat");

async function main() {
const [user] = await hre.ethers.getSigners();
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

const ProofDrop = await hre.ethers.getContractFactory("ProofDrop");
const contract = await ProofDrop.attach(contractAddress);

const tx = await contract.mint("https://arweave.net/test-uri", {
value: hre.ethers.utils.parseEther("0.005"),
});

const receipt = await tx.wait();
console.log("Minted! Tx hash:", receipt.transactionHash);
}

main().catch(console.error);

Run the script:
npx hardhat run scripts/testMint.js --network localhost

Replace YOUR_DEPLOYED_CONTRACT_ADDRESS with the address output during deployment.

Notes

    Do not commit your .env file to GitHub.

    Make sure your wallet has sufficient funds on the chosen network (Amoy or local).

    Minting requires 0.005 ETH or equivalent on the network.

If you want help with frontend integration, contract verification, or additional features, just ask!
