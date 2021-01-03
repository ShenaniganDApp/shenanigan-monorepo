// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ChallengeRegistry is Ownable {
    address public challengeAddress;
    address public challengeTokenAddress;
    address public bridgeMediatorAddress;
    address public trustedForwarder;

    function setChallengeAddress(address _address) public onlyOwner {
        challengeAddress = _address;
    }

    function setChallengeTokenAddress(address _address) public onlyOwner {
        challengeTokenAddress = _address;
    }

    function setBridgeMediatorAddress(address _address) public onlyOwner {
        bridgeMediatorAddress = _address;
    }

    function setTrustedForwarder(address _trustedForwarder) public onlyOwner {
        trustedForwarder = _trustedForwarder;
    }
}
