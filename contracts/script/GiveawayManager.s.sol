// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/StdJson.sol";
import {GiveawayManager} from "@src/GiveawayManager.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract GiveawayManagerScript is Script {
    using stdJson for string;

    GiveawayManager giveawayManager;
    uint256 deployerPrivateKey;
    Config config;

    struct Config {
        uint32 automationCallbackGas;
        uint32 callbackGasLimit;
        address keepersRegistry;
        address linkAddress;
        string name;
        address registrarAddress;
        uint16 requestConfirmations;
        address whaleAddress;
        address wrapperAddress;
    }

    function configureNetwork(
        string memory input
    ) internal view returns (Config memory) {
        string memory inputDir = string.concat(
            vm.projectRoot(),
            "/script/input/"
        );
        string memory chainDir = string.concat(vm.toString(block.chainid), "/");
        string memory file = string.concat(input, ".json");
        string memory data = vm.readFile(
            string.concat(inputDir, chainDir, file)
        );
        bytes memory rawConfig = data.parseRaw("");
        return abi.decode(rawConfig, (Config));
    }

    function run() public {
        config = configureNetwork("config");
        if (block.chainid == 31337) {
            deployerPrivateKey = vm.envUint("ANVIL_PRIVATE_KEY");
        } else {
            deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        }

        vm.startBroadcast(deployerPrivateKey);

        giveawayManager = new GiveawayManager(
            config.wrapperAddress,
            config.requestConfirmations,
            config.callbackGasLimit,
            config.keepersRegistry,
            config.linkAddress,
            config.registrarAddress,
            config.automationCallbackGas
        );

        vm.stopBroadcast();
    }

    // function createGiveaway() internal {
    //     giveawayManager.createGiveaway({
    //         prizeName: "BigMac",
    //         timeLength: 0,
    //         fee: 0,
    //         name: "Big Mac Contest",
    //         feeToken: address(0),
    //         merkleRoot: bytes32(""),
    //         automation: false,
    //         participants: new bytes32[](0),
    //         totalWinners: 1,
    //         entriesPerUser: 1
    //     });

    //     giveawayManager.enterGiveaway(0, 1, new bytes32[](0));

    //     // create/fund upkeep
    //     LinkTokenInterface(config.linkAddress).transferAndCall(address(giveawayManager), 5 ether, bytes(abi.encode(0, 1)));

    //     // fire off VRF request
    //     LinkTokenInterface(config.linkAddress).transferAndCall(
    //         address(giveawayManager), 0.1 ether, bytes(abi.encode(0, 0))
    //     );
    // }
}
