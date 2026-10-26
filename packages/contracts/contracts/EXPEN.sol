// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title EXPEN Token
 * @notice Native utility & reward token for the Expendry manufacturing ecosystem.
 * @dev Implements ERC-20 with operator-controlled minting, per-wallet daily reward cap (50 EXPEN),
 *      and Pausable emergency stop safety mechanism.
 */
contract EXPEN is ERC20, Ownable, Pausable {
    /// @notice Maximum reward tokens a wallet can be minted per 24-hour UTC day (50 EXPEN)
    uint256 public constant DAILY_CAP = 50 * 10**18;

    /// @notice Reward per post constant (10 EXPEN)
    uint256 public constant REWARD_PER_POST = 10 * 10**18;

    /// @notice Tracks total tokens minted per wallet per day index (block.timestamp / 1 days)
    mapping(address => mapping(uint256 => uint256)) public dailyMinted;

    /// @notice Emitted when tokens are minted with daily tally tracking
    event RewardMinted(address indexed recipient, uint256 amount, uint256 dayTotal);

    /**
     * @param initialOwner Address of the contract owner (operator wallet)
     */
    constructor(address initialOwner)
        ERC20("EXPEN Token", "EXPEN")
        Ownable(initialOwner)
    {}

    /**
     * @notice Triggers emergency stop. Restricts token minting and transfers.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Resumes normal contract operations.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Mints tokens to a recipient while strictly enforcing the daily reward cap.
     * @param to Recipient wallet address
     * @param amount Amount to mint in wei (18 decimals)
     */
    function mint(address to, uint256 amount) public virtual onlyOwner whenNotPaused {
        require(amount > 0, "EXPEN: mint amount must be greater than zero");
        require(to != address(0), "EXPEN: cannot mint to zero address");

        uint256 currentDay = block.timestamp / 1 days;
        uint256 dayTotal = dailyMinted[to][currentDay] + amount;
        require(dayTotal <= DAILY_CAP, "EXPEN: Daily cap of 50 EXPEN exceeded");

        dailyMinted[to][currentDay] = dayTotal;
        _mint(to, amount);
        emit RewardMinted(to, amount, dayTotal);
    }

    /**
     * @notice Enforces pause state on token transfers.
     */
    function _update(address from, address to, uint256 value) internal virtual override whenNotPaused {
        super._update(from, to, value);
    }

    /**
     * @notice Helper to query current day's minted amount for a wallet
     */
    function getDailyMinted(address wallet) external view returns (uint256) {
        return dailyMinted[wallet][block.timestamp / 1 days];
    }

    /**
     * @notice Helper to query remaining allowable reward tokens for today
     */
    function getDailyRemaining(address wallet) external view returns (uint256) {
        uint256 mintedToday = dailyMinted[wallet][block.timestamp / 1 days];
        if (mintedToday >= DAILY_CAP) {
            return 0;
        }
        return DAILY_CAP - mintedToday;
    }
}
