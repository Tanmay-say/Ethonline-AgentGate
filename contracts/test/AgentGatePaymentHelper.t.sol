// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {AgentGatePaymentHelper} from "../src/AgentGatePaymentHelper.sol";

contract MockToken {
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256) public balanceOf;

    function mint(address account, uint256 amount) external {
        balanceOf[account] += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(allowance[from][msg.sender] >= amount, "allowance");
        require(balanceOf[from] >= amount, "balance");
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

contract MockAnnouncer {
    bool public shouldRevert;
    uint256 public calls;
    uint256 public schemeId;
    bytes public stealthAddress;
    bytes public ephemeralPublicKey;
    bytes public metadata;

    function setShouldRevert(bool value) external {
        shouldRevert = value;
    }

    function announce(uint256 scheme, bytes calldata stealth, bytes calldata ephemeral, bytes calldata data) external {
        require(!shouldRevert, "announce failed");
        calls++;
        schemeId = scheme;
        stealthAddress = stealth;
        ephemeralPublicKey = ephemeral;
        metadata = data;
    }
}

contract AgentGatePaymentHelperTest is Test {
    MockToken private token;
    MockAnnouncer private announcer;
    AgentGatePaymentHelper private helper;
    address private payer = address(0xA11CE);
    address private stealth = address(0xB0B);

    function setUp() external {
        token = new MockToken();
        announcer = new MockAnnouncer();
        helper = new AgentGatePaymentHelper(address(token), address(announcer));
        token.mint(payer, 100);
        vm.prank(payer);
        token.approve(address(helper), 100);
    }

    function testPayAndAnnounceTransfersExactAmount() external {
        bytes memory ephemeral = hex"02010203";
        bytes memory metadata = hex"010203";

        vm.prank(payer);
        helper.payAndAnnounce(25, stealth, ephemeral, metadata);

        assertEq(token.balanceOf(payer), 75);
        assertEq(token.balanceOf(stealth), 25);
        assertEq(announcer.calls(), 1);
        assertEq(announcer.schemeId(), 1);
        assertEq(announcer.stealthAddress(), abi.encodePacked(stealth));
        assertEq(announcer.ephemeralPublicKey(), ephemeral);
        assertEq(announcer.metadata(), metadata);
    }

    function testRejectsZeroAmount() external {
        vm.expectRevert("invalid payment");
        vm.prank(payer);
        helper.payAndAnnounce(0, stealth, hex"01", hex"02");
    }

    function testRejectsInsufficientAllowance() external {
        vm.prank(payer);
        token.approve(address(helper), 10);

        vm.expectRevert("allowance");
        vm.prank(payer);
        helper.payAndAnnounce(11, stealth, hex"01", hex"02");
    }

    function testTransferRollsBackWhenAnnouncementFails() external {
        announcer.setShouldRevert(true);

        vm.expectRevert("announce failed");
        vm.prank(payer);
        helper.payAndAnnounce(25, stealth, hex"01", hex"02");

        assertEq(token.balanceOf(payer), 100);
        assertEq(token.balanceOf(stealth), 0);
    }
}
