// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

interface IERC5564Announcer {
    function announce(uint256 schemeId, bytes calldata stealthAddress, bytes calldata ephemeralPublicKey, bytes calldata metadata) external;
}

contract AgentGatePaymentHelper {
    IERC20 public immutable token;
    IERC5564Announcer public immutable announcer;

    constructor(address tokenAddress, address announcerAddress) {
        require(tokenAddress != address(0) && announcerAddress != address(0), "zero address");
        token = IERC20(tokenAddress);
        announcer = IERC5564Announcer(announcerAddress);
    }

    function payAndAnnounce(uint256 amount, address stealthAddress, bytes calldata ephemeralPublicKey, bytes calldata metadata) external {
        require(amount > 0 && stealthAddress != address(0), "invalid payment");
        require(token.transferFrom(msg.sender, stealthAddress, amount), "transfer failed");
        announcer.announce(1, abi.encodePacked(stealthAddress), ephemeralPublicKey, metadata);
    }
}
