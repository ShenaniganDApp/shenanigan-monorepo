// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


import "../libraries/ERC1155Base.sol";
import "../libraries/ERC1155BaseStorage.sol";
import "../libraries/ERC1155Enumerable.sol";
import "../utils/Counters.sol";
import "../utils/SafeMath.sol";
import "../libraries/Ownable.sol";
import "../gsn/BaseRelayRecipient.sol";
import "../IChallengeRegistry.sol";
import "../interfaces/IChallengeDiamond.sol";
import "../interfaces/IBaseChallenge.sol";
import "../SignatureChecker.sol";
import "../libraries/ChallengeStorage.sol";

contract ChallengeTokenFacet is
    BaseRelayRecipient,
    ERC1155Enumerable,
    SignatureChecker
{
    constructor() {
        setCheckSignatureFlag(true);
    }

    using Counters for Counters.Counter;
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.UintSet;

    event mintedChallenge(
        uint256 id,
        uint256 index,
        string challengeUrl,
        address to,
        uint256 amount
    );

    event boughtChallenges(
        uint256 tokenBaseId,
        string challengeUrl,
        address buyer,
        uint256 price,
        uint256 amount
    );
    event newTokenPrice(uint256 tokenBaseId, uint256 index, uint256 price);

    ChallengeStorage internal cs;

    function setChallengeRegistry(address _address) public onlyOwner {
        cs.challengeRegistry = _address;
    }

    function baseChallenge() private view returns (IBaseChallenge) {
        return
            IBaseChallenge(
                IChallengeRegistry(cs.challengeRegistry).challengeAddress()
            );
    }

    function challengeTokenCount(string memory _challengeUrl)
        public
        view
        returns (uint256)
    {
        uint256 _challengeTokenCount =
            cs._challengeTokens[_challengeUrl].length();
        return _challengeTokenCount;
    }

    function _mintChallengeToken(
        address to,
        uint256 baseId,
        string memory challengeUrl,
        string memory jsonUrl,
        uint256 amount,
        bytes memory data
    ) internal returns (uint256[] memory) {
        Counters.Counter storage tokenIndex = cs._challengeIndexByType[baseId];
        BaseChallenge memory base =
            baseChallenge().baseChallengeInfoById(baseId);
        require(
            amount < base.limit - tokenIndex.current(),
            "Cannot mint more than the limit"
        );
        uint256[] memory tokenIds = new uint256[](amount);
        for (uint256 i = 0; i < amount; i++) {
            tokenIndex.increment();
            uint256 tokenId = baseId + (tokenIndex.current() << 128);
            cs._challengeTokens[challengeUrl].add(tokenId);
            cs.tokenChallenge[tokenId] = challengeUrl;
            Counters.Counter memory priceNonce;
            cs._challengeById[tokenId] = Challenge(
                tokenId,
                "",
                0,
                priceNonce,
                base
            );
            tokenIds[i] = tokenId;
            _mint(to, tokenId, 1, data);
            emit URI(jsonUrl, tokenId);
            // emit mintedChallenge(baseId, tokenIndex.current(), challengeUrl, to, amount);
        }
        return tokenIds;
    }

    function firstMint(
        address to,
        string calldata challengeUrl,
        string calldata jsonUrl,
        bytes calldata data
    ) external returns (uint256[] memory) {
        require(
            _msgSender() ==
                IChallengeRegistry(cs.challengeRegistry).challengeAddress()
        );
        uint256 baseId = cs.totalChallenges.current();
        uint256[] memory tokenIds =
            _mintChallengeToken(to, baseId, challengeUrl, jsonUrl, 1, data);
        return tokenIds;
    }

    function mint(
        address to,
        string memory _challengeUrl,
        uint256 amount,
        bytes calldata data
    ) public returns (uint256[] memory) {
        uint256 _baseId = cs.baseIdByChallengeUrl[_challengeUrl];
        BaseChallenge memory base =
            baseChallenge().baseChallengeInfoById(_baseId);

        require(base.athlete == _msgSender(), "only the athlete can mint!");

        require(
            challengeTokenCount(_challengeUrl) < base.limit || base.limit == 0,
            "this challenge is over the limit!"
        );

        uint256[] memory tokenIds =
            _mintChallengeToken(
                to,
                base.id,
                base.challengeUrl,
                base.jsonUrl,
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
        uint256 _baseId = cs.baseIdByChallengeUrl[_challengeUrl];
        require(_baseId > 0, "this challenge does not exist!");

        uint256 _count = challengeTokenCount(_challengeUrl);
        BaseChallenge memory base =
            baseChallenge().baseChallengeInfoById(_baseId);
        require(
            _count < base.limit || base.limit == 0,
            "this challenge is over the limit!"
        );

        bytes32 messageHash =
            keccak256(
                abi.encodePacked(
                    bytes1(0x19),
                    bytes1(0),
                    address(this),
                    to,
                    base.challengeUrl,
                    _count
                )
            );
        bool isAthleteSignature =
            checkSignature(messageHash, signature, base.athlete);
        require(
            isAthleteSignature || !checkSignatureFlag,
            "only the athlete can mint!"
        );

        uint256[] memory tokenIds =
            _mintChallengeToken(
                to,
                base.id,
                base.challengeUrl,
                base.jsonUrl,
                amount,
                data
            );

        return tokenIds;
    }

    function lock(
        uint256 _tokenId,
        uint256 _amount,
        bytes calldata _data
    ) external {
        address _bridgeMediatorAddress =
            IChallengeRegistry(cs.challengeRegistry).bridgeMediatorAddress();
        require(
            _bridgeMediatorAddress == _msgSender(),
            "only the bridgeMediator can lock"
        );
        require(
            ERC1155BaseStorage.layout().nfOwners[_tokenId] == _msgSender(),
            "address does not have the required amount"
        );
        address from = ERC1155BaseStorage.layout().nfOwners[_tokenId];
        safeTransferFrom(from, _msgSender(), _tokenId, _amount, _data);
    }

    function unlock(
        uint256 _tokenId,
        address _recipient,
        uint256 _amount,
        bytes calldata _data
    ) external {
        require(
            _msgSender() ==
                IChallengeRegistry(cs.challengeRegistry)
                    .bridgeMediatorAddress(),
            "only the bridgeMediator can unlock"
        );
        require(
            ERC1155BaseStorage.layout().nfOwners[_tokenId] == _msgSender(),
            "address does not have the required amount"
        );
        safeTransferFrom(_msgSender(), _recipient, _tokenId, _amount, _data);
    }

    function buyChallenges(
        string memory _challengeUrl,
        uint256 _amount,
        bytes calldata _data
    ) public payable returns (uint256[] memory) {
        uint256 _baseId = cs.baseIdByChallengeUrl[_challengeUrl];
        require(_baseId > 0, "this challenge does not exist!");
        BaseChallenge memory base = cs._baseByBaseId[_baseId];
        require(base.basePrice > 0, "this challenge does not have a price set");
        uint256 _price = base.basePrice * _amount;
        require(msg.value >= _price, "Amount sent too small");

        require(
            base.limit > challengeTokenCount(_challengeUrl) + _amount,
            "this amount requested is over the limit!"
        );
        address _buyer = _msgSender();
        uint256[] memory _tokenIds =
            _mintChallengeToken(
                _buyer,
                base.id,
                base.challengeUrl,
                base.jsonUrl,
                _amount,
                _data
            );
        //Note: a pull mechanism would be safer here: https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment
        base.athlete.transfer(msg.value);
        emit boughtChallenges(
            _baseId,
            _challengeUrl,
            _buyer,
            msg.value,
            _amount
        );
        return _tokenIds;
    }

    function setTokenPrice(
        uint256 _baseId,
        uint256 _index,
        uint256 _price
    ) public returns (uint256) {
        require(
            cs._challengeIndexByType[_baseId].current() >= _index,
            "this token does not exist!"
        );
        require(
            ERC1155BaseStorage.layout().nfOwners[(_baseId + _index) << 128] ==
                _msgSender(),
            "only the owner can set the price!"
        );
        Challenge memory challenge =
            cs._challengeById[(_baseId + _index) << 128];
        challenge.price = _price;
        emit newTokenPrice(_baseId, _index, _price);
        return _price;
    }

    function buyTokens(
        uint256 _baseId,
        uint256[] calldata _indexes,
        uint256 _amount,
        bytes calldata data
    ) public payable {
        require(
            _amount == _indexes.length,
            "Amount requested does not match number of indexes"
        );
        uint256[] memory ids = new uint256[](_amount);
        uint256[] memory amounts = new uint256[](_amount);
        uint256 totalPrice;
        for (uint256 i = 0; i < _amount; i++) {
            uint256 _tokenId = (_baseId + _indexes[i]) << 128;
            ids[i] = _tokenId;
            Challenge memory challenge = cs._challengeById[_tokenId];
            require(challenge.price > 0, "this token is not for sale");
            totalPrice += challenge.price;
            amounts[i] = 1;
        }
        require(msg.value >= totalPrice, "Amount sent too small");
        address payable _seller =
            payable(ERC1155BaseStorage.layout().nfOwners[ids[0]]);
        safeBatchTransferFrom(_seller, _msgSender(), ids, amounts, data);
        //Note: a pull mechanism would be safer here: https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment

        uint256 _athleteTake =
            baseChallenge().athleteTake().mul(msg.value).div(100);
        uint256 _sellerTake = msg.value.sub(_athleteTake);
        string memory _challengeUrl = cs.tokenChallenge[_baseId];

        BaseChallenge memory base =
            baseChallenge().baseChallengeInfoByChallengeUrl(_challengeUrl);
        base.athlete.transfer(_athleteTake);
        _seller.transfer(_sellerTake);

        emit boughtChallenges(
            _baseId,
            _challengeUrl,
            _msgSender(),
            msg.value,
            _amount
        );
    }

    function challengeTokenByIndex(string memory challengeUrl, uint256 index)
        public
        view
        returns (uint256)
    {
        return cs._challengeTokens[challengeUrl].at(index);
    }

    function versionRecipient()
        external
        view
        virtual
        override
        returns (string memory)
    {
        return "1.0";
    }

    function setTrustedForwarder(address _trustedForwarder) public onlyOwner {
        trustedForwarder = _trustedForwarder;
    }

    function getTrustedForwarder() public view returns (address) {
        return trustedForwarder;
    }

    function _msgSender()
        internal
        view
        override(Context, BaseRelayRecipient)
        returns (address payable)
    {
        return BaseRelayRecipient._msgSender();
    }

    function _msgData()
        internal
        view
        override(Context, BaseRelayRecipient)
        returns (bytes memory)
    {
        return BaseRelayRecipient._msgData();
    }
}
