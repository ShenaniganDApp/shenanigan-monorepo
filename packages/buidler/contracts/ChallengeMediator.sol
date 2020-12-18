pragma solidity ^0.7.5;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "./AMBMediator.sol";
import "./interfaces/IBaseChallenge.sol";
import "./interfaces/IChallengeToken.sol";
import "./IChallengeRegistry.sol";
import "./SignatureChecker.sol";

contract ChallengeMediator is
    BaseRelayRecipient,
    Ownable,
    AMBMediator,
    SignatureChecker
{
    constructor() public {
        setCheckSignatureFlag(true);
        setFeeReceiver(_msgSender());
    }

    event challengeSentViaBridge(uint256 _challengeId, bytes32 _msgId);
    event failedMessageFixed(
        bytes32 _msgId,
        address _recipient,
        uint256 _challengeId
    );
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

    function shenaniganToken() private view returns (IChallengeToken) {
        return
            IChallengeToken(
                IChallengeRegistry(challengeRegistry).challengeTokenAddress()
            );
    }

    function shenaniganChallenge() private view returns (IBaseChallenge) {
        return
            IBaseChallenge(
                IChallengeRegistry(challengeRegistry).challengeAddress()
            );
    }

    mapping(bytes32 => uint256) private msgBaseChallengeId;
    mapping(bytes32 => address) private msgRecipient;

    function _relayChallenge(uint256 _baseId, uint256 _index)
        internal
        returns (bytes32)
    {
        shenaniganToken().lock((_baseId + _index) << 128);
        string memory _challengeUrl = shenaniganToken().tokenChallenge(_baseId);

        BaseChallenge memory base = shenaniganChallenge()
            .baseChallengeInfoByChallengeUrl(_challengeUrl);

        bytes4 methodSelector = IChallengeManagement(address(0))
            .createChallenge
            .selector;
        bytes memory data = abi.encodeWithSelector(
            methodSelector,
            _msgSender(),
            _baseId,
            base.challengeUrl,
            base.jsonUrl
        );
        bytes32 msgId = bridgeContract().requireToPassMessage(
            mediatorContractOnOtherSide(),
            data,
            requestGasLimit
        );

        msgBaseChallengeId[msgId] = _baseId;
        msgRecipient[msgId] = _msgSender();

        emit challengeSentViaBridge(_baseId, msgId);

        return msgId;
    }

    function relayChallenge(uint256 _baseId, uint256 _index)
        external
        payable
        returns (bytes32)
    {
        require(
            _msgSender() == shenaniganChallenge().owner(),
            "only the owner can upgrade!"
        );
        require(msg.value >= relayPrice, "Amount sent too small");
        feeReceiver.transfer(msg.value);

        return _relayChallenge(_baseId, _index);
    }

    function relayChallengeFromSignature(
        uint256 _baseId,
        uint256 _index,
        bytes calldata signature
    ) external returns (bytes32) {
        require(relayPrice == 0, "cannot relay from signature, price > 0");
        address _owner = shenaniganChallenge().owner();
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                bytes1(0x19),
                bytes1(0),
                address(this),
                _owner,
                _baseId
            )
        );
        bool isOwnerSignature = checkSignature(messageHash, signature, _owner);
        require(
            isOwnerSignature || !checkSignatureFlag,
            "only the owner can upgrade!"
        );

        return _relayChallenge(_baseId, _index);
    }

    function fixFailedMessage(bytes32 _msgId) external {
        require(msg.sender == address(bridgeContract()));
        require(
            bridgeContract().messageSender() == mediatorContractOnOtherSide()
        );
        require(!messageFixed[_msgId]);

        address _recipient = msgRecipient[_msgId];
        uint256 _baseId = msgBaseChallengeId[_msgId];

        messageFixed[_msgId] = true;

        emit failedMessageFixed(_msgId, _recipient, _baseId);
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
        override(Context, BaseRelayRecipient)
        view
        returns (address payable)
    {
        return BaseRelayRecipient._msgSender();
    }

    function _msgData()
        internal
        override(Context, BaseRelayRecipient)
        view
        returns (bytes memory)
    {
        return BaseRelayRecipient._msgData();
    }
}
