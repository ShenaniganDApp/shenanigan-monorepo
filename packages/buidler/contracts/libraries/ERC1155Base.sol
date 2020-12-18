// SPDX-License-Identifier: MIT

pragma solidity ^0.7.5;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/introspection/ERC165.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./LibERC1155Base.sol";

contract ERC1155Base is IERC1155, ERC165 {
    using Address for address;
    using SafeMath for uint256;

    // Store the non-fungible type in the bottom 128 bits
    uint256 constant TYPE_MASK = uint256(uint64(~0));

    // Store the index in the top 128 bits..
    uint256 constant INDEX_MASK = uint64(~0) << 128;


    function balanceOf(address account, uint256 id)
        public
        override
        view
        returns (uint256)
    {
        return LibERC1155Base.layout().nfOwners[id] == account ? 1 : 0;
    }

    function balanceOfBatch(address[] memory accounts, uint256[] memory ids)
        public
        override
        view
        returns (uint256[] memory)
    {
        require(
            accounts.length == ids.length,
            "ERC1155: accounts and ids length mismatch"
        );

        uint256[] memory batchBalances = new uint256[](accounts.length);

        for (uint256 i; i < accounts.length; i++) {
            uint256 id = ids[i];
            require(
                accounts[i] != address(0),
                "ERC1155: batch balance query for the zero address"
            );
            batchBalances[i] = LibERC1155Base.layout().nfOwners[id] == accounts[i] ? 1 : 0;
        }

        return batchBalances;
    }

    function isApprovedForAll(address account, address operator)
        public
        override
        view
        returns (bool)
    {
        return LibERC1155Base.layout().operatorApprovals[account][operator];
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        require(to != address(0), "ERC1155: transfer to the zero address");
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERC1155: calleris not owner nor approved"
        );

        _beforeTokenTransfer(
            msg.sender,
            from,
            to,
            _asSingletonArray(id),
            _asSingletonArray(amount),
            data
        );
        require(LibERC1155Base.layout().nfOwners[id] == from, "Does not own this NFT");
        LibERC1155Base.layout().nfOwners[id] = to;
        uint256 baseType = id & TYPE_MASK;
        LibERC1155Base.layout().balances[baseType][from] = LibERC1155Base.layout().balances[baseType][from].sub(
            amount,
            "ERC1155: insufficient balance for transfer"
        );
        LibERC1155Base.layout().balances[baseType][to] = LibERC1155Base.layout().balances[baseType][to].add(amount);

        emit TransferSingle(msg.sender, from, to, id, amount);

        _doSafeTransferAcceptanceCheck(msg.sender, from, to, id, amount, data);
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
        require(to != address(0), "ERC1155: transfer to the zero address");
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERC1155: caller is not owner nor approved"
        );

        _beforeTokenTransfer(msg.sender, from, to, ids, amounts, data);

        for (uint256 i; i < ids.length; i++) {
            uint256 id = ids[i];
            uint256 amount = amounts[i];

            require(LibERC1155Base.layout().nfOwners[id] == from, "Does not own this NFT");
            LibERC1155Base.layout().nfOwners[id] = to;
            uint256 baseType = id & TYPE_MASK;
            LibERC1155Base.layout().balances[baseType][from] = LibERC1155Base.layout().balances[baseType][from].sub(
                amount,
                "ERC1155: insufficient balance for transfer"
            );
            LibERC1155Base.layout().balances[baseType][to] = LibERC1155Base.layout().balances[baseType][to].add(amount);
        }

        emit TransferBatch(msg.sender, from, to, ids, amounts);

        _doSafeBatchTransferAcceptanceCheck(
            msg.sender,
            from,
            to,
            ids,
            amounts,
            data
        );
    }

    function setApprovalForAll(address operator, bool status) public override {
        require(
            msg.sender != operator,
            "ERC1155: setting approval status for self"
        );
        LibERC1155Base.layout().operatorApprovals[msg.sender][operator] = status;
        emit ApprovalForAll(msg.sender, operator, status);
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
        LibERC1155Base.layout().nfOwners[id] = account;
        uint256 baseType = id & TYPE_MASK;
        LibERC1155Base.layout().balances[baseType][account] = LibERC1155Base.layout().balances[baseType][account].add(
            amount
        );

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

        for (uint256 i; i < ids.length; i++) {
            uint256 id = ids[i];
            uint256 amount = amounts[i];
            LibERC1155Base.layout().nfOwners[id] = account;
            uint256 baseType = id & TYPE_MASK;
            LibERC1155Base.layout().balances[baseType][account] = LibERC1155Base.layout().balances[baseType][account].add(
                amount
            );
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

        require(LibERC1155Base.layout().nfOwners[id] == account, "Does not own this NFT");
        uint256 baseType = id & TYPE_MASK;
        LibERC1155Base.layout().balances[baseType][account] = LibERC1155Base.layout().balances[baseType][account].sub(
            amount,
            "ERC1155: burn amount exceeds balance"
        );

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

        for (uint256 i; i < ids.length; i++) {
            uint256 id = ids[i];
            uint256 amount = amounts[i];
            require(LibERC1155Base.layout().nfOwners[id] == account, "Does not own this NFT");
            uint256 baseType = id & TYPE_MASK;
            LibERC1155Base.layout().balances[baseType][account] = LibERC1155Base.layout().balances[baseType][account].sub(
                amount,
                "ERC1155: burn amount exceeds balance"
            );
        }

        emit TransferBatch(msg.sender, account, address(0), ids, amounts);
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
