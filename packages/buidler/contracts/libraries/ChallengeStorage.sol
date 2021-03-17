// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../utils/Counters.sol";
import "../utils/EnumerableSet.sol";

enum Status {Open, Closed, Refund, Failed, Succeed}

struct Challenge {
    uint256 id;
    address payable athlete;
    string jsonUrl;
    string challengeUrl;
    uint256 teamCount;
    uint256 challengePrice;
    Counters.Counter challengePriceNonce;
    uint256 limit;
    Status status;
    uint256 donatedFunds;
}
struct ChallengeToken {
    uint256 id;
    bytes signature;
    uint256 price;
    Counters.Counter priceNonce;
    Challenge challenge;
}

struct ChallengeStorage {
    address shenaniganAddress;
    address challengeRegistry;
    address challengeFacet;
    address challengeTokenFacet;
    address trustedForwarder;
    uint256 athleteTake;
    Counters.Counter totalChallenges;
    mapping(address => EnumerableSet.UintSet) _athleteChallenges;
    mapping(address => mapping(address => uint256)) donations; //Donator address => Donation token => donation amount
    mapping(address => uint256) donationTotals;
    mapping(string => uint256) challengeIdByChallengeUrl;
    mapping(uint256 => Challenge) _challengeById;
    mapping(uint256 => ChallengeToken) _challengeTokenById;
    mapping(string => EnumerableSet.UintSet) _challengeTokens;
    mapping(uint256 => string) tokenChallenge;
    mapping(uint256 => Counters.Counter) _tokenIndexByChallengeId;
}
