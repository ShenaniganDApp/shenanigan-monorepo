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

pragma solidity >=0.6.0 <0.7.0;

interface IChallenge {
    function createChallenge(
        string calldata,
        string calldata,
        uint256
    ) external returns (uint256);

    function createChallengeFromSignature(
        string calldata,
        string calldata,
        uint256,
        address payable,
        bytes calldata
    ) external returns (uint256);

    function donate(
        string calldata,
        uint256,
        address
    ) external payable returns (uint256);

    function withdrawDonation(string calldata, address[] calldata) external;

    function withdrawBalance(string calldata, address[] calldata) external;

    function resolveChallenge(string calldata, uint256) external;

    function challengeStats(uint256) external view returns (string memory);

    function challengeInfoById(uint256)
        external
        view
        returns (
            uint256,
            address payable,
            string memory,
            string memory,
            uint256,
            uint256,
            bytes memory
        );

    function challengeInfoByChallengeUrl(string calldata)
        external
        view
        returns (
            uint256,
            address payable,
            string memory,
            string memory,
            uint256,
            uint256,
            bytes memory
        );

    function challengeIdByChallengeUrl(string calldata)
        external
        view
        returns (uint256);

    function owner() external view returns (address);
}
