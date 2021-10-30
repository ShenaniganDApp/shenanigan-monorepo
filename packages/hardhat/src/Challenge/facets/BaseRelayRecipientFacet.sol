// SPDX-License-Identifier:MIT
// solhint-disable no-inline-assembly
pragma solidity ^0.8.0;

import { LibBaseRelayRecipient } from "../libraries/LibBaseRelayRecipient.sol";

contract BaseRelayRecipientFacet {

    function isTrustedForwarder(address forwarder)
        external
        view
        returns (bool)
    {
       return LibBaseRelayRecipient.isTrustedForwarder(forwarder);
    }

    function _msgSender()
        external
        view
        returns (address payable ret)
    {
        return LibBaseRelayRecipient._msgSender();
    }

    function _msgData()
        external
        view
        returns (bytes memory ret)
    {
        return LibBaseRelayRecipient._msgData();
    }
}
