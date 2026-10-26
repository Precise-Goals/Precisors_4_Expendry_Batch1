// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EXPEN Token
 * @notice Native utility & reward token for the Expendry manufacturing ecosystem.
 * @dev Implements ERC-20 with operator-controlled minting and OpenZeppelin v5.
 */
contract EXPEN is ERC20, Ownable {
    /**
     * @param initialOwner Address of the contract owner (operator wallet)
     */
    constructor(address initialOwner)
        ERC20("EXPEN Token", "EXPEN")
        Ownable(initialOwner)
    {}

    /**
     * @notice Mints tokens to a recipient. Only callable by the owner/operator.
     * @param to Recipient address
     * @param amount Amount to mint in wei (18 decimals)
     */
    function mint(address to, uint256 amount) public virtual onlyOwner {
        require(amount > 0, "EXPEN: mint amount must be greater than zero");
        _mint(to, amount);
    }
}
