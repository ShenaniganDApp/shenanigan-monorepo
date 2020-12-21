/* global ethers, describe, it, before */
const { expect } = require('chai');
const truffleAssert = require('truffle-assertions');
const fs = require('fs');
const { deployProject } = '../scripts/deploy.js';
const diamond = require('diamond-util');


function getSelectors(contract) {
	const signatures = Object.keys(contract.interface.functions);
	const selectors = signatures.reduce((acc, val) => {
		if (val !== 'init(bytes)') {
			acc.push(contract.interface.getSighash(val));
		}
		return acc;
	}, []);
	return selectors;
}

function getArtifactBytecode(name) {
	const json = JSON.parse(fs.readFileSync(`./artifacts/${name}.json`, 'utf8'));
	return json.deployedBytecode;
}

describe('Deploying Contracts and Minting Challenges', async function() {
	before(async function() {
    const deployVars = await deployProject();
    console.log('deployVars: ', deployVars);
		global.set = true;
		global.account = deployVars.account;
		global.challengeDiamond = deployVars.challengeDiamond;
		global.baseChallengeFacet = deployVars.baseChallengeFacet;
		global.challengeTokenFacet = deployVars.challengeTokenFacet;
		global.diamondLoupeFacet = deployVars.diamondLoupeFacet;
	});
});

describe('Creating Base Challenge', function() {
	it('Create a Challenge', async function() {
		await truffleAssert.reverts(
			global.baseChallengeFacet.createChallenge('ipfs://ipfs/', 'ipfs://ipfs/', 2, 100),
			'Failed to Create Challenge'
		);
	});
});
