const { expect } = require("chai");

describe("ChallengeFactory", function () {
  it("Should return Challenge Id once its created", async function () {
    const ChallengeFactory = await ethers.getContractFactory(
      "ChallengeFactory"
    );
    const challengeFactory = await ChallengeFactory.deploy();

    await challengeFactory.deployed();
    expect(
      await challengeFactory.createChallenge(
        "0xc783df8a850f42e7f7e57013759c285caa701eb6",
        2,
        []
      )
    ).to.equal(0);
  });
});
