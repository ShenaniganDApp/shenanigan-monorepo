/* eslint-disable func-names */
/* eslint-disable import/named */
import { deployments, ethers, getNamedAccounts } from "hardhat";

import { expect } from "./chai-setup";

describe("Challenge Diamond", () => {
  it(" should deploy", async function() {
    await deployments.fixture(["Token"]);
    const { tokenOwner } = await getNamedAccounts();
    const Token = await ethers.getContract("Token");
    const ownerBalance = await Token.balanceOf(tokenOwner);
    const supply = await Token.totalSupply();
    expect(ownerBalance).to.equal(supply);
  });
});
