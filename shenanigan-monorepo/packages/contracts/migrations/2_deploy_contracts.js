const IShenanigan = artifacts.require('ISHenanigan');
const Shenanigan = artifacts.require('Shenanigan');
const ShenaniganDataTypes = artifacts.require('ShenaniganDataTypes');
const ShenaniganStorage = artifacts.require('ShenaniganStorage');
const Election = artifacts.require('Election');
const Wager = artifacts.require('Wager');
const Voting = artifacts.require('Voting');
module.exports = function (deployer) {
  deployer.deploy(IShenanigan);
  deployer.deploy(Shenanigan);
  deployer.deploy(ShenaniganDataTypes);
  deployer.deploy(ShenaniganStorage);
  deployer.deploy(Election);
  deployer.deploy(Wager);
  deployer.deploy(Voting);
};
