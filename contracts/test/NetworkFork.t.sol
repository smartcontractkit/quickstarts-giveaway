// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "forge-std/StdJson.sol";
import "@src/GiveawayManager.sol";
import {ERC20Mock} from "@src/mock/ERC20Mock.sol";
import {ERC677Mock} from "@src/mock/ERC677Mock.sol";
import {VRFV2WrapperMock} from "@src/mock/VRFV2WrapperMock.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {IKeeperRegistry} from "@src/interfaces/IKeeperRegistry.sol";

contract GiveawayManagerNetworkForkTest is Test {
    using stdJson for string;

    GiveawayManager giveawayManager;
    ERC20Mock customToken;
    VRFV2WrapperMock vrfMock;
    address admin;
    address giveawayAdmin;
    address sepoliaWhale;
    bytes32 merkleRoot;
    uint256 network;
    string email;
    Config config;

    event GiveawayCreated(
        string prizeName,
        uint256 indexed time,
        uint256 indexed fee,
        address feeToken,
        bool permissioned
    );
    event GiveawayJoined(
        uint256 indexed giveawayId,
        bytes32 indexed player,
        uint256 entries
    );
    event GiveawayOwnerUpdated(
        uint256 indexed giveawayId,
        address oldOwner,
        address newOwner
    );
    event GiveawayWon(uint256 indexed giveawayId, bytes32[] indexed winners);
    event GiveawayPrizeClaimed(
        uint256 indexed giveawayId,
        address indexed winner,
        uint256 value
    );

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

    function setUp() public {
        network = vm.createSelectFork(vm.rpcUrl("goerli"));
        config = configureNetwork("config");
        admin = makeAddr("admin");
        giveawayAdmin = makeAddr("giveawayAdmin");
        email = "test@test.com";
        vm.startPrank(admin);
        giveawayManager = new GiveawayManager(
            config.wrapperAddress,
            config.requestConfirmations,
            config.callbackGasLimit,
            config.keepersRegistry,
            config.linkAddress,
            config.registrarAddress,
            config.automationCallbackGas
        );
        vm.stopPrank();
    }

    function forkGiveawayFixture() public {
        vm.selectFork(network);
        bytes32[] memory participants = new bytes32[](1);
        participants[0] = keccak256(abi.encodePacked(email));
        GiveawayManager.CreateGiveawayParams memory _params = GiveawayManager
            .CreateGiveawayParams({
                prizeName: "BigMac",
                timeLength: 0,
                fee: 0,
                name: "Big Mac Contest",
                feeToken: address(0),
                merkleRoot: bytes32(""),
                automation: false,
                participants: participants,
                totalWinners: 1,
                entriesPerUser: 1
            });
        vm.prank(config.whaleAddress);
        LinkTokenInterface(config.linkAddress).transfer(
            giveawayAdmin,
            50 ether
        );
        vm.expectEmit(true, true, true, true);
        emit GiveawayCreated("BigMac", 0, 0, address(0), false);
        vm.prank(giveawayAdmin);
        LinkTokenInterface(config.linkAddress).transferAndCall(
            address(giveawayManager),
            5 ether,
            bytes(abi.encode(_params))
        );
    }

    function testFork_onTokenTransfer_CreateGiveawayAndCreateUpkeep() public {
        forkGiveawayFixture();
        GiveawayManager.GiveawayInstance memory r = giveawayManager.getGiveaway(
            0
        );
        assertTrue(r.requestStatus.upkeepId > 0);
    }

    function testFork_vrf() public {
        forkGiveawayFixture();

        vm.prank(giveawayAdmin);
        LinkTokenInterface(config.linkAddress).transferAndCall(
            address(giveawayManager),
            1 ether,
            bytes(abi.encode(0))
        );
    }

    function testFork_withdrawAutomation() public {
        forkGiveawayFixture();

        vm.prank(giveawayAdmin);
        giveawayManager.claimableAutomation(0);
    }

    function testFork_maxPaymentForGas() public view {
        uint96 payment = IKeeperRegistry(config.keepersRegistry)
            .getMaxPaymentForGas(5_000_000);
        console.log("Max payment for gas: ", payment);
    }
}
