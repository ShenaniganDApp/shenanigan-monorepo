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

interface IChallengeRegistry {
    function challengeAddress() external view returns (address);
    function challengeTokenAddress() external view returns (address);
    function bridgeMediatorAddress() external view returns (address);
    function trustedForwarder() external view returns (address);
}