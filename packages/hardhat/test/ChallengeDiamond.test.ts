/* eslint-disable func-names */
/* eslint-disable import/named */
import { deployments, ethers } from "hardhat";

import { expect } from "./chai-setup";

describe("Challenge Diamond", () => {
  it(" should deploy", async function() {
    await deployments.fixture();
    const Factory = await ethers.getContract("ChallengeFactory");
    // eslint-disable-next-line jest/valid-expect
    await expect(Factory.deployChallenge()).to.emit(Factory, 'ChallengeDeployed')
  });
});
