// SPDX-License-Identifier: MIT


pragma solidity ^0.8.0;

import {ChallengeStorage, LibChallengeStorage} from "./LibChallengeStorage.sol";
import {LibDiamond} from "./LibDiamond.sol";
import "../cryptography/ECDSA.sol";
import "../utils/Address.sol";
import "../IERC1271.sol";

bytes4 constant _INTERFACE_ID_ERC1271 = 0x1626ba7e;
bytes4 constant _ERC1271FAILVALUE = 0xffffffff;

library LibSignatureChecker {
    using ECDSA for bytes32;
    using Address for address;


    function setCheckSignatureFlag(bool newFlag) internal {
      LibDiamond.enforceIsContractOwner();
      ChallengeStorage storage s = LibChallengeStorage.diamondStorage();
      s.checkSignatureFlag = newFlag;
    }

    function getSigner(bytes32 signedHash, bytes memory signature) internal pure returns (address)
    {
        return signedHash.toEthSignedMessageHash().recover(signature);
    }

    function checkSignature(bytes32 signedHash, bytes memory signature, address checkAddress) internal view returns (bool) {
      if(checkAddress.isContract()) {
        return IERC1271(checkAddress).isValidSignature(signedHash, signature) == _INTERFACE_ID_ERC1271;
      } else {
        return getSigner(signedHash, signature) == checkAddress;
      }
    }

}