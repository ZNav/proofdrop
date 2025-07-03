import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { WebBundlr } from "@bundlr-network/client";

import ProofDropABI from "./ProofDropABI.json";

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
const MINT_COST = ethers.utils.parseEther("0.005");

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [bundlr, setBundlr] = useState(null);
  const [account, setAccount] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [metadataUri, setMetadataUri] = useState("");
  const [minting, setMinting] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (window.ethereum) {
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(tempProvider);
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask required to use this app.");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const tempSigner = provider.getSigner();
    setSigner(tempSigner);
    const address = await tempSigner.getAddress();
    setAccount(address);

    const proofDropContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ProofDropABI,
      tempSigner
    );
    setContract(proofDropContract);

    // Initialize Bundlr
    const bundlrClient = new WebBundlr("https://node1.bundlr.network", "matic", tempSigner.provider);
    await bundlrClient.ready();
    setBundlr(bundlrClient);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToArweave = async () => {
    if (!file || !bundlr) {
      alert("File and wallet connection required.");
      return;
    }
    setUploading(true);
    try {
      const data = await file.arrayBuffer();
      const tx = bundlr.createTransaction(data, {
        tags: [{ name: "Content-Type", value: file.type }],
      });
      await tx.sign();
      const result = await tx.upload();
      const arweaveTxId = tx.id;

      // Create metadata JSON
      const metadata = {
        name: `ProofDrop Submission ${new Date().toISOString()}`,
        description: "Immutable public record submission via ProofDrop.",
        content_type: file.type,
        timestamp: new Date().toISOString(),
        arweave_tx_id: arweaveTxId,
      };
      const metadataString = JSON.stringify(metadata);
      const metaTx = bundlr.createTransaction(Buffer.from(metadataString), {
        tags: [{ name: "Content-Type", value: "application/json" }],
      });
      await metaTx.sign();
      await metaTx.upload();

      setMetadataUri(`https://arweave.net/${metaTx.id}`);
      alert("Upload successful!");
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
    setUploading(false);
  };

  const mintNFT = async () => {
    if (!contract || !metadataUri) {
      alert("Connect wallet and upload file first.");
      return;
    }
    setMinting(true);
    try {
      const tx = await contract.mint(metadataUri, { value: MINT_COST });
      const receipt = await tx.wait();
      const tokenId = receipt.events[0].args[0].toNumber();
      setTokenId(tokenId);
      alert(`Minted NFT with Token ID: ${tokenId}`);
    } catch (err) {
      alert("Minting failed: " + err.message);
    }
    setMinting(false);
  };

  // Toggle dark/light mode
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="app-container">
      <header>
        <h1>ProofDrop</h1>
        <button onClick={toggleTheme}>
          Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
      </header>

      {!account ? (
        <button className="connect-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <p>Connected: {account}</p>
        </div>
      )}

      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadToArweave} disabled={uploading || !file}>
          {uploading ? "Uploading..." : "Upload to Arweave"}
        </button>
      </div>

      <div className="mint-section">
        <button onClick={mintNFT} disabled={minting || !metadataUri}>
          {minting ? "Minting..." : "Mint NFT"}
        </button>
      </div>

      {tokenId && (
        <div className="success-message">
          <p>NFT Minted! Token ID: {tokenId}</p>
          <p>
            View metadata:{" "}
            <a href={metadataUri} target="_blank" rel="noreferrer">
              {metadataUri}
            </a>
          </p>
        </div>
      )}

      <footer>
        <p>ProofDrop &mdash; Immutable Public Record</p>
      </footer>

      <style>{`
        :root {
          --bg-dark: #121212;
          --bg-light: #f5f5f5;
          --text-dark: #f5f5f5;
          --text-light: #121212;
          --accent: #4caf50;
          --btn-bg: #333;
          --btn-hover-bg: #555;
        }

        [data-theme="dark"] {
          background-color: var(--bg-dark);
          color: var(--text-dark);
        }

        [data-theme="light"] {
          background-color: var(--bg-light);
          color: var(--text-light);
        }

        .app-container {
          max-width: 480px;
          margin: 0 auto;
          padding: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
            Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        button {
          background-color: var(--btn-bg);
          border: none;
          color: var(--text-dark);
          padding: 0.6rem 1.2rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }

        [data-theme="light"] button {
          background-color: #ddd;
          color: var(--text-light);
        }

        button:hover {
          background-color: var(--btn-hover-bg);
        }

        .connect-btn {
          width: 100%;
          margin-bottom: 1rem;
        }

        .upload-section,
        .mint-section {
          margin-bottom: 1rem;
        }

        input[type="file"] {
          width: 100%;
          margin-bottom: 0.5rem;
        }

        a {
          color: var(--accent);
          word-break: break-all;
        }

        footer {
          margin-top: auto;
          text-align: center;
          padding: 1rem 0;
          font-size: 0.8rem;
          opacity: 0.6;
        }

        @media (max-width: 600px) {
          .app-container {
            padding: 0.5rem;
          }

          button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
