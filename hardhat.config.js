/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// Possible network values
// const ROPSTEN_NETWORK = "ROPSTEN_TEST_NETWORK";
// const RINKEBY_NETWORK = "RINKEBY_TEST_NETWORK";
// const LOCAL_NETWORK = "LOCAL_NETWORK";

// By default network is set to local, change it to TEST_NETWORK to make a switch
// const NETWORK = ROPSTEN_NETWORK;

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

// if (NETWORK==ROPSTEN_NETWORK) {
//   const WALLET_PRIVATE_KEY = process.env.WALLET_PK_ROPSTEN
// }
// else if (NETWORK==RINKEBY_NETWORK) {
//   const WALLET_PRIVATE_KEY = process.env.WALLET_PK_RINKEBY
// }

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
      accounts: [`0x${process.env.WALLET_PK_ROPSTEN}`],
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.WALLET_PK_RINKEBY}`]
    }
  },
};
