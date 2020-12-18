// SPDX-License-Identifier: MIT

pragma solidity ^0.7.5;

library LibERC1155Base {
  bytes32 internal constant STORAGE_SLOT = keccak256(
    'solidstate.contracts.storage.ERC1155Base'
  );

  struct Layout {
    mapping (uint => mapping (address => uint)) balances;
    mapping (uint256 => address) nfOwners;
    mapping (address => mapping (address => bool)) operatorApprovals;
  }

  function layout () internal pure returns (Layout storage l) {
    bytes32 slot = STORAGE_SLOT;
    assembly { l.slot := slot }
  }
}
