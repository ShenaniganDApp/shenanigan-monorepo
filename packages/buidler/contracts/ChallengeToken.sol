pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "./IChallengeRegistry.sol";
import "./IChallenges.sol";
import "./SignatureChecker.sol";

contract ChallengeToken is BaseRelayRecipient, ERC721, SignatureChecker {

    constructor() ERC721("Shenanigan Challenge", "CHALLENGE") public {
      _setBaseURI('ipfs://ipfs/');
      setCheckSignatureFlag(true);
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    using SafeMath for uint256;

    address public challengeRegistry;

    function setChallengeRegistry(address _address) public onlyOwner {
      challengeRegistry = _address;
    }

    function challenge() private view returns (IChallenge) {
      return IChallenge(IChallengeRegistry(challengeRegistry).challengeAddress());
    }

    event mintedChallenge(uint256 id, string challengeUrl, address to);

    mapping (string => EnumerableSet.UintSet) private _challengeTokens;
    mapping (uint256 => string) public tokenChallenge;

    function challengeTokenCount(string memory _challengeUrl) public view returns(uint256) {
      uint256 _challengeTokenCount = _challengeTokens[_challengeUrl].length();
      return _challengeTokenCount;
    }

    function _mintChallengeToken(address to, string memory challengeUrl, string memory jsonUrl) internal returns (uint256) {

      _tokenIds.increment();
      uint256 id = _tokenIds.current();
      _challengeTokens[challengeUrl].add(id);
      tokenChallenge[id] = challengeUrl;

      _mint(to, id);
      _setTokenURI(id, jsonUrl);

      emit mintedChallenge(id, challengeUrl, to);

      return id;
    }

    function firstMint(address to, string calldata challengeUrl, string calldata jsonUrl) external returns (uint256) {
      require(_msgSender() == IChallengeRegistry(challengeRegistry).challengeAddress());
      _mintChallengeToken(to, challengeUrl, jsonUrl);
    }

    function mint(address to, string memory _challengeUrl) public returns (uint256) {
        uint256 _challengeId = challenge().challengeIdByChallengeUrl(_challengeUrl);
        require(_challengeId > 0, "this challenge does not exist!");
        (, address _artist, string memory _jsonUrl, , , uint256 _limit, ) = challenge().challengeInfoById(_challengeId);

        require(_artist == _msgSender(), "only the artist can mint!");

        require(challengeTokenCount(_challengeUrl) < _limit || _limit == 0, "this challenge is over the limit!");

        uint256 tokenId = _mintChallengeToken(to, _challengeUrl, _jsonUrl);

        return tokenId;
    }

    function mintFromSignature(address to, string memory _challengeUrl, bytes memory signature) public returns (uint256) {
        uint256 _challengeId = challenge().challengeIdByChallengeUrl(_challengeUrl);
        require(_challengeId > 0, "this challenge does not exist!");

        uint256 _count = challengeTokenCount(_challengeUrl);
        (, address _artist, string memory _jsonUrl, , , uint256 _limit, ) = challenge().challengeInfoById(_challengeId);
        require(_count < _limit || _limit == 0, "this challenge is over the limit!");

        bytes32 messageHash = keccak256(abi.encodePacked(byte(0x19), byte(0), address(this), to, _challengeUrl, _count));
        bool isArtistSignature = checkSignature(messageHash, signature, _artist);
        require(isArtistSignature || !checkSignatureFlag, "only the artist can mint!");

        uint256 tokenId = _mintChallengeToken(to, _challengeUrl, _jsonUrl);

        return tokenId;
    }

    function lock(uint256 _tokenId) external {
      address _bridgeMediatorAddress = IChallengeRegistry(challengeRegistry).bridgeMediatorAddress();
      require(_bridgeMediatorAddress == _msgSender(), 'only the bridgeMediator can lock');
      address from = ownerOf(_tokenId);
      _transfer(from, _msgSender(), _tokenId);
    }

    function unlock(uint256 _tokenId, address _recipient) external {
      require(_msgSender() == IChallengeRegistry(challengeRegistry).bridgeMediatorAddress(), 'only the bridgeMediator can unlock');
      require(_msgSender() == ownerOf(_tokenId), 'the bridgeMediator does not hold this token');
      safeTransferFrom(_msgSender(), _recipient, _tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal override(ERC721) {
        ERC721._transfer(from, to, tokenId);
    }

    function challengeTokenByIndex(string memory challengeUrl, uint256 index) public view returns (uint256) {
      return _challengeTokens[challengeUrl].at(index);
    }

    function versionRecipient() external virtual view override returns (string memory) {
  		return "1.0";
  	}

    function setTrustedForwarder(address _trustedForwarder) public onlyOwner {
      trustedForwarder = _trustedForwarder;
    }

    function getTrustedForwarder() public view returns(address) {
      return trustedForwarder;
    }

    function _msgSender() internal override(BaseRelayRecipient, Context) view returns (address payable) {
        return BaseRelayRecipient._msgSender();
    }
}