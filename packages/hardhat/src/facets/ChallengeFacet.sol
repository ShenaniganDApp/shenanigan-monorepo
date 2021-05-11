// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../utils/Counters.sol";
import "../utils/SafeMath.sol";
import "../utils/EnumerableSet.sol";
import "../interfaces/IERC20.sol";
import "../utils/SafeERC20.sol";
import "../interfaces/IChallengeDiamond.sol";
import "../interfaces/IChallengeToken.sol";
import "../libraries/LibDiamond.sol";
import {ChallengeStorage} from "../libraries/LibChallengeStorage.sol";
import {LibBaseRelayRecipient} from "../libraries/LibBaseRelayRecipient.sol";
import {LibSignatureChecker} from "../libraries/LibSignatureChecker.sol";
import {ChallengeTokenFacet} from "./ChallengeTokenFacet.sol";
import "../libraries/ERC1155BaseStorage.sol";

/**
 * Deployed by an athlete
 * A user can make a challenge for themself by calling createChallenge()
 * Users can then add donations to this contract by calling donate()
 * Challenges can be resolved by calling resolveChallenge() from
 * the Shenanigan DAO Agent.
 */

contract ChallengeFacet {
    ChallengeStorage internal cs;

    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;
    using SafeMath for uint256;

    //@TODO Move constants to storage
    string private constant ERROR_ETH_VALUE_MISMATCH =
        "TOKEN_REQUEST_ETH_VALUE_MISMATCH";
    string private constant ERROR_ETH_TRANSFER_FAILED =
        "TOKEN_REQUEST_ETH_TRANSFER_FAILED";

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
    event newChallengePrice(string challengeUrl, uint256 price);

    event ChallengeResolved(uint256 id, Status status);

    modifier onlyShenanigan {
        require(
            LibBaseRelayRecipient._msgSender() == cs.dao,
            "Only Shenanigan address can update this value."
        );
        _;
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
    ) internal returns (uint256 id_) {
        cs.totalChallenges.increment();
        id_ = cs.totalChallenges.current();
        if (id_ > 1) {
            for (uint256 i = 0; i < cs.totalChallenges.current(); i++) {
                //@TODO STATUS is confusing OPEN, CLOSED are about donations, the other statuses are about results
                require(
                    !(cs._challengeById[id_ - i].status == Status.Open) &&
                        !(cs._challengeById[id_ - i].status == Status.Closed),
                    "Previous challenge has not been fulfilled"
                );
            }
        }
        Challenge memory challenge = cs._challengeById[id_];

        challenge.id = id_;
        challenge.athlete = _athlete;
        challenge.challengeUrl = _challengeUrl;
        challenge.jsonUrl = _jsonUrl;
        challenge.teamCount = _teamCount;
        challenge.limit = _limit;
        challenge.status = Status.Open;

        cs.challengeIdByChallengeUrl[_challengeUrl] = id_;

        emit CreateChallenge(
            challenge.id,
            challenge.athlete,
            challenge.challengeUrl,
            challenge.jsonUrl,
            challenge.teamCount
        );
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
    ) public returns (uint256 id_) {
        LibDiamond.enforceIsContractOwner();
        require(
            !(cs.challengeIdByChallengeUrl[_challengeUrl] > 0),
            "this challenge already exists!"
        );
        require(_teamCount > 1, "Challenge must have at least two teams");
        require(_limit > 0, "Challenge must mint at least one Challenge Token");

        id_ = _createChallenge(
            _challengeUrl,
            _jsonUrl,
            _teamCount,
            _limit,
            LibBaseRelayRecipient._msgSender()
        );
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

    function _setPrice(uint256 _id, uint256 _price) private returns (uint256) {
        cs._challengeById[_id].challengePrice = _price;
        cs._challengeById[_id].challengePriceNonce.increment();
        emit newChallengePrice(cs._challengeById[_id].challengeUrl, _price);
        return _price;
    }

    function setPrice(string memory challengeUrl, uint256 price)
        public
        returns (uint256)
    {
        uint256 _id = cs.challengeIdByChallengeUrl[challengeUrl];
        require(_id > 0, "this challenge does not exist!");
        Challenge memory challenge = cs._challengeById[_id];
        //@TODO use OwnershipFacet LibDiamond.enforceContractOwner
        require(
            challenge.athlete == LibBaseRelayRecipient._msgSender(),
            "only the athlete can set the price!"
        );

        return _setPrice(challenge.id, price);
    }

    function setPriceFromSignature(
        string memory challengeUrl,
        uint256 price,
        bytes memory signature
    ) public returns (uint256) {
        uint256 _id = cs.challengeIdByChallengeUrl[challengeUrl];
        require(_id > 0, "this challenge does not exist!");
        Challenge storage challenge = cs._challengeById[_id];
        bytes32 messageHash =
            keccak256(
                abi.encodePacked(
                    bytes1(0x19),
                    bytes1(0),
                    address(this),
                    challengeUrl,
                    price,
                    challenge.challengePriceNonce.current()
                )
            );
            //@TODO Athlete not artist
        bool isArtistSignature =
            LibSignatureChecker.checkSignature(messageHash, signature, challenge.athlete);
        require(
            isArtistSignature || !cs.checkSignatureFlag,
            "Athlete did not sign this price"
        );

        return _setPrice(challenge.id, price);
    }

    function challengeInfoById(uint256 id)
        public
        view
        returns (Challenge memory challenge_)
    {
        require(
            id > 0 && id <= cs.totalChallenges.current(),
            "this challenge does not exist!"
        );
        challenge_ = cs._challengeById[id];
    }

    function challengeInfoByChallengeUrl(string memory challengeUrl)
        public
        view
        returns (Challenge memory)
    {
        uint256 _id = cs.challengeIdByChallengeUrl[challengeUrl];

        return challengeInfoById(_id);
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
        uint256 _id = cs.challengeIdByChallengeUrl[_challengeUrl];
        require(_id > 0, "this chalenge does not exist!");
        address _donator = LibBaseRelayRecipient._msgSender();

        if (_depositToken == address(0)) {
            require(msg.value == _donationAmount, ERROR_ETH_VALUE_MISMATCH);
        } else {
            IERC20(_depositToken).safeTransferFrom(
                _donator,
                address(this),
                _donationAmount
            );
        }

        cs.donations[_donator][_depositToken] += _donationAmount;
        cs.donationTotals[_depositToken] += _donationAmount;

        emit Donate(
            _id,
            _challengeUrl,
            _donator,
            _donationAmount,
            _depositToken
        );
        return _id;
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
        uint256 _id = cs.challengeIdByChallengeUrl[_challengeUrl];
        Challenge memory challenge = cs._challengeById[_id];
        require(
            challenge.status == Status.Refund,
            "Cannot withdraw donations unless refund is allowed"
        );
        address payable _donator = LibBaseRelayRecipient._msgSender();

        for (uint256 i = 0; i < _tokenAddresses.length; i++) {
            uint256 donationAmount = cs.donations[_donator][_tokenAddresses[i]];
            require(donationAmount > 0, "One of the tokens has 0 amount");
            if (_tokenAddresses[i] == address(0)) {
                _donator.transfer(donationAmount);
            } else {
                IERC20(_tokenAddresses[i]).safeTransferFrom(
                    address(this),
                    _donator,
                    donationAmount
                );
            }
            emit Withdraw(
                _id,
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
        uint256 _id = cs.challengeIdByChallengeUrl[_challengeUrl];
        Challenge memory challenge = cs._challengeById[_id];
        address payable athlete = challenge.athlete;
        require(
            challenge.status == Status.Succeed,
            "Only succeeded challenges can be withdrawn from"
        );
        for (uint256 i = 0; i < _tokenAddresses.length; i++) {
            uint256 donationAmount = cs.donationTotals[_tokenAddresses[i]];
            require(donationAmount > 0, "One of the tokens has 0 amount");
            if (_tokenAddresses[i] == address(0)) {
                athlete.transfer(donationAmount);
            } else {
                IERC20(_tokenAddresses[i]).safeTransferFrom(
                    address(this),
                    athlete,
                    donationAmount
                );
            }
            emit Withdraw(
                _id,
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
        require(LibBaseRelayRecipient._msgSender() == cs.dao);

        uint256 _id = cs.challengeIdByChallengeUrl[_challengeUrl];
        Challenge memory challenge = cs._challengeById[_id];
        require(amount < challenge.limit, "Amount is larger than limit");
        if (_resolution == 1) {
            challenge.status == Status.Succeed;
        } else if (_resolution == 2) {
            challenge.status == Status.Failed;
        } else {
            challenge.status == Status.Refund;
        }

        if (challenge.status != Status.Refund) {
            ChallengeTokenFacet(address(this)).firstMint(
                challenge.athlete,
                challenge.challengeUrl,
                challenge.jsonUrl,
                ""
            );
        }

        emit ChallengeResolved(_id, challenge.status);
    }


}
