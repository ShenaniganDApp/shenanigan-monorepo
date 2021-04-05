// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.0;

import "./interfaces/IDiamondCut.sol";
import { ChallengeDiamond } from "./ChallengeDiamond.sol";

contract ChallengeFactory {

    IDiamondCut.FacetCut[] diamondCut;
    ChallengeDiamond.DiamondArgs args; 

    event ChallengeDeployed(address indexed challengeAddr);

    constructor(
        IDiamondCut.FacetCut[] memory _diamondCut,
        ChallengeDiamond.DiamondArgs memory _args
    ) {
        for (uint i = 0; i < _diamondCut.length; i++) {
            diamondCut.push(_diamondCut[i]);
        }
        args = _args;
    }

    function deployChallenge() external returns(address) {
        IDiamondCut.FacetCut[] memory _diamondCut = diamondCut;
        ChallengeDiamond.DiamondArgs memory _args = args;
        ChallengeDiamond challenge = new ChallengeDiamond(_diamondCut, _args);
        emit ChallengeDeployed(address(challenge));
        return address(challenge);
    }
}