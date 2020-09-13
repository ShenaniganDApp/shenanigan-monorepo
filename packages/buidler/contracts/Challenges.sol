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
import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "./IChallengeRegistry.sol";
import "./IChallenges.sol";
import "./SignatureChecker.sol";

contract Challenges is BaseRelayRecipient, Ownable, SignatureChecker {
    constructor() public {
        setCheckSignatureFlag(true);
    }

    using SafeERC20 for ERC20;
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    address
        private constant SHENANIGAN_ADDRESS = 0x68C5ae32f00c2B884d867f9eA70a4E4B6D04E0F6;

    string
        private constant ERROR_ETH_VALUE_MISMATCH = "TOKEN_REQUEST_ETH_VALUE_MISMATCH";
    string
        private constant ERROR_ETH_TRANSFER_FAILED = "TOKEN_REQUEST_ETH_TRANSFER_FAILED";

    address public challengeRegistry;
    Counters.Counter public totalChallenges;
    mapping(uint256 => string) public challengeStats;
    mapping(address => mapping(address => uint256)) public donations; //Donator address => Donation token => donation amount
    mapping(address => uint256) public donationTotals;
    mapping(string => uint256) public challengeIdByChallengeUrl;
    mapping(uint256 => Challenge) private _challengeById;

    modifier onlyShenanigan {
        require(
            _msgSender() == SHENANIGAN_ADDRESS,
            "Only Shenanigan address can update this value."
        );
        _;
    }

    function setChallengeRegistry(address _address) public onlyShenanigan {
        challengeRegistry = _address;
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

    function _createChallenge(
        string memory challengeUrl,
        string memory jsonUrl,
        uint256 teamCount,
        address payable athlete
    ) internal returns (uint256) {
        totalChallenges.increment();
        uint256 _challengeId = totalChallenges.current();
        //console.log to make sure it starts at 1
        if (_challengeId > 1) {
            require(
                !(_challengeById[_challengeId - 1].status == Status.Open) &&
                    !(_challengeById[_challengeId - 1].status == Status.Closed),
                "Previous challenge has not been fulfilled"
            );
        }
        Challenge storage _challenge = _challengeById[_challengeId];

        _challenge.id = _challengeId;
        _challenge.athlete = athlete;
        _challenge.challengeUrl = challengeUrl;
        _challenge.jsonUrl = jsonUrl;
        _challenge.teamCount = teamCount;
        _challenge.status = Status.Open;

        challengeIdByChallengeUrl[challengeUrl] = _challengeId;

        emit CreateChallenge(
            _challenge.id,
            _challenge.athlete,
            _challenge.challengeUrl,
            _challenge.jsonUrl,
            _challenge.teamCount
        );

        return _challenge.id;
    }

    function createChallenge(
        string memory _challengerUrl,
        string memory _jsonUrl,
        uint256 _teamCount
    ) public onlyOwner returns (uint256) {
        require(
            !(challengeIdByChallengeUrl[_challengerUrl] > 0),
            "this challenge already exists!"
        );
        require(_teamCount > 0, "Challenge hust have at least two teams");

        uint256 challengeId = _createChallenge(
            _challengerUrl,
            _jsonUrl,
            _teamCount,
            _msgSender()
        );

        return challengeId;
    }

    function createChallengeFromSignature(
        string memory challengeUrl,
        string memory jsonUrl,
        uint256 teamCount,
        address payable athlete,
        bytes memory signature
    ) public returns (uint256) {
        require(
            !(challengeIdByChallengeUrl[challengeUrl] > 0),
            "this challenge already exists!"
        );

        require(athlete != address(0), "Athlete must be specified.");
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                bytes1(0x19),
                bytes1(0),
                address(this),
                athlete,
                challengeUrl,
                jsonUrl,
                teamCount
            )
        );
        bool isAthleteSignature = checkSignature(
            messageHash,
            signature,
            athlete
        );
        require(
            isAthleteSignature || !checkSignatureFlag,
            "Athlete did not sign this challenge"
        );

        uint256 challengeId = _createChallenge(
            challengeUrl,
            jsonUrl,
            teamCount,
            athlete
        );

        _challengeById[challengeId].signature = signature;

        return challengeId;
    }

    function donate(
        string memory _challengeUrl,
        uint256 _donationAmount,
        address _depositToken
    ) public payable returns (uint256) {
        require(_donationAmount > 0);
        uint256 _challengeId = challengeIdByChallengeUrl[_challengeUrl];
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

        donations[_donator][_depositToken] += _donationAmount;
        donationTotals[_depositToken] += _donationAmount;

        emit Donate(
            _challengeId,
            _challengeUrl,
            _donator,
            _donationAmount,
            _depositToken
        );
        return _challengeId;
    }

    function withdrawDonation(
        string memory _challengeUrl,
        address[] memory tokenAddresses
    ) public {
        uint256 _challengeId = challengeIdByChallengeUrl[_challengeUrl];
        Challenge storage _challenge = _challengeById[_challengeId];
        require(
            _challenge.status == Status.Refund,
            "Cannot withdraw donations unless refund is allowed"
        );
        address payable _donator = _msgSender();

        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            uint256 donationAmount = donations[_donator][tokenAddresses[i]];
            require(donationAmount > 0, "One of the tokens has 0 amount");
            if (tokenAddresses[i] == address(0)) {
                _donator.transfer(donationAmount);
            } else {
                ERC20(tokenAddresses[i]).safeTransferFrom(
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
                tokenAddresses[i]
            );
        }
    }

    function withdrawBalance(
        string memory _challengeUrl,
        address[] memory tokenAddresses
    ) public onlyOwner {
        uint256 _challengeId = challengeIdByChallengeUrl[_challengeUrl];
        Challenge storage _challenge = _challengeById[_challengeId];
        address payable athlete = _challenge.athlete;
        require(
            _challenge.status == Status.Succeed,
            "Only succeeded challenges can be withdrawn from"
        );
        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            uint256 donationAmount = donationTotals[tokenAddresses[i]];
            require(donationAmount > 0, "One of the tokens has 0 amount");
            if (tokenAddresses[i] == address(0)) {
                athlete.transfer(donationAmount);
            } else {
                ERC20(tokenAddresses[i]).safeTransferFrom(
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
                tokenAddresses[i]
            );
        }
    }

    function resolveChallenge(string memory _challengeUrl, uint256 _resolution)
        public
        onlyShenanigan
    {
        require(_msgSender() == SHENANIGAN_ADDRESS);
        uint256 _challengeId = challengeIdByChallengeUrl[_challengeUrl];
        Challenge storage _challenge = _challengeById[_challengeId];
        if (_resolution == 1) {
            _challenge.status == Status.Succeed;
        } else if (_resolution == 2) {
            _challenge.status == Status.Failed;
        } else {
            _challenge.status == Status.Refund;
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

    function _msgSender()
        internal
        override(BaseRelayRecipient, Context)
        view
        returns (address payable)
    {
        return BaseRelayRecipient._msgSender();
    }
}
