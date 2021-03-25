/* eslint-disable import/no-extraneous-dependencies */
import "hardhat-deploy";
import "hardhat-deploy-ethers";

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
// eslint-disable-next-line import/no-default-export
export default config;
