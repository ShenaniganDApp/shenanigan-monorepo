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
pragma solidity 0.6.2;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract ChallengeFactory {
    using SafeERC20 for ERC20;

    address
        private constant DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address
        private constant SHENANIGAN_ADDRESS = 0x68C5ae32f00c2B884d867f9eA70a4E4B6D04E0F6;

    string
        private constant ERROR_DONATION_TRANSFER_REVERTED = "ELECTION_DONATION_TRANSFER_REVERTED";
    string
        private constant ERROR_WITHDRAW_TRANSFER_REVERTED = "ELECTION_WITHDRAW_TRANSFER_REVERTED";

    enum Status {Open, Closed, Failed, Finished}

    struct Challenge {
        uint256 challengeId;
        address challenger;
        uint256 teamCount;
        uint256 donatedFunds;
        bytes32[] tags;
        Status status;
    }

    mapping(uint256 => Challenge) public challenges;
    mapping(address => bool) public activeChallenges;
    mapping(uint256 => mapping(address => uint256)) donations;

    uint256 public nextChallengeId;

    event ChallengeCreated(
        address challenger,
        uint256 teamCount,
        bytes32[] tags
    );
    event TeamAdded(address challenger, uint256 newTeam);
    event Donate(
        uint256 challengeId,
        address challenger,
        address donator,
        uint256 amount
    );
    event Withdraw(uint256 challengeId, address challenger, uint256 amount);
    event ChallengeResolved(uint256 challengeId, Status status);

    function createChallenge(
        address _challenger,
        uint256 _teamNums,
        bytes32[] memory _tags
    ) public returns (uint256) {
        require(_teamNums >= 2);
        require(activeChallenges[_challenger] == false);
        uint256 challengeId = nextChallengeId;
        nextChallengeId++;

        challenges[challengeId] = Challenge(
            challengeId,
            _challenger,
            _teamNums,
            0,
            _tags,
            Status.Open
        );
        activeChallenges[_challenger] == true;
        emit ChallengeCreated(_challenger, _teamNums, _tags);
        return challengeId;
    }

    function addTeam(uint256 challengeId, uint256 _teamNum) public {
        require(_teamNum == challenges[challengeId].teamCount + 1);
        require(challenges[challengeId].challenger == msg.sender);
        challenges[challengeId].teamCount += 1;
        emit TeamAdded(msg.sender, _teamNum);
    }

    /// @notice Adds funds to a _challenger donation balance
    /// @dev
    /// @param _challengeId Unique ID of the challenge
    /// @param _challenger Address of the _challenger receiving the balance
    /// @param _donationAmount Amount donated in DAI
    function donate(
        uint256 _challengeId,
        address _challenger,
        uint256 _donationAmount
    ) public {
        require(_donationAmount > 0);
        require(challenges[_challengeId].challenger == _challenger);
        ERC20(DAI_ADDRESS).safeTransferFrom(
            msg.sender,
            address(this),
            _donationAmount
        );
        challenges[_challengeId].donatedFunds += _donationAmount;
        donations[_challengeId][msg.sender] += _donationAmount;
        emit Donate(
            _challengeId,
            challenges[_challengeId].challenger,
            msg.sender,
            _donationAmount
        );
    }

    function withdrawDonation(uint256 _challengeId) public {
        require(challenges[_challengeId].status == Status.Failed);
        require(donations[_challengeId][msg.sender] > 0);
        uint256 donatedFunds = donations[_challengeId][msg.sender];
        ERC20(DAI_ADDRESS).safeTransferFrom(
            address(this),
            msg.sender,
            donatedFunds
        );
        emit Withdraw(_challengeId, msg.sender, donatedFunds);
    }

    function withdrawBalance(uint256 _challengeId) public {
        require(challenges[_challengeId].challenger == msg.sender);
        require(challenges[_challengeId].status == Status.Finished);
        require(challenges[_challengeId].donatedFunds > 0);
        uint256 donatedFunds = challenges[_challengeId].donatedFunds;
        ERC20(DAI_ADDRESS).safeTransferFrom(
            address(this),
            msg.sender,
            donatedFunds
        );
        emit Withdraw(_challengeId, msg.sender, donatedFunds);
    }

    function resolveChallenge(uint256 _challengeId, bool _resolution) public {
        require(msg.sender == SHENANIGAN_ADDRESS);
        if (_resolution) {
            challenges[_challengeId].status == Status.Finished;
        } else {
            challenges[_challengeId].status == Status.Failed;
        }
        emit ChallengeResolved(_challengeId, challenges[_challengeId].status);
    }
}
