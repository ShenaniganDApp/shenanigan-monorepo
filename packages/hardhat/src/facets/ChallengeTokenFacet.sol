// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../libraries/ERC1155Base.sol";
import "../libraries/ERC1155BaseStorage.sol";
import "../libraries/ERC1155Enumerable.sol";
import "../utils/Counters.sol";
import "../utils/SafeMath.sol";
import "../interfaces/IChallengeDiamond.sol";
import "../interfaces/IChallenge.sol";
import {ChallengeStorage} from "../libraries/LibChallengeStorage.sol";
import {LibBaseRelayRecipient} from "../libraries/LibBaseRelayRecipient.sol";
import {LibSignatureChecker} from "../libraries/LibSignatureChecker.sol";
import {ChallengeFacet} from "./ChallengeFacet.sol";
import "../libraries/LibDiamond.sol";

contract ChallengeTokenFacet is
    ERC1155Enumerable
{

    using Counters for Counters.Counter;
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.UintSet;

    event mintedChallenge(
        uint256 id,
        uint256 tokenId,
        string challengeUrl,
        address to,
        uint256 amount
    );

    event boughtChallenges(
        uint256 challengeId,
        string challengeUrl,
        address buyer,
        uint256 price,
        uint256 amount
    );
    event newTokenPrice(uint256 challengeId, uint256 tokenId, uint256 price);

    ChallengeStorage internal cs; 

    function challengeTokenCount(string memory _challengeUrl)
        public
        view
        returns (uint256 challengeTokenCount_)
    {
        challengeTokenCount_ = cs._challengeTokens[_challengeUrl].length();
    }

    function _mintChallengeToken(
        address to,
        uint256 challengeId,
        string memory challengeUrl,
        string memory jsonUrl,
        uint256 amount,
        bytes memory data
    ) internal returns (uint256[] memory tokenIds_) {
        Counters.Counter storage tokenIndex =
            cs._tokenIndexByChallengeId[challengeId];
        Challenge memory challenge =
            ChallengeFacet(address(this)).challengeInfoById(challengeId);
        require(
            amount < challenge.limit - tokenIndex.current(),
            "Cannot mint more than the limit"
        );
        uint256[] memory tokenIds = new uint256[](amount);
        for (uint256 i = 0; i < amount; i++) {
            tokenIndex.increment();
            uint256 id = challengeId + (tokenIndex.current() << 128);
            cs._challengeTokens[challengeUrl].add(id);
            cs.tokenChallenge[id] = challengeUrl;
            Counters.Counter memory priceNonce;
            cs._challengeTokenById[id] = ChallengeToken(
                id,
                "",
                0,
                priceNonce,
                challenge
            );
            tokenIds[i] = id;
            _mint(to, id, 1, data);
            emit URI(jsonUrl, id);
            // emit mintedChallenge(challengeId, tokenId.current(), challengeUrl, to, amount);
        }
        return tokenIds;
    }

    function firstMint(
        address to,
        string calldata challengeUrl,
        string calldata jsonUrl,
        bytes calldata data
    ) external returns (uint256[] memory) {
        require(LibBaseRelayRecipient._msgSender() == cs.challengeFacet);
        uint256 challengeId = cs.totalChallenges.current();
        uint256[] memory tokenIds =
            _mintChallengeToken(
                to,
                challengeId,
                challengeUrl,
                jsonUrl,
                1,
                data
            );
        return tokenIds;
    }

    function mint(
        address to,
        string memory _challengeUrl,
        uint256 amount,
        bytes calldata data
    ) public returns (uint256[] memory) {
        uint256 challengeId = cs.challengeIdByChallengeUrl[_challengeUrl];
        Challenge memory challenge =
            ChallengeFacet(address(this)).challengeInfoById(challengeId);

        require(
            challenge.athlete == LibBaseRelayRecipient._msgSender(),
            "only the athlete can mint!"
        );

        require(
            challengeTokenCount(_challengeUrl) < challenge.limit ||
                challenge.limit == 0,
            "this challenge is over the limit!"
        );

        uint256[] memory tokenIds =
            _mintChallengeToken(
                to,
                challenge.id,
                challenge.challengeUrl,
                challenge.jsonUrl,
                amount,
                data
            );

        return tokenIds;
    }

    function mintFromSignature(
        address to,
        string memory _challengeUrl,
        bytes memory signature,
        uint256 amount,
        bytes calldata data
    ) public returns (uint256[] memory) {
        uint256 challengeId = cs.challengeIdByChallengeUrl[_challengeUrl];
        require(challengeId > 0, "this challenge does not exist!");

        uint256 _count = challengeTokenCount(_challengeUrl);
        Challenge memory challenge =
            ChallengeFacet(address(this)).challengeInfoById(challengeId);
        require(
            _count < challenge.limit || challenge.limit == 0,
            "this challenge is over the limit!"
        );

        bytes32 messageHash =
            keccak256(
                abi.encodePacked(
                    bytes1(0x19),
                    bytes1(0),
                    address(this),
                    to,
                    challenge.challengeUrl,
                    _count
                )
            );
        bool isAthleteSignature =
            LibSignatureChecker.checkSignature(messageHash, signature, challenge.athlete);
        require(
            isAthleteSignature || !cs.checkSignatureFlag,
            "only the athlete can mint!"
        );

        uint256[] memory tokenIds =
            _mintChallengeToken(
                to,
                challenge.id,
                challenge.challengeUrl,
                challenge.jsonUrl,
                amount,
                data
            );

        return tokenIds;
    }

    // Lock and Unlock are used for bridgning to mainnet

    // function lock(
    //     uint256 _tokenId,
    //     uint256 _amount,
    //     bytes calldata _data
    // ) external {
    //     address _bridgeMediatorAddress = cs.bridgeMediatorAddress;
    //     require(
    //         _bridgeMediatorAddress == LibBaseRelayRecipient._msgSender(),
    //         "only the bridgeMediator can lock"
    //     );
    //     require(
    //         ERC1155BaseStorage.layout().nfOwners[_tokenId] == LibBaseRelayRecipient._msgSender(),
    //         "address does not have the required amount"
    //     );
    //     address from = ERC1155BaseStorage.layout().nfOwners[_tokenId];
    //     safeTransferFrom(from, LibBaseRelayRecipient._msgSender(), _tokenId, _amount, _data);
    // }

    // function unlock(
    //     uint256 _tokenId,
    //     address _recipient,
    //     uint256 _amount,
    //     bytes calldata _data
    // ) external {
    //     require(
    //         LibBaseRelayRecipient._msgSender() == cs.bridgeMediatorAddress.bridgeMediatorAddress(),
    //         "only the bridgeMediator can unlock"
    //     );
    //     require(
    //         ERC1155BaseStorage.layout().nfOwners[_tokenId] == LibBaseRelayRecipient._msgSender(),
    //         "address does not have the required amount"
    //     );
    //     safeTransferFrom(LibBaseRelayRecipient._msgSender(), _recipient, _tokenId, _amount, _data);
    // }

    function buyChallenges(
        string memory _challengeUrl,
        uint256 _amount,
        bytes calldata _data
    ) public payable returns (uint256[] memory) {
        uint256 _challengeId = cs.challengeIdByChallengeUrl[_challengeUrl];
        require(_challengeId > 0, "this challenge does not exist!");
        Challenge memory challenge = cs._challengeById[_challengeId];
        require(
            challenge.challengePrice > 0,
            "this challenge does not have a price set"
        );
        uint256 _price = challenge.challengePrice * _amount;
        require(msg.value >= _price, "Amount sent too small");

        require(
            challenge.limit > challengeTokenCount(_challengeUrl) + _amount,
            "this amount requested is over the limit!"
        );
        address _buyer = LibBaseRelayRecipient._msgSender();
        uint256[] memory _tokenIds =
            _mintChallengeToken(
                _buyer,
                challenge.id,
                challenge.challengeUrl,
                challenge.jsonUrl,
                _amount,
                _data
            );
        //Note: a pull mechanism would be safer here: https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment
        challenge.athlete.transfer(msg.value);
        emit boughtChallenges(
            _challengeId,
            _challengeUrl,
            _buyer,
            msg.value,
            _amount
        );
        return _tokenIds;
    }

    function setTokenPrice(
        uint256 _challengeId,
        uint256 _tokenId,
        uint256 _price
    ) public returns (uint256) {
        require(
            cs._tokenIndexByChallengeId[_challengeId].current() >= _tokenId,
            "this token does not exist!"
        );
        require(
            ERC1155BaseStorage.layout().nfOwners[
                (_challengeId + _tokenId) << 128
            ] == LibBaseRelayRecipient._msgSender(),
            "only the owner can set the price!"
        );
        ChallengeToken memory challengeToken =
            cs._challengeTokenById[(_challengeId + _tokenId) << 128];
        challengeToken.price = _price;
        emit newTokenPrice(_challengeId, _tokenId, _price);
        return _price;
    }

    function buyTokens(
        uint256 _challengeId,
        uint256[] calldata _tokenIds,
        uint256 _amount,
        bytes calldata data
    ) public payable {
        require(
            _amount == _tokenIds.length,
            "Amount requested does not match number of tokenIds"
        );
        uint256[] memory ids = new uint256[](_amount);
        uint256[] memory amounts = new uint256[](_amount);
        uint256 totalPrice;
        for (uint256 i = 0; i < _amount; i++) {
            uint256 _id = (_challengeId + _tokenIds[i]) << 128;
            ids[i] = _id;
            ChallengeToken memory challengeToken = cs._challengeTokenById[_id];
            require(challengeToken.price > 0, "this token is not for sale");
            totalPrice += challengeToken.price;
            amounts[i] = 1;
        }
        require(msg.value >= totalPrice, "Amount sent too small");
        address payable _seller =
            payable(ERC1155BaseStorage.layout().nfOwners[ids[0]]);
        safeBatchTransferFrom(_seller, LibBaseRelayRecipient._msgSender(), ids, amounts, data);
        //Note: a pull mechanism would be safer here: https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment

        uint256 _athleteTake =
            cs.athleteTake.mul(msg.value).div(100);
        uint256 _sellerTake = msg.value.sub(_athleteTake);
        string memory _challengeUrl = cs.tokenChallenge[_challengeId];

        Challenge memory challenge =
            ChallengeFacet(address(this)).challengeInfoByChallengeUrl(_challengeUrl);
        challenge.athlete.transfer(_athleteTake);
        _seller.transfer(_sellerTake);

        emit boughtChallenges(
            _challengeId,
            _challengeUrl,
            LibBaseRelayRecipient._msgSender(),
            msg.value,
            _amount
        );
    }

    function challengeTokenById(string memory challengeUrl, uint256 tokenId)
        public
        view
        returns (uint256)
    {
        return cs._challengeTokens[challengeUrl].at(tokenId);
    }
}
