// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC677Receiver} from "@src/interfaces/IERC677Receiver.sol";

contract ERC677Mock is ERC20 {
    constructor(string memory _tokenName, string memory _tokenSymbol, uint256 _totalSupply)
        ERC20(_tokenName, _tokenSymbol)
    {
        _mint(msg.sender, _totalSupply * (10 ** uint256(decimals())));
    }

    function transferAndCall(address _to, uint256 _value, bytes memory _data) public returns (bool) {
        super.transfer(_to, _value);
        if (isContract(_to)) {
            contractFallback(msg.sender, _to, _value, _data);
        }
        return true;
    }

    function transferAndCallFrom(address _sender, address _to, uint256 _value, bytes memory _data)
        internal
        returns (bool)
    {
        _transfer(_sender, _to, _value);
        if (isContract(_to)) {
            contractFallback(_sender, _to, _value, _data);
        }
        return true;
    }

    function contractFallback(address _sender, address _to, uint256 _value, bytes memory _data) internal {
        IERC677Receiver receiver = IERC677Receiver(_to);
        receiver.onTokenTransfer(_sender, _value, _data);
    }

    function isContract(address _addr) internal view returns (bool hasCode) {
        uint256 length;
        assembly {
            length := extcodesize(_addr)
        }
        return length > 0;
    }
}
