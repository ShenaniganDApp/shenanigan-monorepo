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

contract Election {

    struct Candidate {
        bool doesExist;
        uint256 total;
        address wagerAddress;
    }
    
    mapping(address => Candidate) candidates;

    function addCandidate(address _wagerAddress) public{
        require(!(candidates[msg.sender].doesExist));
        candidates[msg.sender].doesExist = true;
        candidates[msg.sender].wagerAddress = _wagerAddress
    }
    
    function deleteCandidate() public{
        require(candidates[msg.sender].doesExist);
        candidates[msg.sender].doesExist = false;
    }


}
