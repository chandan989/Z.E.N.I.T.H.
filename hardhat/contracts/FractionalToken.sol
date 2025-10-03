// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title FractionalToken
 * @dev A simple ERC20 token contract used to represent fractional ownership of a DomainNFT.
 */
contract FractionalToken is ERC20 {
    /**
     * @dev Initializes the ERC20 token with a name, symbol, and initial supply.
     * Mints the total supply to the contract deployer.
     * @param name_ The name of the token.
     * @param symbol_ The symbol of the token.
     * @param initialSupply_ The total supply of the token, in wei.
     */
    constructor(string memory name_, string memory symbol_, uint256 initialSupply_) ERC20(name_, symbol_) {
        _mint(msg.sender, initialSupply_);
    }
}
