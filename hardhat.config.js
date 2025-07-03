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
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [], // set your private key in env
    },
  },
};
