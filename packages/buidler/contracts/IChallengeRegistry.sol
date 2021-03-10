// SPDX-License-Identifier: MIT


pragma solidity ^0.8.0;

interface IChallengeRegistry {
    function challengeAddress() external view returns (address);
    function challengeTokenAddress() external view returns (address);
    function bridgeMediatorAddress() external view returns (address);
    function trustedForwarder() external view returns (address);
}