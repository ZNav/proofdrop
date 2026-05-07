# proofdrop

> *Mint a tamper-proof, anonymous, on-chain receipt of any data you want
> permanently witnessed.*

ProofDrop is a minimal ERC-721 contract that lets anyone pay a small fee to
mint an NFT whose token URI points to immutable, decentrally-stored metadata
(typically Arweave JSON). The mint transaction itself becomes the proof:
public, timestamped by the chain, untamperable as long as the chain exists.

## Why

- **Whistleblower receipts** — pin a document hash on-chain so its existence at
  a specific timestamp can be verified later, even if the original is taken down.
- **Research / IP priority** — establish "I had this idea on this date" without
  trusting a registrar, lawyer, or notary.
- **Censorship-resistant witness records** — testimony, evidence, journalism
  artifacts that survive platform takedowns.
- **Just decentralization** — no account, no KYC, no trust beyond the chain.

If a centralized service can revoke your proof, it isn't proof. Mint and the
record outlives any single actor.

## How it works

1. **You upload your data** (or its hash) to immutable storage — Arweave,
   IPFS-pinned, or another permanent store. You get back a URI.
2. **You call `mint(tokenURI)`** with `0.005 ETH`. The contract issues an NFT
   in your wallet whose `tokenURI` points at that data.
3. **The transaction is the receipt.** Block height, timestamp, sender,
   token URI — all immutable on-chain.

```solidity
function mint(string memory tokenURI) external payable returns (uint256) {
    require(msg.value >= 0.005 ether, "Minting costs 0.005 ETH");
    tokenCount++;
    _safeMint(msg.sender, tokenCount);
    _setTokenURI(tokenCount, tokenURI);
    return tokenCount;
}
```

## Stack

- **Contract**: Solidity `^0.8.0` · OpenZeppelin ERC721URIStorage + Ownable
- **Tooling**: Hardhat
- **Networks (configured)**: localhost · Polygon Amoy testnet
- **Frontend**: vanilla JS (`frontend/`)

## Quick start

### Prerequisites
- Node.js 18+
- Yarn (or npm)
- MetaMask or any Ethereum-compatible wallet

### Setup
```bash
git clone https://github.com/ZNav/proofdrop.git
cd proofdrop
yarn install
```

Create a `.env` (gitignored — never commit):
```env
PRIVATE_KEY=your_wallet_private_key
ALCHEMY_API_KEY=your_alchemy_key
```

### Deploy locally
```bash
npx hardhat node                                 # in one terminal
npx hardhat run scripts/deploy.js --network localhost
```

### Deploy to Amoy testnet
```bash
npx hardhat run scripts/deploy.js --network amoy
```

Save the deployed address — that's your contract.

### Mint a proof
```js
// scripts/testMint.js
const hre = require("hardhat");

async function main() {
  const [user] = await hre.ethers.getSigners();
  const contract = await hre.ethers.getContractAt(
    "ProofDrop",
    "<YOUR_DEPLOYED_CONTRACT_ADDRESS>"
  );

  const tx = await contract.mint("https://arweave.net/<your-data-hash>", {
    value: hre.ethers.utils.parseEther("0.005"),
  });
  const receipt = await tx.wait();
  console.log("Minted. Tx hash:", receipt.transactionHash);
}
main().catch(console.error);
```

```bash
npx hardhat run scripts/testMint.js --network localhost
```

## Repository layout

```
contracts/ProofDrop.sol     # the contract
scripts/deploy.js           # deployer
frontend/                   # vanilla JS minting UI
hardhat.config.js
test-env.js                 # network sanity check
validate.js                 # post-deploy contract validation
```

## Notes & caveats

- **Mint cost**: `0.005 ETH` (or chain-equivalent). Owner can `withdraw()` the
  collected balance.
- **Permanence depends on the data layer**, not just the chain. The on-chain
  token URI is forever; whether the data behind that URI stays accessible is
  on the storage provider. Arweave's "pay once, hosted forever" model is the
  recommended target for the metadata.
- **Anonymity** is only as good as your wallet's anonymity. Use a fresh
  address for sensitive proofs and consider a privacy chain or mixer-aware
  workflow.
- **Gas costs vary by chain.** Amoy is testnet (~free); mainnet Polygon or
  Ethereum will cost real money to deploy and mint.
- **Never commit your `.env`.**

## License

MIT — see [`LICENSE`](LICENSE).
