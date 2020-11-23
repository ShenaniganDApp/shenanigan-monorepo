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

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "../IChallengeRegistry.sol";
import "../IChallenges.sol";
import "../IChallengeToken.sol";
import "../SignatureChecker.sol";
import "../libraries/LibDiamond.sol";

/**
 * Deployed by an athlete
 * A user can make a challenge for themself by calling createChallenge()
 * Users can then add donations to this contract by calling donate()
 * Challenges can be resolved by calling resolveChallenge() from
 * the Shenanigan DAO Agent.
 */
contract ChallengesFacet is BaseRelayRecipient {
    // constructor() public {
    //     setCheckSignatureFlag(true);
    // }

    using SafeERC20 for ERC20;
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    //Shenanigan DAO Address
    address
        private constant SHENANIGAN_ADDRESS = 0x68C5ae32f00c2B884d867f9eA70a4E4B6D04E0F6;

    string
        private constant ERROR_ETH_VALUE_MISMATCH = "TOKEN_REQUEST_ETH_VALUE_MISMATCH";
    string
        private constant ERROR_ETH_TRANSFER_FAILED = "TOKEN_REQUEST_ETH_TRANSFER_FAILED";


    // Storage
    bytes32 internal constant CHALLENGE_STORAGE_SLOT = keccak256('shenanigan.challenge.storage');

    struct ChallengeStorage {
        address challengeRegistry;
        Counters.Counter totalChallenges;
        mapping(uint256 => string) challengeStats;
        mapping(address => mapping(address => uint256)) donations; //Donator address => Donation token => donation amount
        mapping(address => uint256) donationTotals;
        mapping(string => uint256) challengeIdByChallengeUrl;
        mapping(uint256 => Challenge) _challengeById;
    }

    function challengeStorage() internal pure returns (ChallengeStorage storage cs) {
        bytes32 slot = CHALLENGE_STORAGE_SLOT;
        assembly { cs_slot := slot }
    }

    modifier onlyShenanigan {
        require(
            _msgSender() == SHENANIGAN_ADDRESS,
            "Only Shenanigan address can update this value."
        );
        _;
    }

    function setChallengeRegistry(address _address) public onlyShenanigan {
        ChallengeStorage storage cs = challengeStorage();
        cs.challengeRegistry = _address;
    }

    struct Challenge {
        uint256 id;
        address payable athlete;
        string jsonUrl;
        string challengeUrl;
        uint256 teamCount;
        uint256 donatedFunds;
        bytes signature;
        Status status;
        Counters.Counter teamNonce;
    }

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
    event ChallengeResolved(uint256 id, Status status);

    enum Status {Open, Closed, Refund, Failed, Succeed}

    function challengeToken() private view returns (IChallengeToken) {
      ChallengeStorage storage cs = challengeStorage();
      return IChallengeToken(IChallengeRegistry(cs.challengeRegistry).challengeTokenAddress());
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
        address payable _athlete
    ) internal returns (uint256) {
        ChallengeStorage storage cs = challengeStorage();
        cs.totalChallenges.increment();
        uint256 _challengeId = cs.totalChallenges.current();
        if (_challengeId > 1) {
            require(
                !(cs._challengeById[_challengeId - 1].status == Status.Open) &&
                    !(cs._challengeById[_challengeId - 1].status == Status.Closed),
                "Previous challenge has not been fulfilled"
            );
        }
        Challenge storage _challenge = cs._challengeById[_challengeId];

        _challenge.id = _challengeId;
        _challenge.athlete = _athlete;
        _challenge.challengeUrl = _challengeUrl;
        _challenge.jsonUrl = _jsonUrl;
        _challenge.teamCount = _teamCount;
        _challenge.status = Status.Open;

        cs.challengeIdByChallengeUrl[_challengeUrl] = _challengeId;

        emit CreateChallenge(
            _challenge.id,
            _challenge.athlete,
            _challenge.challengeUrl,
            _challenge.jsonUrl,
            _challenge.teamCount
        );

        return _challenge.id;
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
        uint256 _teamCount
    ) public returns (uint256) {
        LibDiamond.enforceIsContractOwner();
        ChallengeStorage storage cs = challengeStorage();
        require(
            !(cs.challengeIdByChallengeUrl[_challengeUrl] > 0),
            "this challenge already exists!"
        );
        require(_teamCount > 0, "Challenge hust have at least two teams");

        uint256 challengeId = _createChallenge(
            _challengeUrl,
            _jsonUrl,
            _teamCount,
            _msgSender()
        );

        return challengeId;
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
        ChallengeStorage storage cs = challengeStorage();
        require(_donationAmount > 0);
        uint256 _challengeId = cs.challengeIdByChallengeUrl[_challengeUrl];
        require(_challengeId > 0, "this challenge does not exist!");
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
            _challengeId,
            _challengeUrl,
            _donator,
            _donationAmount,
            _depositToken
        );
        return _challengeId;
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
        ChallengeStorage storage cs = challengeStorage();
        uint256 _challengeId = cs.challengeIdByChallengeUrl[_challengeUrl];
        Challenge storage _challenge = cs._challengeById[_challengeId];
        require(
            _challenge.status == Status.Refund,
            "Cannot withdraw donations unless refund is allowed"
        );
        address payable _donator = _msgSender();

        for (uint256 i = 0; i < _tokenAddresses.length; i++) {
            uint256 donationAmount = cs.donations[_donator][_tokenAddresses[i]];
            require(donationAmount > 0, "One of the tokens has 0 amount");
            if (_tokenAddresses[i] == address(0)) {
                _donator.transfer(donationAmount);
            } else {
                ERC20(_tokenAddresses[i]).safeTransferFrom(
                    address(this),
                    _donator,
                    donationAmount
                );
            }
            emit Withdraw(
                _challengeId,
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
        ChallengeStorage storage cs = challengeStorage();
        uint256 _challengeId = cs.challengeIdByChallengeUrl[_challengeUrl];
        Challenge storage _challenge = cs._challengeById[_challengeId];
        address payable athlete = _challenge.athlete;
        require(
            _challenge.status == Status.Succeed,
            "Only succeeded challenges can be withdrawn from"
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
                _challengeId,
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
    function resolveChallenge(string memory _challengeUrl, uint256 _resolution)
        public
        onlyShenanigan
    {
        require(_msgSender() == SHENANIGAN_ADDRESS);
        ChallengeStorage storage cs = challengeStorage();
        uint256 _challengeId = cs.challengeIdByChallengeUrl[_challengeUrl];
        Challenge storage _challenge = cs._challengeById[_challengeId];
        if (_resolution == 1) {
            _challenge.status == Status.Succeed;
        } else if (_resolution == 2) {
            _challenge.status == Status.Failed;
        } else {
            _challenge.status == Status.Refund;
        }

        if (_challenge.status != Status.Refund) {
            challengeToken().firstMint(_challenge.athlete, _challenge.challengeUrl, _challenge.jsonUrl);
        }

        emit ChallengeResolved(_challengeId, _challenge.status);
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
    // function _msgSender()
    //     internal
    //     override(BaseRelayRecipient)
    //     view
    //     returns (address payable)
    // {
    //     return BaseRelayRecipient._msgSender();
    // }
}
