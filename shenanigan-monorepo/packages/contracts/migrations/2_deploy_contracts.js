const Wager = artifacts.require('Wager');
module.exports = function (deployer) {
  deployer.deploy(Wager);
};
