/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments, getNamedAccounts } = hre;
	const { diamond } = deployments;

	const { deployer } = await getNamedAccounts();

	await diamond.deploy('ChallengeDiamond', {
		from: deployer,
		owner: deployer,
		gasLimit: 9000000,
		facets: ['ChallengeFacet', 'ChallengeTokenFacet'],
	});
};
// eslint-disable-next-line import/no-default-export
export default func;
func.tags = ['Diamond'];
