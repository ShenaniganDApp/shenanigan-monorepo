/* eslint-disable import/no-extraneous-dependencies */
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@nomiclabs/hardhat-web3";

import fs from "fs";
import { task } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.0",
  },
  namedAccounts: {
    deployer: 0,
  },
  paths: {
    sources: "src",
  },
};

task("generate", "Create a mnemonic for hardhat deploys", async () => {
  // TODO
});

task(
  "account",
  "Get balance informations for the deployment account.",
  async () => {
    // TODO
  }
);

task(
  "select",
  "Activate one of the deploying accounts (just switchs mnemonic files around)"
)
  .addPositionalParam(
    "address",
    "The account's address. (should be an *address*.txt file here already from the `generate` task)"
  )
  .setAction(async (taskArgs) => {
    // TODO
  });

task("accounts", "Prints the list of accounts", async () => {
  // TODO
});

task("blockNumber", "Prints the block number", async () => {
  // TODO
});

task("balance", "Prints an account's balance")
  .addPositionalParam("account", "The account's address")
  .setAction(async (taskArgs) => {
    // TODO
  });

task("send", "Send ETH")
  .addParam("from", "From address or account index")
  .addOptionalParam("to", "To address or account index")
  .addOptionalParam("amount", "Amount to send in ether")
  .addOptionalParam("data", "Data included in transaction")
  .addOptionalParam("gasPrice", "Price you are willing to pay in gwei")
  .addOptionalParam("gasLimit", "Limit of how much gas to spend")

  .setAction(async (taskArgs) => {
    // TODO
  });

// eslint-disable-next-line import/no-default-export
export default config;
