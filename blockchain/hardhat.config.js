require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
module.exports = {
  solidity: "0.8.28",
  networks: {
      fuji: {
           url: process.env.AVAX_RPC_URL,
           accounts: [process.env.AVAX_PRIVATE_KEY],
      },
  },
};
