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
import "./ShenaniganDataTypes.sol";


contract ShenaniganStorage is ShenaniganDataTypes {
    //Wager.sol
    uint256 teamCount;
    bool wagerIsActive;
    bool wagerIsFinished;
    uint256 donatedFunds;

          // mapping functions to store player and team data
    mapping(address => Player) bets;
    mapping(uint256 => Team) teams;

    //Voting.sol
    mapping(address => Voter) voters;
        // Vote from the streamer
    uint256 primaryVote;
    bool isOpen;
    uint256 optionCount;
    uint256[] totalVotes;
}