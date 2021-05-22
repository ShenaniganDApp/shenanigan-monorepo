/* eslint-disable func-names */
/* eslint-disable import/named */
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
	});

	it(' should deploy', async function () {
		const challengeFacetCut = await ethers.getContract('ChallengeFacet');
		const challengeTokenFacetCut = await ethers.getContract('ChallengeTokenFacet');

		const diamondCut = [
			[challengeFacetCut.address, FacetCutAction.Add, getSelectors(challengeFacetCut)],
			[challengeTokenFacetCut.address, FacetCutAction.Add, getSelectors(challengeTokenFacetCut)],
		];
		const { deployer } = await getNamedAccounts();
		await expect(
			Factory.deployChallenge(diamondCut, [deployer, deployer])
			// eslint-disable-next-line jest/valid-expect
		).to.emit(Factory, 'ChallengeDeployed');
	});
	it(' should create Challenge', async () => {
		const { deployer } = await getNamedAccounts();
		challengeFacet = await ethers.getContractAt('ChallengeFacet', diamondAddress as string);

		// eslint-disable-next-line jest/valid-expect
		await expect(challengeFacet.createChallenge('a', 'b', 2, 100)).to.emit(challengeFacet, 'CreateChallenge')
			.withArgs(1, deployer, 'a', 'b', 100, 2);
	});

	it(' should close Challenge', async () => {
		challengeFacet = await ethers.getContractAt('ChallengeFacet', diamondAddress as string);
		await(await challengeFacet.resolveChallenge('a', 1, 2, 1)).wait()
		const info = await challengeFacet.challengeInfoByChallengeUrl('a')

		// eslint-disable-next-line jest/valid-expect
		await expect(info.state).to.equal(1)

		// eslint-disable-next-line jest/valid-expect
		await expect(info.result).to.equal(2);
	});

	it(' id should increment', async () => {
		challengeFacet = await ethers.getContractAt('ChallengeFacet', diamondAddress as string);
		await (await challengeFacet.createChallenge('c', 'd', 2, 100)).wait()
		const info = await challengeFacet.challengeInfoByChallengeUrl('a')

		// eslint-disable-next-line jest/valid-expect
		expect(info.id).to.equal(2);
	});
});
