//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 

// @title Vault2
/* @notice a vault where users can wrap their ether. 
    Users send ether and receive VAULT. 
    On burning VAULT, users get ether back.
*/
contract Vault2 is ERC20 {
    
    event newVaults(uint _amount);
    event GiveBackEth(uint _amount);

    uint public tokenId;
    string _name = "VAULT";
    string _symbol = "VAULT";
    address cAddress;
    
    constructor () ERC20(_name, _symbol){
      cAddress = address(this);

    }
    
    // @notice take ether and mint equal amount of VAULT tokens.
    // @dev check payable needed here or not
    function wrapTokens(uint _amount) payable public {
        require(msg.value == _amount, "Invalid amount");
        require(_amount > 0, "Zero Ether");

        // address account = msg.sender;
        // transferFrom(account, cAddress, _amount);
        // require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        
        _mint(msg.sender, _amount);
        emit newVaults(_amount);
    }

    // @notice burn their tokens and get equal amount of ether back
    function unWrapTokens(uint _amount) public {
        require(_amount <= CurrentBalance(), "Should ask for less Ether");
        
        address _account = msg.sender;
        _burn(_account, _amount);

        (bool success, ) = payable(_account).call{value: _amount}("");
        require(success, "Could not transfer");
        emit GiveBackEth(_amount);
    }

    // @dev balance is a global variable
    function CurrentBalance() public view returns(uint) {
        return cAddress.balance;
    }

}