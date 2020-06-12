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
pragma solidity >=0.4.21 <0.7.0;

/// @title Shenanigan interface
/// @notice All publicly available functions are available here
abstract contract IShenanigan {
  // // Implemented in Wager.sol
  // /// @notice Add a bet to an active wager
  // /// @param _teamSelection betters choice of betting option
  // function addBet(uint256 _teamSelection) public;

  // // Implemented in Wager.sol
  // /// @notice Withdraw function to remove a bet amount.
  // function withdrawBet() public;

  // // Implemented in Wager.sol
  // /// @notice Adds a betting option
  // /// @param _teamVal Integer representation of the betting option
  // function addTeam(uint256 _teamVal) public;

  //  // Implemented in Wager.sol
  // /// @notice Adds a betting option
  // /// @param _winningTeam Integer representation of the winning betting option
  // /// @return returns total value of losing bets
  // function collectBets(uint256 _winningTeam) private view returns (uint256);

  // /// @notice Called by the winner to receive bet winnings
  // /// @param _winningTeam Integer representation of the winning betting option
  // function payWinner(uint256 _winningTeam) public;

  // /// @notice Toggle whether the wager is open or closed.
  // function toggleWagerStatus() public ;

  // // Implemented in Voting.sol
  // /// @notice Add vote for the currentv open wager.
  // /// @param _voter Address of the voting entity.
  // function addVote(address _voter) public;

  // // Implemented in Voting.sol
  // /// @notice Changes a vote
  // /// Requires a prior vote to have been placed from the address
  // /// @param _voter Address of the voting entity.
  // function changeVote(address _voter) public;

  // // Implemented in Voting.sol
  // /// @notice Closes betting vote
  // function closeVote() public;

  // /// @notice Gets the array of votes to be counted.
  // function getTotals() public;

}