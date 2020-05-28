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
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract Pool is Ownable {

    struct Player {
        uint amountBet;
        uint team;
    }

    struct Team {
        uint total;
        uint playerCount;
        bool doesExist;
    }

    
    uint teamCount;
    bool wagerIsActive;

    // mapping functions to store player and team data
    mapping (address => Player) bets;
    mapping (uint => Team) teams;

    event Deposit(address better, uint amount);
    event Withdraw(uint amount);
    event DonationSent(address donator, uint amount);
    event PoolStatus(bool status);

    constructor(uint teamNums, bool status) public onlyOwner {
        require(teamNums >= 2);
        teamCount = teamNums;
        wagerIsActive = status;
        for(uint i = 1; i <= teamCount; i++){
            teams[i].doesExist = true;
        }
        emit PoolStatus(status);
    }

    function addBet(uint teamSelection)
    public payable {
        require(msg.sender != owner());
        require(msg.value > 0);
        require(teamSelection <= teamCount);
        require(wagerIsActive == true);
        require(bets[msg.sender].amountBet == 0);
        bets[msg.sender].amountBet = msg.value;
        bets[msg.sender].team = teamSelection;
        teams[teamSelection].total += (msg.value);
        teams[teamSelection].playerCount += 1;
        emit Deposit(msg.sender, msg.value);
    }

    function withdrawBet() public {
        require(bets[msg.sender].amountBet <= address(this).balance);
        require(wagerIsActive == true);
        uint currentTeam = bets[msg.sender].team;
        uint totalWinnings = bets[msg.sender].amountBet;
        teams[currentTeam].total -= bets[msg.sender].amountBet;
        teams[currentTeam].playerCount -= 1;
        msg.sender.transfer(totalWinnings);
        delete bets[msg.sender];
        emit Withdraw(totalWinnings);
    }

    function addTeam(uint teamVal) public onlyOwner{
        require(!teams[teamVal].doesExist);
        teams[teamVal].doesExist = true;
        teamCount+=1;
    }

    function collectBets(uint winningTeam) private view returns (uint) {
        uint losersTotal = 0;
        for(uint i = 0; i < teamCount; i++) {
            if(!(i == winningTeam)){
                losersTotal += teams[i].total;
            }
        }
        return losersTotal;
    }

    function payWinner(uint winningTeam) public {
        require(bets[msg.sender].team == winningTeam);
        require(wagerIsActive == false);
        uint losersTotal = collectBets(winningTeam);
        uint winnerCount = teams[winningTeam].playerCount;
        uint initialBet = bets[msg.sender].amountBet;
        uint payout = initialBet + ((initialBet*losersTotal)/winnerCount);
        msg.sender.transfer(payout);
    }

    function tipWagerOwner() public payable {
        require(msg.value > 0);
        require(msg.sender != owner());
        address payable poolOwner = address(uint160(owner()));
        poolOwner.transfer(msg.value);
        emit DonationSent(msg.sender, msg.value);
    }

    function toggleWagerStatus() public onlyOwner {
        wagerIsActive = !wagerIsActive;
        emit PoolStatus(wagerIsActive);
    }

    // function cancelWager() public onlyOwner {

    // }


}