// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IERC1155 } from "../interfaces/IERC1155.sol";
import { IERC1155Receiver } from "../interfaces/IERC1155Receiver.sol";
import { ERC1155BaseStorage } from "./ERC1155BaseStorage.sol";
import { LibDiamond } from "../libraries/LibDiamond.sol";
import { Address } from "../utils/Address.sol";

abstract contract ERC1155Base is IERC1155 {
    using Address for address;

    function balanceOf(address account, uint256 id)
        public
        view
        override
        returns (uint256)
    {
        require(
            account != address(0),
            "ERC1155: balance query for the zero address"
        );
        return ERC1155BaseStorage.layout().balances[id][account];
    }

    function balanceOfBatch(address[] memory accounts, uint256[] memory ids)
        public
        view
        override
        returns (uint256[] memory)
    {
        require(
            accounts.length == ids.length,
            "ERC1155: accounts and ids length mismatch"
        );

        mapping(uint256 => mapping(address => uint256)) storage balances =
            ERC1155BaseStorage.layout().balances;

        uint256[] memory batchBalances = new uint256[](accounts.length);

        for (uint256 i; i < accounts.length; i++) {
            require(
                accounts[i] != address(0),
                "ERC1155: batch balance query for the zero address"
            );
            batchBalances[i] = balances[ids[i]][accounts[i]];
        }

        return batchBalances;
    }

    function isApprovedForAll(address account, address operator)
        public
        view
        override
        returns (bool)
    {
        return ERC1155BaseStorage.layout().operatorApprovals[account][operator];
    }

    function setApprovalForAll(address operator, bool status) public override {
        require(
            msg.sender != operator,
            "ERC1155: setting approval status for self"
        );
        ERC1155BaseStorage.layout().operatorApprovals[msg.sender][
            operator
        ] = status;
        emit ApprovalForAll(msg.sender, operator, status);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERC1155: caller is not owner nor approved"
        );
        _doSafeTransferAcceptanceCheck(msg.sender, from, to, id, amount, data);
        _transfer(msg.sender, from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override {
        require(
            ids.length == amounts.length,
            "ERC1155: ids and amounts length mismatch"
        );
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERC1155: caller is not owner nor approved"
        );
        _doSafeBatchTransferAcceptanceCheck(
            msg.sender,
            from,
            to,
            ids,
            amounts,
            data
        );
        _transferBatch(msg.sender, from, to, ids, amounts, data);
    }

    function _mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) internal {
        require(account != address(0), "ERC1155: mint to the zero address");

        _beforeTokenTransfer(
            msg.sender,
            address(0),
            account,
            _asSingletonArray(id),
            _asSingletonArray(amount),
            data
        );

        mapping(address => uint256) storage balances =
            ERC1155BaseStorage.layout().balances[id];
        balances[account] += amount;

        emit TransferSingle(msg.sender, address(0), account, id, amount);

        _doSafeTransferAcceptanceCheck(
            msg.sender,
            address(0),
            account,
            id,
            amount,
            data
        );
    }

    function _mintBatch(
        address account,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal {
        require(account != address(0), "ERC1155: mint to the zero address");
        require(
            ids.length == amounts.length,
            "ERC1155: ids and amounts length mismatch"
        );

        _beforeTokenTransfer(
            msg.sender,
            address(0),
            account,
            ids,
            amounts,
            data
        );

        mapping(uint256 => mapping(address => uint256)) storage balances =
            ERC1155BaseStorage.layout().balances;

        for (uint256 i; i < ids.length; i++) {
            uint256 id = ids[i];
            balances[id][account] += amounts[i];
        }

        emit TransferBatch(msg.sender, address(0), account, ids, amounts);

        _doSafeBatchTransferAcceptanceCheck(
            msg.sender,
            address(0),
            account,
            ids,
            amounts,
            data
        );
    }

    function _burn(
        address account,
        uint256 id,
        uint256 amount
    ) internal {
        require(account != address(0), "ERC1155: burn from the zero address");

        _beforeTokenTransfer(
            msg.sender,
            account,
            address(0),
            _asSingletonArray(id),
            _asSingletonArray(amount),
            ""
        );

        mapping(address => uint256) storage balances =
            ERC1155BaseStorage.layout().balances[id];
        require(
            balances[account] >= amount,
            "ERC1155: burn amount exceeds balances"
        );
        balances[account] -= amount;

        emit TransferSingle(msg.sender, account, address(0), id, amount);
    }

    function _burnBatch(
        address account,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal {
        require(account != address(0), "ERC1155: burn from the zero address");
        require(
            ids.length == amounts.length,
            "ERC1155: ids and amounts length mismatch"
        );

        _beforeTokenTransfer(msg.sender, account, address(0), ids, amounts, "");

        mapping(uint256 => mapping(address => uint256)) storage balances =
            ERC1155BaseStorage.layout().balances;

        for (uint256 i; i < ids.length; i++) {
            uint256 id = ids[i];
            require(
                balances[id][account] >= amounts[i],
                "ERC1155: burn amount exceeds balance"
            );
            balances[id][account] -= amounts[i];
        }

        emit TransferBatch(msg.sender, account, address(0), ids, amounts);
    }

    function _transfer(
        address operator,
        address sender,
        address recipient,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) internal virtual {
        require(
            recipient != address(0),
            "ERC1155: transfer to the zero address"
        );

        _beforeTokenTransfer(
            operator,
            sender,
            recipient,
            _asSingletonArray(id),
            _asSingletonArray(amount),
            data
        );

        mapping(uint256 => mapping(address => uint256)) storage balances =
            ERC1155BaseStorage.layout().balances;

        // TODO: error message
        // balances[id][sender] = balances[id][sender].sub(amount, 'ERC1155: insufficient balances for transfer');
        balances[id][sender] -= amount;
        balances[id][recipient] += amount;

        emit TransferSingle(operator, sender, recipient, id, amount);
    }

    function _transferBatch(
        address operator,
        address sender,
        address recipient,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual {
        require(
            recipient != address(0),
            "ERC1155: transfer to the zero address"
        );

        _beforeTokenTransfer(operator, sender, recipient, ids, amounts, data);

        mapping(uint256 => mapping(address => uint256)) storage balances =
            ERC1155BaseStorage.layout().balances;

        for (uint256 i; i < ids.length; i++) {
            uint256 token = ids[i];
            uint256 amount = amounts[i];
            // TODO: error message
            // balances[id][sender] = balances[id][sender].sub(amount, 'ERC1155: insufficient balances for transfer');
            balances[token][sender] -= amount;
            balances[token][recipient] += amount;
        }

        emit TransferBatch(operator, sender, recipient, ids, amounts);
    }

    function _asSingletonArray(uint256 element)
        private
        pure
        returns (uint256[] memory)
    {
        uint256[] memory array = new uint256[](1);
        array[0] = element;
        return array;
    }

    function _doSafeTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) private {
        if (to.isContract()) {
            try
                IERC1155Receiver(to).onERC1155Received(
                    operator,
                    from,
                    id,
                    amount,
                    data
                )
            returns (bytes4 response) {
                if (
                    response != IERC1155Receiver(to).onERC1155Received.selector
                ) {
                    revert("ERC1155: ERC1155Receiver rejected tokens");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("ERC1155: transfer to non ERC1155Receiver implementer");
            }
        }
    }

    function _doSafeBatchTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) private {
        if (to.isContract()) {
            try
                IERC1155Receiver(to).onERC1155BatchReceived(
                    operator,
                    from,
                    ids,
                    amounts,
                    data
                )
            returns (bytes4 response) {
                if (
                    response !=
                    IERC1155Receiver(to).onERC1155BatchReceived.selector
                ) {
                    revert("ERC1155: ERC1155Receiver rejected tokens");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("ERC1155: transfer to non ERC1155Receiver implementer");
            }
        }
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual {}
}
