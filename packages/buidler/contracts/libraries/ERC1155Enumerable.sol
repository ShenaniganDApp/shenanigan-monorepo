// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

import '../utils/SafeMath.sol';
import '../utils/EnumerableSet.sol';

import './ERC1155Base.sol';
import './LibERC1155Enumerable.sol';

contract ERC1155Enumerable is ERC1155Base {
  using SafeMath for uint;
  using EnumerableSet for EnumerableSet.AddressSet;
  using EnumerableSet for EnumerableSet.UintSet;

  function totalSupply (uint id) public view returns (uint) {
    return LibERC1155Enumerable.layout().totalSupply[id];
  }

  function totalHolders (uint id) public view returns (uint) {
    return LibERC1155Enumerable.layout().accountsByToken[id].length();
  }

  function accountsByToken (uint id) public view returns (address[] memory) {
    EnumerableSet.AddressSet storage accounts = LibERC1155Enumerable.layout().accountsByToken[id];

    address[] memory addresses = new address[](accounts.length());

    for (uint i; i < accounts.length(); i++) {
      addresses[i] = accounts.at(i);
    }

    return addresses;
  }

  function tokensByAccount (address account) public view returns (uint[] memory) {
    EnumerableSet.UintSet storage tokens = LibERC1155Enumerable.layout().tokensByAccount[account];

    uint[] memory ids = new uint[](tokens.length());

    for (uint i; i < tokens.length(); i++) {
      ids[i] = tokens.at(i);
    }

    return ids;
  }

  function _beforeTokenTransfer (
    address operator,
    address from,
    address to,
    uint[] memory ids,
    uint[] memory amounts,
    bytes memory data
  ) virtual override internal {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

    if (from != to) {
      LibERC1155Enumerable.Layout storage l = LibERC1155Enumerable.layout();
      mapping (uint => EnumerableSet.AddressSet) storage tokenAccounts = l.accountsByToken;
      EnumerableSet.UintSet storage fromTokens = l.tokensByAccount[from];
      EnumerableSet.UintSet storage toTokens = l.tokensByAccount[to];

      for (uint i; i < ids.length; i++) {
        uint amount = amounts[i];

        if (amount > 0) {
          uint id = ids[i];

          if (from == address(0)) {
            l.totalSupply[id] = l.totalSupply[id].add(amount);
          } else if (balanceOf(from, id) == amount) {
            tokenAccounts[id].remove(from);
            fromTokens.remove(id);
          }

          if (to == address(0)) {
            l.totalSupply[id] = l.totalSupply[id].sub(amount);
          } else if (balanceOf(to, id) == 0) {
            tokenAccounts[id].add(to);
            toTokens.add(id);
          }
        }
      }
    }
  }
}
