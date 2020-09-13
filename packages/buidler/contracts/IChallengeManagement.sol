
pragma solidity >=0.6.0 <0.7.0;

interface IChallengeManagement {

  function createChallenge(address athlete, uint256 challengeId, string calldata challengeUrl, string calldata jsonUrl) external returns (uint256);
  function fixFailedMessage(bytes32 _dataHash) external;

}