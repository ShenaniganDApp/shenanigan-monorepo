const ChallengeFactory = artifacts.require('ChallengeFactory');
module.exports = function (deployer) {
  deployer.deploy(ChallengeFactory);
};
