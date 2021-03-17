pragma solidity ^0.8.0; 

interface ITokenManagement {

  function mint(address to, uint256 tokenId, string calldata challengeUrl, string calldata jsonUrl) external returns (uint256);
  function fixFailedMessage(bytes32 _dataHash) external;

}