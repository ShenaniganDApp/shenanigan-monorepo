// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";

enum Status {Open, Closed, Refund, Failed, Succeed}

struct Challenge {
    uint256 id;
    address payable athlete;
    string jsonUrl;
    string challengeUrl;
    uint256 teamCount;
    uint256 donatedFunds;
    bytes signature;
    uint256 price;
    uint256 limit;
    Status status;
    Counters.Counter priceNonce;
}

struct ChallengeStorage {
    address challengeRegistry;
    uint256 athleteTake;
    Counters.Counter totalChallenges;
    mapping(uint256 => string) challengeStats;
    mapping(address => mapping(address => uint256)) donations; //Donator address => Donation token => donation amount
    mapping(address => uint256) donationTotals;
    mapping(string => uint256) challengeIdByChallengeUrl;
    mapping(uint256 => Challenge) _challengeById;
    mapping(address => EnumerableSet.UintSet) _athleteChallenges;
    mapping(uint256 => uint256) tokenPrice;
    mapping(string => EnumerableSet.UintSet) _challengeTokens;
    mapping(uint256 => string) tokenChallenge;
}
