/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("DiamondCutFacet", {
    from: deployer,
    log: true,
    deterministicDeployment: true,
  });

  await deploy("DiamondLoupeFacet", {
    from: deployer,
    log: true,
    deterministicDeployment: true,
  });

  await deploy("OwnershipFacet", {
    from: deployer,
    log: true,
    deterministicDeployment: true,
  });
    
  await deploy("ChallengeFacet", {
    from: deployer,
    log: true,
    deterministicDeployment: true,
  });
  
  // await deploy("ChallengeTokenFacet", {
  //   from: deployer,
  //   log: true,
  //   deterministicDeployment: true,
  // });
};
// eslint-disable-next-line import/no-default-export
export default func;
func.tags = ['Facets']