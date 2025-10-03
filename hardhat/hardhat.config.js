require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            url: "http://127.0.0.1:8545",
        },
        doma: {
            url: process.env.DOMA_RPC_URL || "https://rpc-testnet.doma.xyz",
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
            chainId: 97476, // Doma testnet chain ID
            timeout: 60000,
            gasPrice: "auto",
        },
    },
    etherscan: {
        apiKey: {
            doma: process.env.ETHERSCAN_API_KEY || "dummy",
        },
    },
};
