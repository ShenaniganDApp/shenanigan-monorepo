/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
import { Contract } from "ethers";
import { Fragment, FunctionFragment } from "ethers/lib/utils";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const FacetCutAction = {
    Add: 0,
    Replace: 1,
    Remove: 2,
  };

  function getSelectors(contract: Contract) {
    const selectors = contract.interface.fragments.reduce(
      (acc: any, val: Fragment) => {
        if (val.type === "function") {
          const sig = contract.interface.getSighash(val as FunctionFragment);
          acc.push(sig);
          return acc;
        } 
        return acc;
      },
      []
    );
    return selectors;
  }

  const diamondCutFacet = await ethers.getContract("DiamondCutFacet");
  const diamondLoupeFacet = await ethers.getContract("DiamondLoupeFacet");
  const ownershipFacet = await ethers.getContract("OwnershipFacet");
  const challengeFacet = await ethers.getContract("ChallengeFacet");
  const challengeTokenFacet = await ethers.getContract("ChallengeTokenFacet");

  const diamondCut = [
    [
      diamondCutFacet.address,
      FacetCutAction.Add,
      getSelectors(diamondCutFacet),
    ],
    [
      diamondLoupeFacet.address,
      FacetCutAction.Add,
      getSelectors(diamondLoupeFacet),
    ],
    [
      ownershipFacet.address,
      FacetCutAction.Add,
      getSelectors(ownershipFacet),
    ],
    // [
    //   challengeFacet.address,
    //   FacetCutAction.Add,
    //   getSelectors(challengeFacet),
    // ],
    // [
    //   challengeTokenFacet.address,
    //   FacetCutAction.Add,
    //   getSelectors(challengeTokenFacet),
    // ]
  ];

  await deploy("ChallengeFactory", {
    from: deployer,
    args: [diamondCut, [
      deployer,
      ethers.constants.AddressZero,
      challengeFacet.address,
      challengeTokenFacet.address,
    ]],
    log: true,
    deterministicDeployment: true,
  });
};
// eslint-disable-next-line import/no-default-export
export default func;
func.tags = ['ChallengeFactory']