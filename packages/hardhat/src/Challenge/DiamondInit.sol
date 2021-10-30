// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/******************************************************************************\
* Author: Nick Mudge <nick@perfectabstractions.com> (https://twitter.com/mudgen)
* EIP-2535 Diamonds: https://eips.ethereum.org/EIPS/eip-2535
*
* Implementation of a diamond.
/******************************************************************************/

import { ChallengeStorage } from "./libraries/LibChallengeStorage.sol";
import { LibDiamond } from "../shared/libraries/LibDiamond.sol";
import { IDiamondLoupe } from "../shared/interfaces/IDiamondLoupe.sol";
import { IDiamondCut } from "../shared/interfaces/IDiamondCut.sol";
import { IERC173 } from "../shared/interfaces/IERC173.sol";
import { IERC165 } from "../shared/interfaces/IERC165.sol";

// It is exapected that this contract is customized if you want to deploy your diamond
// with data from a deployment script. Use the init function to initialize state variables
// of your diamond. Add parameters to the init funciton if you need to.

contract DiamondInit {    
    ChallengeStorage internal cs;

    struct DiamondArgs {
        address owner;
        address dao;
    }

    // You can add parameters to this function in order to pass in 
    // data to set your own state variables
    function init(DiamondArgs memory _diamondArgs) external {
        LibDiamond.setContractOwner(_diamondArgs.owner);
        cs.dao = _diamondArgs.dao;
        cs.checkSignatureFlag = true;

        // adding ERC165 data
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        ds.supportedInterfaces[type(IERC165).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
        ds.supportedInterfaces[type(IERC173).interfaceId] = true;

    }
}