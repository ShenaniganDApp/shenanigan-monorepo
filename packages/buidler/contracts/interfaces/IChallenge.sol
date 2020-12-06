pragma solidity 0.7.5;

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

    function athleteTake() external view returns (uint256);
}
