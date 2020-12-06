/*
  This file is part of Shenanigan.
  Shenanigan is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  Shenanigan is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  You should have received a copy of the GNU General Public License
  along with Shenanigan. If not, see <http://www.gnu.org/licenses/>.
*/
pragma solidity ^0.7.5;

/**
 * @notice ERC-1271: Standard Signature Validation Method for Contracts
 */
interface IERC1271 {

//    bytes4 internal constant _ERC1271MAGICVALUE = 0x1626ba7e;
//    bytes4 internal constant _ERC1271FAILVALUE = 0xffffffff;

    /**
     * @dev Should return whether the signature provided is valid for the provided data
     * @param _hash hash of the data signed//Arbitrary length data signed on the behalf of address(this)
     * @param _signature Signature byte array associated with _data
     *
     * @return magicValue either 0x1626ba7e on success or 0xffffffff failure
     */
    function isValidSignature(
        bytes32 _hash, //bytes memory _data,
        bytes calldata _signature
    )
    external
    view
    returns (bytes4 magicValue);
}