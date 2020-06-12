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
import "./ShenaniganStorage.sol";

contract Wager is Ownable, ShenaniganStorage {

    constructor(uint256 _teamNums, bool _status) public {
        require(_teamNums >= 2);
        emit WagerStatus(_status);
    }

    function addBet(uint256 _teamSelection) public payable {
        require(msg.sender != owner());
        require(msg.value > 0);
        require(_teamSelection <= teamCount);
        require(wagerIsActive == true);
        bets[msg.sender].amountBet += msg.value;
        bets[msg.sender].team = _teamSelection;
        teams[_teamSelection].total += (msg.value);
        teams[_teamSelection].playerCount += 1;
        emit Deposit(msg.sender, msg.value);
    }

    function withdrawBet() public {
        require(bets[msg.sender].amountBet <= address(this).balance);
        require(wagerIsActive == true);
        uint256 currentTeam = bets[msg.sender].team;
        uint256 totalWinnings = bets[msg.sender].amountBet;
        teams[currentTeam].total -= bets[msg.sender].amountBet;
        teams[currentTeam].playerCount -= 1;
        msg.sender.transfer(totalWinnings);
        delete bets[msg.sender];
        emit Withdraw(totalWinnings);
    }

    function addTeam(uint256 _teamVal) public onlyOwner {
        require(!teams[_teamVal].doesExist);
        teams[_teamVal].doesExist = true;
        teamCount += 1;
    }

    function collectBets(uint256 _winningTeam) private view returns (uint256) {
        uint256 losersTotal = 0;
        for (uint256 i = 0; i < teamCount; i++) {
            if (!(i == _winningTeam)) {
                losersTotal += teams[i].total;
            }
        }
        return losersTotal;
    }

    function payWinner(uint256 _winningTeam) public {
        require(bets[msg.sender].team == _winningTeam);
        require(wagerIsActive == false);
        require(wagerIsFinished == true);
        uint256 losersTotal = collectBets(_winningTeam);
        uint256 winnerCount = teams[_winningTeam].playerCount;
        uint256 initialBet = bets[msg.sender].amountBet;
        uint256 payout = initialBet +
            ((initialBet * losersTotal) / winnerCount);
        msg.sender.transfer(payout);
    }

    function toggleWagerStatus() public onlyOwner {
        wagerIsActive = !wagerIsActive;
        if(wagerIsFinished == true){
            msg.sender.transfer(donatedFunds);
        }
        emit WagerStatus(wagerIsActive);
    }

    function getTotalElectionFunds() public returns(uint256){
        return donatedFunds;
    }
    // function cancelWager() public onlyOwner {

    // }
}
