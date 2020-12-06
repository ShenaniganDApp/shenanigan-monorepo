pragma solidity ^0.7.5;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "../IChallengeRegistry.sol";
import "../interfaces/IChallengesDiamond.sol";
import "../interfaces/IChallenge.sol";
import "../SignatureChecker.sol";
import "../libraries/ChallengeStorage.sol";

contract ChallengeToken is BaseRelayRecipient, ERC721, SignatureChecker {
    constructor() public ERC721("Shenanigan Challenge", "CHALLENGE") {
        _setBaseURI("ipfs://ipfs/");
        setCheckSignatureFlag(true);
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    using SafeMath for uint256;

    ChallengeStorage internal cs;

    function setChallengeRegistry(address _address) public onlyOwner {
        cs.challengeRegistry = _address;
    }

    function challenge() private view returns (IChallenge) {
        return
            IChallenge(
                IChallengeRegistry(cs.challengeRegistry).challengeAddress()
            );
    }

    event mintedChallenge(uint256 id, string challengeUrl, address to);
    event boughtChallenge(uint256 id, string challlengeUrl, address buyer, uint256 price);
    event newTokenPrice(uint256 id, uint256 price);


    function challengeTokenCount(string memory _challengeUrl)
        public
        view
        returns (uint256)
    {
        uint256 _challengeTokenCount = cs._challengeTokens[_challengeUrl].length();
        return _challengeTokenCount;
    }

    function _mintChallengeToken(
        address to,
        string memory challengeUrl,
        string memory jsonUrl
    ) internal returns (uint256) {
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        cs._challengeTokens[challengeUrl].add(id);
        cs.tokenChallenge[id] = challengeUrl;

        _mint(to, id);
        _setTokenURI(id, jsonUrl);

        emit mintedChallenge(id, challengeUrl, to);

        return id;
    }

    function firstMint(
        address to,
        string calldata challengeUrl,
        string calldata jsonUrl
    ) external returns (uint256) {
        require(
            _msgSender() ==
                IChallengeRegistry(cs.challengeRegistry).challengeAddress()
        );
        _mintChallengeToken(to, challengeUrl, jsonUrl);
    }

    function mint(address to, string memory _challengeUrl)
        public
        returns (uint256)
    {
        uint256 _challengeId = challenge().challengeIdByChallengeUrl(
            _challengeUrl
        );
        require(_challengeId > 0, "this challenge does not exist!");
        (
            ,
            address _artist,
            string memory _jsonUrl,
            ,
            ,
            uint256 _limit,

        ) = challenge().challengeInfoById(_challengeId);

        require(_artist == _msgSender(), "only the artist can mint!");

        require(
            challengeTokenCount(_challengeUrl) < _limit || _limit == 0,
            "this challenge is over the limit!"
        );

        uint256 tokenId = _mintChallengeToken(to, _challengeUrl, _jsonUrl);

        return tokenId;
    }

    function mintFromSignature(
        address to,
        string memory _challengeUrl,
        bytes memory signature
    ) public returns (uint256) {
        uint256 _challengeId = challenge().challengeIdByChallengeUrl(
            _challengeUrl
        );
        require(_challengeId > 0, "this challenge does not exist!");

        uint256 _count = challengeTokenCount(_challengeUrl);
        (
            ,
            address _artist,
            string memory _jsonUrl,
            ,
            ,
            uint256 _limit,

        ) = challenge().challengeInfoById(_challengeId);
        require(
            _count < _limit || _limit == 0,
            "this challenge is over the limit!"
        );

        bytes32 messageHash = keccak256(
            abi.encodePacked(
                bytes1(0x19),
                bytes1(0),
                address(this),
                to,
                _challengeUrl,
                _count
            )
        );
        bool isArtistSignature = checkSignature(
            messageHash,
            signature,
            _artist
        );
        require(
            isArtistSignature || !checkSignatureFlag,
            "only the artist can mint!"
        );

        uint256 tokenId = _mintChallengeToken(to, _challengeUrl, _jsonUrl);

        return tokenId;
    }

    function lock(uint256 _tokenId) external {
        address _bridgeMediatorAddress = IChallengeRegistry(cs.challengeRegistry)
            .bridgeMediatorAddress();
        require(
            _bridgeMediatorAddress == _msgSender(),
            "only the bridgeMediator can lock"
        );
        address from = ownerOf(_tokenId);
        _transfer(from, _msgSender(), _tokenId);
    }

    function unlock(uint256 _tokenId, address _recipient) external {
        require(
            _msgSender() ==
                IChallengeRegistry(cs.challengeRegistry).bridgeMediatorAddress(),
            "only the bridgeMediator can unlock"
        );
        require(
            _msgSender() == ownerOf(_tokenId),
            "the bridgeMediator does not hold this token"
        );
        safeTransferFrom(_msgSender(), _recipient, _tokenId);
    }

    function buyChallenge(string memory _challengeUrl) public payable returns (uint256) {
      uint256 _challengeId = challenge().challengeIdByChallengeUrl(_challengeUrl);
      require(_challengeId > 0, "this challenge does not exist!");
      (, address payable _artist, string memory _jsonUrl, , uint256 _price, uint256 _limit, ) = challenge().challengeInfoById(_challengeId);
      require(challengeTokenCount(_challengeUrl) < _limit || _limit == 0, "this challenge is over the limit!");
      require(_price > 0, "this challenge does not have a price set");
      require(msg.value >= _price, "Amount sent too small");
      address _buyer = _msgSender();
      uint256 _tokenId = _mintChallengeToken(_buyer, _challengeUrl, _jsonUrl);
      //Note: a pull mechanism would be safer here: https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment
      _artist.transfer(msg.value);
      emit boughtChallenge(_tokenId, _challengeUrl, _buyer, msg.value);
      return _tokenId;
    }

    function setTokenPrice(uint256 _tokenId, uint256 _price) public returns (uint256) {
      require(_exists(_tokenId), "this token does not exist!");
      require(ownerOf(_tokenId) == _msgSender(), "only the owner can set the price!");

      cs.tokenPrice[_tokenId] = _price;
      emit newTokenPrice(_tokenId, _price);
      return _price;
    }

    function buyToken(uint256 _tokenId) public payable {
      uint256 _price = cs.tokenPrice[_tokenId];
      require(_price > 0, "this token is not for sale");
      require(msg.value >= _price, "Amount sent too small");
      address _buyer = _msgSender();
      address payable _seller = address(uint160(ownerOf(_tokenId)));
      _transfer(_seller, _buyer, _tokenId);
      //Note: a pull mechanism would be safer here: https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment

      uint256 _athleteTake = challenge().athleteTake().mul(msg.value).div(100);
      uint256 _sellerTake = msg.value.sub(_athleteTake);
      string memory _challengeUrl = cs.tokenChallenge[_tokenId];

      (, address payable _athlete, , , , , ) = challenge().challengeInfoByChallengeUrl(_challengeUrl);

      _athlete.transfer(_athleteTake);
      _seller.transfer(_sellerTake);

      emit boughtChallenge(_tokenId, _challengeUrl, _buyer, msg.value);
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721) {
        ERC721._transfer(from, to, tokenId);
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
        virtual
        override
        view
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
        override(BaseRelayRecipient, Context)
        view
        returns (address payable)
    {
        return BaseRelayRecipient._msgSender();
    }
}
