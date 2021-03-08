// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
import "../utils/Counters.sol";
import "../utils/EnumerableSet.sol";

enum Status {Open, Closed, Refund, Failed, Succeed}

struct BaseChallenge {
    uint256 id;
    address payable athlete;
    string jsonUrl;
    string challengeUrl;
    uint256 teamCount;
    uint256 basePrice;
    Counters.Counter basePriceNonce;
    uint256 limit;
    Status status;
    uint256 donatedFunds;
}
struct Challenge {
    uint256 id;
    bytes signature;
    uint256 price;
    Counters.Counter priceNonce;
    BaseChallenge baseChallenge;
}

struct ChallengeStorage {
    address shenaniganAddress;
    address challengeRegistry;
    uint256 athleteTake;
    Counters.Counter totalChallenges;
    mapping (address => EnumerableSet.UintSet) _athleteChallenges;
    mapping(address => mapping(address => uint256)) donations; //Donator address => Donation token => donation amount
    mapping(address => uint256) donationTotals;
    mapping(string => uint256) baseIdByChallengeUrl;
    mapping(uint256 => BaseChallenge) _baseByBaseId;
    mapping(uint256 => Challenge) _challengeById;
    mapping(string => EnumerableSet.UintSet) _challengeTokens;
    mapping(uint256 => string) tokenChallenge;
    mapping(uint256 => Counters.Counter) _challengeIndexByType;
}
