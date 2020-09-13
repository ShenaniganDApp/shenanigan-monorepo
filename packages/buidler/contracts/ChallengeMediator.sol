pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "./AMBMediator.sol";
import "./IChallenges.sol";
import "./IChallengeRegistry.sol";
import "./SignatureChecker.sol";

contract ChallengeMediator is BaseRelayRecipient, Ownable, AMBMediator, SignatureChecker {

    constructor() public {
      setCheckSignatureFlag(true);
      setFeeReceiver(_msgSender());
    }

    event challengeSentViaBridge(uint256 _challengeId, bytes32 _msgId);
    event failedMessageFixed(bytes32 _msgId, address _recipient, uint256 _challengeId);
    event newPrice(uint256 price);

    address public challengeRegistry;
    uint256 public relayPrice;
    address payable public feeReceiver;

    function setRelayPrice(uint256 _price) public onlyOwner {
      relayPrice = _price;
      emit newPrice(_price);
    }

    function setFeeReceiver(address payable _receiver) public onlyOwner {
      feeReceiver = _receiver;
    }

    function setChallengeRegistry(address _address) public onlyOwner {
      challengeRegistry = _address;
    }

    function shenaniganChallenge() private view returns (IChallenge) {
      return IChallenge(IChallengeRegistry(challengeRegistry).challengeAddress());
    }

    mapping (bytes32 => uint256) private msgChallengeId;
    mapping (bytes32 => address) private msgRecipient;

    function _relayChallenge(uint256 _challengeId) internal returns (bytes32) {

      string memory _challengeUrl = shenaniganChallenge().challengeStats(_challengeId);

      (, , string memory _jsonUrl, , , , ) = shenaniganChallenge().challengeInfoByChallengeUrl(_challengeUrl);

      bytes4 methodSelector = IChallengeManagement(address(0)).createChallenge.selector;
      bytes memory data = abi.encodeWithSelector(methodSelector, _msgSender(), _challengeId, _challengeUrl, _jsonUrl);
      bytes32 msgId = bridgeContract().requireToPassMessage(
          mediatorContractOnOtherSide(),
          data,
          requestGasLimit
      );

      msgChallengeId[msgId] = _challengeId;
      msgRecipient[msgId] = _msgSender();

      emit challengeSentViaBridge(_challengeId, msgId);

      return msgId;
    }

    function relayChallenge(uint256 _challengeId) external payable returns (bytes32) {
      require(_msgSender() == shenaniganChallenge().owner(), 'only the owner can upgrade!');
      require(msg.value >= relayPrice, "Amount sent too small");
      feeReceiver.transfer(msg.value);

      return _relayChallenge(_challengeId);
    }


    function relayChallengeFromSignature(uint256 _challengeId, bytes calldata signature) external returns (bytes32) {
      require(relayPrice == 0, "cannot relay from signature, price > 0");
      address _owner = shenaniganChallenge().owner();
      bytes32 messageHash = keccak256(abi.encodePacked(byte(0x19), byte(0), address(this), _owner, _challengeId));
      bool isOwnerSignature = checkSignature(messageHash, signature, _owner);
      require(isOwnerSignature || !checkSignatureFlag, "only the owner can upgrade!");

      return _relayChallenge(_challengeId);
    }

    function fixFailedMessage(bytes32 _msgId) external {
      require(msg.sender == address(bridgeContract()));
      require(bridgeContract().messageSender() == mediatorContractOnOtherSide());
      require(!messageFixed[_msgId]);

      address _recipient = msgRecipient[_msgId];
      uint256 _challengeId = msgChallengeId[_msgId];

      messageFixed[_msgId] = true;

      emit failedMessageFixed(_msgId, _recipient, _challengeId);
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