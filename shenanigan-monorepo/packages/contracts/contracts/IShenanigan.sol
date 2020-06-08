// /*
//   This file is part of Shenanigan.
//   Shenanigan is free software: you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation, either version 3 of the License, or
//   (at your option) any later version.
//   Shenanigan is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//   You should have received a copy of the GNU General Public License
//   along with Shenanigan. If not, see <http://www.gnu.org/licenses/>.
// */

// pragma solidity >=0.4.21 <0.7.0;


// /// @title Shenanigan interface
// /// @notice All publicly available functions are available here
// contract IShenanigan is Ownable  {
//   // Implemented in Wager.sol
//   /// @notice Add a bet to an active wager
//   /// @param _teamSelection betters choice of betting option
//   function addBet(uint256 _teamSelection) public;

//   // Implemented in Wager.sol
//   /// @notice Withdraw function to remove a bet amount.
//   function withdrawBet() public;

//   // Implemented in Wager.sol
//   /// @notice Adds a betting option
//   /// @param _teamVal Integer representation of the betting option
//   function addTeam(uint256 _teamVal) public onlyOwner;

//    // Implemented in Wager.sol
//   /// @notice Adds a betting option
//   /// @param _winningTeam Integer representation of the winning betting option
//   /// @return returns total value of losing bets
//   function collectBets(uint256 _winningTeam) private view returns (uint256);

//   /// @notice Returns the colony network address set on the Colony.
//   /// @dev The colonyNetworkAddress we read here is set once, during `initialiseColony`.
//   /// @return colonyNetwork The address of Colony Network instance
//   function payWinner(uint256 _winningTeam) public;

//   /// @notice Toggle whether the wager is open or closed.
//   /// @return tokenAddress Address of the token contract
//   function toggleWagerStatus() public onlyOwner;

//   /// @notice Set new colony root role.
//   /// Can be called by root role only.
//   /// @param _user User we want to give an root role to
//   /// @param _BsetTo The state of the role permission (true assign the permission, false revokes it)
//   function addVote(address _user, bool _setTo) public;

//   /// @notice Set new colony arbitration role.
//   /// Can be called by root role or architecture role.
//   /// @param _permissionDomainId Domain in which the caller has root role
//   /// @param _childSkillIndex The index that the `_domainId` is relative to `_permissionDomainId`
//   /// @param _user User we want to give an arbitration role to
//   /// @param _domainId Domain in which we are giving user the role
//   /// @param _setTo The state of the role permission (true assign the permission, false revokes it)
//   function changeVote(uint256 _permissionDomainId, uint256 _childSkillIndex, address _user, uint256 _domainId, bool _setTo) public;

//   /// @notice Set new colony architecture role.
//   /// Can be called by root role or architecture role.
//   /// @param _permissionDomainId Domain in which the caller has root/architecture role
//   /// @param _childSkillIndex The index that the `_domainId` is relative to `_permissionDomainId`
//   /// @param _user User we want to give an architecture role to
//   /// @param _domainId Domain in which we are giving user the role
//   /// @param _setTo The state of the role permission (true assign the permission, false revokes it)
//   function closeVote(uint256 _permissionDomainId, uint256 _childSkillIndex, address _user, uint256 _domainId, bool _setTo) public;

//   /// @notice Set new colony funding role.
//   /// Can be called by root role or architecture role.
//   /// @param _permissionDomainId Domain in which the caller has root/architecture role
//   /// @param _childSkillIndex The index that the `_domainId` is relative to `_permissionDomainId`
//   /// @param _user User we want to give an funding role to
//   /// @param _domainId Domain in which we are giving user the role
//   /// @param _setTo The state of the role permission (true assign the permission, false revokes it)
//   function getTotals(uint256 _permissionDomainId, uint256 _childSkillIndex, address _user, uint256 _domainId, bool _setTo) public;

// }