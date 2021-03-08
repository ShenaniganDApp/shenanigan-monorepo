// SPDX-License-Identifier: MIT


pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "../utils/Counters.sol";
import "../utils/SafeMath.sol";
import "../utils/EnumerableSet.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "../libraries/ERC20.sol";
import "../utils/SafeERC20.sol";
import "../libraries/Ownable.sol";
import "../IChallengeRegistry.sol";
import "../interfaces/IChallengeDiamond.sol";
import "../interfaces/IChallengeToken.sol";
import "../SignatureChecker.sol";
import "../libraries/LibDiamond.sol";
import "../libraries/ChallengeStorage.sol";
import "../libraries/LibERC1155Base.sol";

/**
 * Deployed by an athlete
 * A user can make a challenge for themself by calling createChallenge()
 * Users can then add donations to this contract by calling donate()
 * Challenges can be resolved by calling resolveChallenge() from
 * the Shenanigan DAO Agent.
 */
contract BaseChallengeFacet is BaseRelayRecipient, Ownable, SignatureChecker {
    constructor() public {
        setCheckSignatureFlag(true);
        setAthleteTake(1);
    }

    using SafeERC20 for ERC20;
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;
    using SafeMath for uint256;

    string
        private constant ERROR_ETH_VALUE_MISMATCH = "TOKEN_REQUEST_ETH_VALUE_MISMATCH";
    string
        private constant ERROR_ETH_TRANSFER_FAILED = "TOKEN_REQUEST_ETH_TRANSFER_FAILED";

    event CreateChallenge(
        uint256 id,
        address athlete,
        string challengeUrl,
        string jsonUrl,
        uint256 teamCount
    );
    event Donate(
        uint256 id,
        string challengeUrl,
        address donator,
        uint256 amount,
        address tokenAddress
    );
    event Withdraw(
        uint256 id,
        string challengeUrl,
        address challenger,
        uint256 amount,
        address tokenAddress
    );
    event newBasePrice(string challengeUrl, uint256 price);

    event ChallengeResolved(uint256 id, Status status);

    ChallengeStorage internal cs;

    modifier onlyShenanigan {
        require(
            _msgSender() == cs.shenaniganAddress,
            "Only Shenanigan address can update this value."
        );
        _;
    }

    function setAthleteTake(uint256 _take) public onlyOwner {
        require(_take < 100, "take is more than 99 percent");
        cs.athleteTake = _take;
    }

    function setChallengeRegistry(address _address) public onlyShenanigan {
        cs.challengeRegistry = _address;
    }

    function challengeToken() private view returns (IChallengeToken) {
        return
            IChallengeToken(
                IChallengeRegistry(cs.challengeRegistry).challengeTokenAddress()
            );
    }

    /**
     * @notice Create a challenge
     * @param _challengeUrl IPFS URL with the challenge livestream video
     * @param _jsonUrl IPFS URL with the challenge JSON data
     * @param _teamCount Total number of unique options for the challenge
     * @param _athlete address of challenger
     */
    function _createChallenge(
        string memory _challengeUrl,
        string memory _jsonUrl,
        uint256 _teamCount,
        uint256 _limit,
        address payable _athlete
    ) internal returns (uint256) {
        cs.totalChallenges.increment();
        uint256 _baseId = cs.totalChallenges.current();
        if (_baseId > 1) {
            for (uint256 i = 0; i < cs.totalChallenges.current(); i++) {
                //@TODO STATUS is confusing OPEN, CLOSED are about donations, the rest are about results
                require(
                    !(cs._baseByBaseId[_baseId - i].status == Status.Open) &&
                        !(cs._baseByBaseId[_baseId - i].status ==
                            Status.Closed),
                    "Previous challenge has not been fulfilled"
                );
            }
        }
        BaseChallenge memory base = cs._baseByBaseId[_baseId];

        base.id = _baseId;
        base.athlete = _athlete;
        base.challengeUrl = _challengeUrl;
        base.jsonUrl = _jsonUrl;
        base.teamCount = _teamCount;
        base.limit = _limit;
        base.status = Status.Open;

        cs.baseIdByChallengeUrl[_challengeUrl] = _baseId;

        emit CreateChallenge(
            base.id,
            base.athlete,
            base.challengeUrl,
            base.jsonUrl,
            base.teamCount
        );

        return base.id;
    }

    /**
     * @notice Public createChallenge function
     * @param _challengeUrl IPFS URL with the challenge Livestream video
     * @param _jsonUrl IPFS URL with the challenge JSON data
     * @param _teamCount Total number of unique options for the challenge
     */
    function createChallenge(
        string memory _challengeUrl,
        string memory _jsonUrl,
        uint256 _teamCount,
        uint256 _limit
    ) public returns (uint256) {
        LibDiamond.enforceIsContractOwner();
        require(
            !(cs.baseIdByChallengeUrl[_challengeUrl] > 0),
            "this challenge already exists!"
        );
        require(_teamCount > 0, "Challenge hust have at least two teams");

        uint256 baseId = _createChallenge(
            _challengeUrl,
            _jsonUrl,
            _teamCount,
            _limit,
            _msgSender()
        );

        return baseId;
    }

    // /**
    //  * @notice Creates a challenge from ENS signature
    //  * @param _challengeUrl IPFS URL with the challenge Livestream video
    //  * @param _jsonUrl IPFS URL with the challenge JSON data
    //  * @param _teamCount Total number of unique options for the challenge
    //  * @param _athlete address of challenger
    //  * @param _signature ENS bytecode
    //  */
    // function createChallengeFromSignature(
    //     string memory _challengeUrl,
    //     string memory _jsonUrl,
    //     uint256 _teamCount,
    //     address payable _athlete,
    //     bytes memory _signature
    // ) public returns (uint256) {
    //     require(
    //         !(challengeIdByChallengeUrl[_challengeUrl] > 0),
    //         "this challenge already exists!"
    //     );

    //     require(_athlete != address(0), "Athlete must be specified.");
    //     bytes32 messageHash = keccak256(
    //         abi.encodePacked(
    //             bytes1(0x19),
    //             bytes1(0),
    //             address(this),
    //             _athlete,
    //             _challengeUrl,
    //             _jsonUrl,
    //             _teamCount
    //         )
    //     );
    //     bool isAthleteSignature = checkSignature(
    //         messageHash,
    //         _signature,
    //         _athlete
    //     );
    //     require(
    //         isAthleteSignature || !checkSignatureFlag,
    //         "Athlete did not sign this challenge"
    //     );

    //     uint256 challengeId = _createChallenge(
    //         _challengeUrl,
    //         _jsonUrl,
    //         _teamCount,
    //         _athlete
    //     );

    //     _challengeById[challengeId].signature = _signature;

    //     return challengeId;
    // }

    function _setPrice(uint256 _baseId, uint256 _price)
        private
        returns (uint256)
    {
        cs._baseByBaseId[_baseId].basePrice = _price;
        cs._baseByBaseId[_baseId].basePriceNonce.increment();
        emit newBasePrice(cs._baseByBaseId[_baseId].challengeUrl, _price);
        return _price;
    }

    function setPrice(
        string memory challengeUrl,
        uint256 price
    ) public returns (uint256) {
        uint256 _baseId = cs.baseIdByChallengeUrl[challengeUrl];
        require(_baseId > 0, "this base does not exist!");
        BaseChallenge memory base = cs._baseByBaseId[_baseId];
        require(
            base.athlete == _msgSender(),
            "only the athlete can set the price!"
        );

        return _setPrice(base.id, price);
    }

    function setPriceFromSignature(
        string memory challengeUrl,
        uint256 price,
        bytes memory signature
    ) public returns (uint256) {
        uint256 _baseId = cs.baseIdByChallengeUrl[challengeUrl];
        require(_baseId > 0, "this base does not exist!");
        BaseChallenge storage base = cs._baseByBaseId[_baseId];
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                bytes1(0x19),
                bytes1(0),
                address(this),
                challengeUrl,
                price,
                base.basePriceNonce.current()
            )
        );
        bool isArtistSignature = checkSignature(
            messageHash,
            signature,
            base.athlete
        );
        require(
            isArtistSignature || !checkSignatureFlag,
            "Athlete did not sign this price"
        );

        return _setPrice(base.id, price);
    }

    function baseChallengeInfoById(uint256 id)
        public
        view
        returns (BaseChallenge memory)
    {
        require(
            id > 0 && id <= cs.totalChallenges.current(),
            "this base does not exist!"
        );
        BaseChallenge memory base = cs._baseByBaseId[id];

        return base;
    }

    function baseChallengeInfoByChallengeUrl(string memory challengeUrl)
        public
        view
        returns (BaseChallenge memory)
    {
        uint256 _baseId = cs.baseIdByChallengeUrl[challengeUrl];

        return baseChallengeInfoById(_baseId);
    }

    /**
     * @notice Users can donate to a challenge
     * @param _challengeUrl IPFS URL of the challenge livestream
     * @param _donationAmount Amount to donate
     * @param _depositToken Token Address being donated
     */
    function donate(
        string memory _challengeUrl,
        uint256 _donationAmount,
        address _depositToken
    ) public payable returns (uint256) {
        require(_donationAmount > 0);
        uint256 _baseId = cs.baseIdByChallengeUrl[_challengeUrl];
        require(_baseId > 0, "this base does not exist!");
        address _donator = _msgSender();

        if (_depositToken == address(0)) {
            require(msg.value == _donationAmount, ERROR_ETH_VALUE_MISMATCH);
        } else {
            ERC20(_depositToken).safeTransferFrom(
                _donator,
                address(this),
                _donationAmount
            );
        }

        cs.donations[_donator][_depositToken] += _donationAmount;
        cs.donationTotals[_depositToken] += _donationAmount;

        emit Donate(
            _baseId,
            _challengeUrl,
            _donator,
            _donationAmount,
            _depositToken
        );
        return _baseId;
    }

    /**
     * @notice User can retrieve their donation if the Challenge is deemed malicious and the Refund status is applied
     * @param _challengeUrl IPFS URL of the challenge livestream
     * @param _tokenAddresses Addresses of tokens being withdrawn
     */
    function withdrawDonation(
        string memory _challengeUrl,
        address[] memory _tokenAddresses
    ) public {
        uint256 _baseId = cs.baseIdByChallengeUrl[_challengeUrl];
        BaseChallenge memory base = cs._baseByBaseId[_baseId];
        require(
            base.status == Status.Refund,
            "Cannot withdraw donations unless refund is allowed"
        );
        address payable _donator = _msgSender();

        for (uint256 i = 0; i < _tokenAddresses.length; i++) {
            uint256 donationAmount = cs.donations[_donator][_tokenAddresses[i]];
            require(donationAmount > 0, "One of the tokens has 0 amount");
            if (_tokenAddresses[i] == address(0)) {
                _donator(donationAmount);
            } else {
                ERC20(_tokenAddresses[i]).safeTransferFrom(
                    address(this),
                    _donator,
                    donationAmount
                );
            }
            emit Withdraw(
                _baseId,
                _challengeUrl,
                _donator,
                donationAmount,
                _tokenAddresses[i]
            );
        }
    }

    /**
     * @notice Challenger can retrieve donations when challenge returns successful and the Succeed status is applied
     * @param _challengeUrl IPFS URL of the challenge livestream
     * @param _tokenAddresses Addresses of tokens being withdrawn
     */
    function withdrawBalance(
        string memory _challengeUrl,
        address[] memory _tokenAddresses
    ) public {
        LibDiamond.enforceIsContractOwner();
        uint256 _baseId = cs.baseIdByChallengeUrl[_challengeUrl];
        BaseChallenge memory base = cs._baseByBaseId[_baseId];
        address payable athlete = base.athlete;
        require(
            base.status == Status.Succeed,
            "Only succeeded bases can be withdrawn from"
        );
        for (uint256 i = 0; i < _tokenAddresses.length; i++) {
            uint256 donationAmount = cs.donationTotals[_tokenAddresses[i]];
            require(donationAmount > 0, "One of the tokens has 0 amount");
            if (_tokenAddresses[i] == address(0)) {
                athlete.transfer(donationAmount);
            } else {
                ERC20(_tokenAddresses[i]).safeTransferFrom(
                    address(this),
                    athlete,
                    donationAmount
                );
            }
            emit Withdraw(
                _baseId,
                _challengeUrl,
                athlete,
                donationAmount,
                _tokenAddresses[i]
            );
        }
    }

    /**
     * @notice The Shenanigan DAO Agent can call this function to finalize challenge results
     * @param _challengeUrl IPFS URL of the challenge livestream
     * @param _resolution integer representation of resolution results (1) Succeed, (2) Fail, (3) Refund
     */
    function resolveChallenge(
        string memory _challengeUrl,
        uint256 _resolution,
        uint256 amount
    ) public onlyShenanigan {
        require(_msgSender() == cs.shenaniganAddress);

        uint256 _baseId = cs.baseIdByChallengeUrl[_challengeUrl];
        BaseChallenge memory base = cs._baseByBaseId[_baseId];
        require(amount < base.limit, "Amount is larger than limit");
        if (_resolution == 1) {
            base.status == Status.Succeed;
        } else if (_resolution == 2) {
            base.status == Status.Failed;
        } else {
            base.status == Status.Refund;
        }

        if (base.status != Status.Refund) {
            challengeToken().firstMint(
                base.athlete,
                base.challengeUrl,
                base.jsonUrl,
                ""
            );
        }

        emit ChallengeResolved(_baseId, base.status);
    }

    function versionRecipient()
        external
        virtual
        override
        view
        returns (string memory)
    {
        return "1.0";
    }

    function setTrustedForwarder(address _trustedForwarder)
        public
        onlyShenanigan
    {
        trustedForwarder = _trustedForwarder;
    }

    function getTrustedForwarder() public view returns (address) {
        return trustedForwarder;
    }

    // // Function to retrieve contract caller because msg.sender
    // // is abstracted by GSN
    function _msgSender()
        internal
        override(Context, BaseRelayRecipient)
        view
        returns (address payable)
    {
        return BaseRelayRecipient._msgSender();
    }

    function _msgData()
        internal
        override(Context, BaseRelayRecipient)
        view
        returns (bytes memory)
    {
        return BaseRelayRecipient._msgData();
    }
}
