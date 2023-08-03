// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {AutomationRegistryInterface} from
    "@chainlink/contracts/src/v0.8/interfaces/automation/1_2/AutomationRegistryInterface1_2.sol";

interface IKeeperRegistry is AutomationRegistryInterface {
    function getMaxPaymentForGas(uint256 gasLimit) external view returns (uint96 maxPayment);
}
