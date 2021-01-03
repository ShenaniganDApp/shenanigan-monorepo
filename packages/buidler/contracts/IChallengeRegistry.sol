// SPDX-License-Identifier: MIT


pragma solidity ^0.7.6;

interface IChallengeRegistry {
    function challengeAddress() external view returns (address);
    function challengeTokenAddress() external view returns (address);
    function bridgeMediatorAddress() external view returns (address);
    function trustedForwarder() external view returns (address);
}