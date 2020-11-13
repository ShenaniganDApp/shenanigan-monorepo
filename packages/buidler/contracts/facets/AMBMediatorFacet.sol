/*
  This file is part of Shenanigan.
  Shenanigan is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  Shenanigan is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  You should have received a copy of the GNU General Public License
  along with Shenanigan. If not, see <http://www.gnu.org/licenses/>.
*/
pragma solidity >=0.6.0 <0.7.0;

import "../IAMB.sol";
import "../IChallengeManagement.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract AMBMediatorFacet is Ownable {
    using Address for address;

    constructor() public {}

    address public bridgeContractAddress;
    address private otherSideContractAddress;
    uint256 public requestGasLimit;

    mapping(bytes32 => bool) public messageFixed;

    function setBridgeContract(address _bridgeContract) external onlyOwner {
        _setBridgeContract(_bridgeContract);
    }

    function _setBridgeContract(address _bridgeContract) internal {
        require(
            _bridgeContract.isContract(),
            "provided address is not a contract"
        );
        bridgeContractAddress = _bridgeContract;
    }

    function bridgeContract() public view returns (IAMB) {
        return IAMB(bridgeContractAddress);
    }

    function setMediatorContractOnOtherSide(address _mediatorContract)
        external
        onlyOwner
    {
        _setMediatorContractOnOtherSide(_mediatorContract);
    }

    function _setMediatorContractOnOtherSide(address _mediatorContract)
        internal
    {
        otherSideContractAddress = _mediatorContract;
    }

    function mediatorContractOnOtherSide() public view returns (address) {
        return otherSideContractAddress;
    }

    function setRequestGasLimit(uint256 _requestGasLimit) external onlyOwner {
        _setRequestGasLimit(_requestGasLimit);
    }

    function _setRequestGasLimit(uint256 _requestGasLimit) internal {
        require(
            _requestGasLimit <= bridgeContract().maxGasPerTx(),
            "gas limit is higher than the Bridge maximum"
        );
        requestGasLimit = _requestGasLimit;
    }

    /**
     * @dev Tells the address that generated the message on the other network that is currently being executed by
     * the AMB bridge.
     * @return the address of the message sender.
     */
    function messageSender() internal view returns (address) {
        return bridgeContract().messageSender();
    }

    /**
     * @dev Tells the id of the message originated on the other network.
     * @return the id of the message originated on the other network.
     */
    function messageId() internal view returns (bytes32) {
        return bridgeContract().messageId();
    }

    function setMessageFixed(bytes32 _txHash) internal {
        messageFixed[_txHash] = true;
    }

    function requestFailedMessageFix(bytes32 _txHash) external {
        require(!bridgeContract().messageCallStatus(_txHash));
        require(
            bridgeContract().failedMessageReceiver(_txHash) == address(this)
        );
        require(
            bridgeContract().failedMessageSender(_txHash) ==
                mediatorContractOnOtherSide()
        );
        bytes32 dataHash = bridgeContract().failedMessageDataHash(_txHash);

        bytes4 methodSelector = IChallengeManagement(address(0))
            .fixFailedMessage
            .selector;
        bytes memory data = abi.encodeWithSelector(methodSelector, dataHash);
        bridgeContract().requireToPassMessage(
            mediatorContractOnOtherSide(),
            data,
            requestGasLimit
        );
    }
}
