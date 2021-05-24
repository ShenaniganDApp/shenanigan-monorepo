// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../utils/Counters.sol";
import "../utils/EnumerableSet.sol";
import "./LibDiamond.sol";
import "./LibBaseRelayRecipient.sol";

enum State {Active, Closed, Refund}
enum Result {Unknown, Failed, Succeed}

struct Challenge {
    uint256 id;
    address payable athlete;
    string jsonUrl;
    string challengeUrl;
    uint256 teamCount;
    uint256 challengePrice;
    Counters.Counter challengePriceNonce;
    uint256 limit;
    State state;
    Result result;
    bytes signature;
    uint256 donatedFunds;
}

struct ChallengeToken {
    uint256 id;
    uint256 price;
    Counters.Counter priceNonce;
    Challenge challenge;
}

struct ChallengeStorage {
    address dao;
    bool checkSignatureFlag;
    address challengeFacet;
    address challengeTokenFacet;
    address trustedForwarder;
    uint256 athleteTake;
    bool hasActiveChallenge;
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

library LibChallengeStorage {
    function diamondStorage() internal pure returns (ChallengeStorage storage ds) {
        assembly {
            ds.slot := 0
        }
    }

    function setAthleteTake(uint256 _take) internal {
        LibDiamond.enforceIsContractOwner();
        require(_take < 100, "take is more than 99 percent");
        diamondStorage().athleteTake = _take;
    }
}

contract Modifiers {
    ChallengeStorage internal s;

    modifier onlyOwner {
        LibDiamond.enforceIsContractOwner();
        _;
    }

    modifier onlyDao {
        address sender = LibBaseRelayRecipient._msgSender();
        require(sender == s.dao, "Only DAO can call this function");
        _;
    }

    modifier onlyDaoOrOwner {
        address sender = LibBaseRelayRecipient._msgSender();
        require(sender == s.dao || sender == LibDiamond.contractOwner(), "LibChallengeStorage: Do not have access");
        _;
    }
}