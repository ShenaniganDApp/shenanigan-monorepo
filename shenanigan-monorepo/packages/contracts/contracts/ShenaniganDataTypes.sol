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

contract ShenaniganDataTypes {

    event Deposit(address better, uint256 amount);
    event Withdraw(uint256 amount);
    event DonationSent(address donator, uint256 amount);
    event WagerStatus(bool wagerIsActive);
    
    struct Player {
        uint256 amountBet;
        uint256 team;
    }

    struct Team {
        uint256 total;
        uint256 playerCount;
        bool doesExist;
    }
    struct Voter {
        bool hasVoted;
        uint256 option;
    }
}