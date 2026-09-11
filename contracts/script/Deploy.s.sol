// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {AgentGatePaymentHelper} from "../src/AgentGatePaymentHelper.sol";

contract Deploy is Script {
    function run() external returns (AgentGatePaymentHelper helper) {
        address token = vm.envAddress("USDC_ADDRESS");
        address announcer = vm.envAddress("ANNOUNCER_ADDRESS");
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerKey);
        helper = new AgentGatePaymentHelper(token, announcer);
        vm.stopBroadcast();
    }
}
