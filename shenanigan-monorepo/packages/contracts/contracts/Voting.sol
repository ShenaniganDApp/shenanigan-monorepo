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

contract Voting is Ownable, ShenaniganStorage {

    constructor(uint256 _primaryVote, uint256 _optionCount) public {
        primaryVote = _primaryVote;
        optionCount = _optionCount;
        isOpen = true;
    }

    function addVote(uint256 _option) public {
        require(isOpen == true);
        require(voters[msg.sender].hasVoted == false);
        require(_option <= optionCount);
        voters[msg.sender].option = _option;
        totalVotes[_option] += 1;
    }
    
    function changeVote(uint256 _option) public {
        require(isOpen == true);
        require(voters[msg.sender].hasVoted == true);
        require(_option <= optionCount);
        totalVotes[voters[msg.sender].option] -= 1;
        totalVotes[_option] += 1;
    }

    function closeVote() public onlyOwner {
        isOpen = false;
    }

    function getTotals() public view returns (uint256[] memory){
        return totalVotes;
    }
}