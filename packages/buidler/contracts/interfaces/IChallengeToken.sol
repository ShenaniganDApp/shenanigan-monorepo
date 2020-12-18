pragma solidity ^0.7.5;

interface IChallengeToken {
    function challengeTokenCount(string calldata)
        external
        view
        returns (uint256);

    function firstMint(
        address,
        string calldata,
        string calldata,
        string calldata
    ) external returns (uint256);

    function mint(address, string calldata) external returns (uint256);

    function lock(uint256) external;

    function unlock(uint256, address) external;

    function ownerOf(uint256) external view returns (address);

    function tokenChallenge(uint256) external view returns (string memory);

    function buyChallenge(string calldata) external payable returns (uint256);

    function buyToken(uint256) external payable;
}
