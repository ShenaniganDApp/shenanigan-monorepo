// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { Counters } from  "../../shared/utils/Counters.sol";
import { EnumerableSet } from  "../../shared/utils/EnumerableSet.sol";
import { SafeERC20 } from  "../../shared/utils/SafeERC20.sol";
import { IChallengeDiamond } from  "../interfaces/IChallengeDiamond.sol";
import { IChallengeToken } from  "../interfaces/IChallengeToken.sol";
import { IERC20 } from  "../../shared/interfaces/IERC20.sol";
import { ERC1155BaseStorage } from  "../../shared/utils/ERC1155BaseStorage.sol";
import { LibDiamond } from  "../../shared/libraries/LibDiamond.sol";
import { 
    ChallengeStorage,
    State,
    Challenge,
    Result
} from "../libraries/LibChallengeStorage.sol";
import { LibBaseRelayRecipient } from "../libraries/LibBaseRelayRecipient.sol";
import { LibSignatureChecker } from "../libraries/LibSignatureChecker.sol";
import { ChallengeTokenFacet } from "./ChallengeTokenFacet.sol";
import { Modifiers } from "../libraries/LibChallengeStorage.sol";

/**
 * Deployed by an athlete
 * A user can make a challenge for themself by calling createChallenge()
 * Users can then add donations to this contract by calling donate()
 * Challenges can be resolved by calling resolveChallenge() from
 * the Shenanigan DAO Agent.
 */

contract ChallengeFacet is Modifiers {
    ChallengeStorage internal cs;

    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

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
        uint256 limit,
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

    event ChallengeResolved(uint256 id, State state);

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
        require(
            !cs.hasActiveChallenge,
            "Previous challenge has not been fulfilled"
        );

        Challenge storage challenge = cs._challengeById[id_];

        challenge.id = id_;
        challenge.athlete = _athlete;
        challenge.challengeUrl = _challengeUrl;
        challenge.jsonUrl = _jsonUrl;
        challenge.teamCount = _teamCount;
        challenge.limit = _limit;
        challenge.state = State.Active;
        challenge.result = Result.Unknown;

        cs.challengeIdByChallengeUrl[_challengeUrl] = id_;
        cs.hasActiveChallenge = true;

        emit CreateChallenge(
            challenge.id,
            challenge.athlete,
            challenge.challengeUrl,
            challenge.jsonUrl,
            challenge.limit,
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
    ) public onlyOwner returns (uint256 id_) {
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

    /**
     * @notice Creates a challenge from ENS signature
     * @param _challengeUrl IPFS URL with the challenge Livestream video
     * @param _jsonUrl IPFS URL with the challenge JSON data
     * @param _teamCount Total number of unique options for the challenge
     * @param _athlete address of challenger
     * @param _signature ENS bytecode
     */
    function createChallengeFromSignature(
        string memory _challengeUrl,
        string memory _jsonUrl,
        uint256 _teamCount,
        address payable _athlete,
        uint256 _limit,
        bytes memory _signature
    ) public onlyOwner returns (uint256) {
        require(
            !(cs.challengeIdByChallengeUrl[_challengeUrl] > 0),
            "this challenge already exists!"
        );

        require(_athlete != address(0), "Athlete must be specified.");
        bytes32 messageHash =
            keccak256(
                abi.encodePacked(
                    bytes1(0x19),
                    bytes1(0),
                    address(this),
                    _athlete,
                    _challengeUrl,
                    _jsonUrl,
                    _teamCount
                )
            );
        bool isAthleteSignature =
            LibSignatureChecker.checkSignature(
                messageHash,
                _signature,
                _athlete
            );
        require(
            isAthleteSignature || !cs.checkSignatureFlag,
            "Athlete did not sign this challenge"
        );

        uint256 challengeId =
            _createChallenge(
                _challengeUrl,
                _jsonUrl,
                _teamCount,
                _limit,
                _athlete
            );

        cs._challengeById[challengeId].signature = _signature;

        return challengeId;
    }

    function _setPrice(uint256 _id, uint256 _price) private returns (uint256) {
        cs._challengeById[_id].challengePrice = _price;
        cs._challengeById[_id].challengePriceNonce.increment();
        emit newChallengePrice(cs._challengeById[_id].challengeUrl, _price);
        return _price;
    }

    function setPrice(string memory challengeUrl, uint256 price)
        public
        onlyOwner
        returns (uint256)
    {
        require(
            price > 0,
            "ChallengeFacet: Challenge price cannot be set to 0"
        );
        uint256 _id = cs.challengeIdByChallengeUrl[challengeUrl];
        require(_id > 0, "this challenge does not exist!");
        Challenge memory challenge = cs._challengeById[_id];

        return _setPrice(challenge.id, price);
    }

    function setPriceFromSignature(
        string memory challengeUrl,
        uint256 price,
        bytes memory signature
    ) public onlyOwner returns (uint256) {
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
            LibSignatureChecker.checkSignature(
                messageHash,
                signature,
                challenge.athlete
            );
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
     * @notice User can retrieve their donation if the Challenge is deemed malicious and the Refund state is applied
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
            challenge.state == State.Refund,
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
     * @notice Challenger can retrieve donations when challenge returns successful and the Succeed state is applied
     * @param _challengeUrl IPFS URL of the challenge livestream
     * @param _tokenAddresses Addresses of tokens being withdrawn
     */
    function withdrawBalance(
        string memory _challengeUrl,
        address[] memory _tokenAddresses
    ) public onlyOwner {
        uint256 _id = cs.challengeIdByChallengeUrl[_challengeUrl];
        Challenge memory challenge = cs._challengeById[_id];
        address payable athlete = challenge.athlete;
        require(
            challenge.result == Result.Succeed,
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
     * @param _state integer representation of challenge state (0) Active, (1) Closed, (2) Refund
     * @param _result integer representation of challenge result (0) Unknown, (1) Failed, (2) Succeed
     */
    function resolveChallenge(
        string memory _challengeUrl,
        State _state,
        Result _result,
        uint256 _amount
    ) public onlyDao {
        require(cs.hasActiveChallenge, "No Challenge available to resolve");

        uint256 _id = cs.challengeIdByChallengeUrl[_challengeUrl];
        Challenge storage challenge = cs._challengeById[_id];

        require(_amount < challenge.limit, "Amount is larger than limit");

        challenge.state = _state;
        challenge.result = _result;

        if (challenge.state != State.Refund) {
            ChallengeTokenFacet(address(this)).firstMint(
                challenge.athlete,
                challenge.challengeUrl,
                challenge.jsonUrl,
                ""
            );
        }

        cs.hasActiveChallenge = false;
        emit ChallengeResolved(_id, challenge.state);
    }
}
