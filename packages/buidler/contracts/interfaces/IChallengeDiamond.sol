// SPDX-License-Identifier: MIT


pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import "../libraries/ChallengeStorage.sol";

interface IChallengeDiamond {

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

    function baseChallengeInfoById(uint256)
        external
        view
        returns (BaseChallenge memory );

    function baseChallengeInfoByChallengeUrl(string calldata)
        external
        view
        returns (BaseChallenge memory);

    function setPrice(string calldata, uint256, uint256) external returns (uint256);
    function setPriceFromSignature(
        string calldata,
        uint256 ,
        uint256 ,
        bytes calldata 
    ) external returns (uint256);

    function owner() external view returns (address);

    function athleteTake() external view returns (uint256);


    function challengeTokenCount(string calldata)
        external
        view
        returns (uint256);

    function firstMint(
        address,
        string calldata,
        string calldata
    ) external returns (uint256);

    function mint(address, string calldata) external returns (uint256);

    function lock(uint256) external;

    function unlock(uint256, address) external;

    function ownerOf(uint256) external view returns (address);

    function tokenChallenge(uint256) external view returns (string memory);

    function buyChallenge(string calldata, uint256, uint256, bytes calldata) external payable returns (uint256);

    function buyToken(uint256) external payable;
}
