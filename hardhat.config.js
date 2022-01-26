/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// Possible network values
const TEST_NETWORK = "TEST_NETWORK";
const LOCAL_NETWORK = "LOCAL_NETWORK";

// By default network is set to local, change it to TEST_NETWORK to make a switch
const NETWORK = TEST_NETWORK;

const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  paths: {
    artifacts: "./src/artifacts",
  },
  solidity: {
    version: "0.8.0",
    settings: {
      outputSelection: {
        "*": {
        "*": ["storageLayout"]
        }
      }
    }
   }, 
  networks: {
    hardhat: {},
    ropsten: {
      url: "https://ropsten.infura.io/v3/dede381cd8154673a99db5577f77ee91",
      accounts: [`0x${WALLET_PRIVATE_KEY}`],
    },
  },
};
