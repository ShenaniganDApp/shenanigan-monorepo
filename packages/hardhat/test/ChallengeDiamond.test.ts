/* eslint-disable func-names */
/* eslint-disable import/named */
/* eslint-disable jest/valid-expect */

import { Fragment, FunctionFragment } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { deployments, ethers, getNamedAccounts } from 'hardhat';

import { expect } from './chai-setup';

const FacetCutAction = {
	Add: 0,
	Replace: 1,
	Remove: 2,
};

function getSelectors(contract: Contract) {
	const selectors = contract.interface.fragments.reduce((acc: any, val: Fragment) => {
		if (val.type === 'function') {
			const sig = contract.interface.getSighash(val as FunctionFragment);
			acc.push(sig);
			return acc;
		}
		return acc;
	}, []);
	return selectors;
}

describe('Challenge Diamond', () => {
	let Factory: Contract;
	let challengeFacet: Contract;
	let diamondAddress: unknown;
	before(async function () {
		await deployments.fixture();
		const { deployer } = await getNamedAccounts();

		Factory = await ethers.getContract('ChallengeFactory', deployer);
		const challengeFacetCut = await ethers.getContract('ChallengeFacet');
		const challengeTokenFacetCut = await ethers.getContract('ChallengeTokenFacet');

		const diamondCut = [
			[challengeFacetCut.address, FacetCutAction.Add, getSelectors(challengeFacetCut)],
			[challengeTokenFacetCut.address, FacetCutAction.Add, getSelectors(challengeTokenFacetCut)],
		];
		//@TODO use a second address for DAO
		const tx = await (await Factory.deployChallenge(diamondCut, [deployer, deployer])).wait();
		diamondAddress = tx.events[0].address;
		challengeFacet = await ethers.getContractAt('ChallengeFacet', diamondAddress as string);
	});

	it(' should deploy', async function () {
		const challengeFacetCut = await ethers.getContract('ChallengeFacet');
		const challengeTokenFacetCut = await ethers.getContract('ChallengeTokenFacet');

		const diamondCut = [
			[challengeFacetCut.address, FacetCutAction.Add, getSelectors(challengeFacetCut)],
			[challengeTokenFacetCut.address, FacetCutAction.Add, getSelectors(challengeTokenFacetCut)],
		];
		const { deployer } = await getNamedAccounts();
		await expect(Factory.deployChallenge(diamondCut, [deployer, deployer])).to.emit(Factory, 'ChallengeDeployed');
	});

	it(' should create Challenge', async () => {
		await expect(challengeFacet.createChallenge('a', 'b', 2, 100)).to.emit(challengeFacet, 'CreateChallenge');
	});

	it(' should close Challenge', async () => {
		await (await challengeFacet.resolveChallenge('a', 1, 2, 1)).wait();
		const info = await challengeFacet.challengeInfoByChallengeUrl('a');

		await expect(info.state).to.equal(1);

		await expect(info.result).to.equal(2);
	});

	it(' should increment id to 2', async () => {
		await (await challengeFacet.createChallenge('c', 'd', 2, 100)).wait();
		const info = await challengeFacet.challengeInfoByChallengeUrl('c');

		expect(info.id).to.equal(2);
	});

	it(' should have 0 price and price nonce default', async () => {
		const info = await challengeFacet.challengeInfoByChallengeUrl('c');

		expect(info.challengePrice).to.equal('0');
		expect(info.challengePriceNonce[0]).to.equal('0');
	});

	it(' should revert on a 0 price change', async () => {
		await expect(challengeFacet.setPrice('c', 0)).to.be.reverted;
	});

	it(' setPrice should only be called by owner', async () => {
		const { tester } = await getNamedAccounts();
		await expect(challengeFacet.connect(tester).setPrice('c', 0)).to.be.reverted;
	});

	it(' should change price to 1 ETH', async () => {
		await (await challengeFacet.setPrice('c', '100000000000000000')).wait();

		const info = await challengeFacet.challengeInfoByChallengeUrl('c');

		expect(info.challengePrice).to.equal('100000000000000000');
	});

	it(' should increment priceNonce', async () => {
		const info = await challengeFacet.challengeInfoByChallengeUrl('c');

		expect(info.challengePriceNonce[0]).to.equal(1);
	});
});
