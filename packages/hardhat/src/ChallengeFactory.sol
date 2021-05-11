// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.0;

import {IDiamondCut} from "./interfaces/IDiamondCut.sol";
import {ChallengeDiamond} from "./ChallengeDiamond.sol";

contract ChallengeFactory {

    event ChallengeDeployed(address indexed challengeAddr);

    function deployChallenge(
        IDiamondCut.FacetCut[] memory _diamondCut,
        ChallengeDiamond.DiamondArgs memory _args
    ) external returns (address) {
        ChallengeDiamond challenge = new ChallengeDiamond(_diamondCut, _args);
        emit ChallengeDeployed(address(challenge));
        return address(challenge);
    }
}
