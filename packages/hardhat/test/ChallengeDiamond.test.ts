/* eslint-disable func-names */
/* eslint-disable import/named */
import { Contract } from '@ethersproject/contracts';
import { deployments, ethers } from 'hardhat';

import { expect } from './chai-setup';

describe('Challenge Diamond', () => {
	let Factory: Contract;
	let challengeFacet: Contract;
	let diamondAddress: string | void;
	before(async function () {
		await deployments.fixture();
		Factory = await ethers.getContract('ChallengeFactory');
	});

	it(' should deploy', async function () {
		// eslint-disable-next-line jest/valid-expect
		await expect((diamondAddress = Factory.deployChallenge())).to.emit(Factory, 'ChallengeDeployed');
	});
	it('should create Challenge', async () => {
		challengeFacet = await ethers.getContractAt('ChallengeFacet', diamondAddress as string);

		// eslint-disable-next-line jest/valid-expect
		await expect(challengeFacet.createChallenge('', '', 2, 100)).to.emit(challengeFacet, 'ChallengeCreated');
	});
});
