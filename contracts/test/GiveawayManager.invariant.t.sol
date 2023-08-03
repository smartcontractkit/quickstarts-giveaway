// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "@src/GiveawayManager.sol";
import {ERC20Mock} from "@src/mock/ERC20Mock.sol";
import {ERC677Mock} from "@src/mock/ERC677Mock.sol";
import {VRFV2WrapperMock} from "@src/mock/VRFV2WrapperMock.sol";
import {Handler} from "./handlers/Handler.sol";
import {UD60x18, ud, intoUint256} from "@prb/math/UD60x18.sol";
import {AutomationMock} from "@src/mock/AutomationMock.sol";

contract GiveawayManagerInvariants is Test {
    GiveawayManager giveawayManager;
    Handler handler;
    ERC20Mock customToken;
    VRFV2WrapperMock vrfMock;
    address wrapperAddress;
    uint16 requestConfirmations;
    uint32 callbackGasLimit;
    AutomationMock keeperAddress;
    address linkAddress;
    address registrarAddress;
    ERC677Mock customLINK;
    address admin;
    address giveawayAdmin;
    address user1;
    address user2;
    address user3;
    address user4;
    address user5;
    bytes32 merkleRoot;
    address addrA = address(0x0000000000000000000000000000000000000001);
    address addrB = address(0x0000000000000000000000000000000000000002);
    bytes32[] proofA = new bytes32[](2);
    bytes32[] proofB = new bytes32[](2);
    uint96 BASE_FEE = 2500000000;
    uint96 GAS_PRICE_LINK = 1e9;
    string email;
    uint32 automationCallbackGas;

    function setUp() external {
        admin = makeAddr("admin");
        giveawayAdmin = makeAddr("giveawayAdmin");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        user4 = makeAddr("user4");
        user5 = makeAddr("user5");
        customLINK = new ERC677Mock("Chainlink", "LINK", 1000000 ether);
        wrapperAddress = address(0x1);
        requestConfirmations = 3;
        callbackGasLimit = 100000;
        automationCallbackGas = 500_000;
        keeperAddress = new AutomationMock();
        linkAddress = address(0x3);
        registrarAddress = address(0x4);
        merkleRoot = 0x344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a;
        proofA[
            0
        ] = 0xd52688a8f926c816ca1e079067caba944f158e764817b83fc43594370ca9cf62;
        proofA[
            1
        ] = 0x5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9;
        proofB[
            0
        ] = 0x1468288056310c82aa4c01a7e12a10f8111a0560e72b700555479031b86c357d;
        proofB[
            1
        ] = 0x5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9;
        email = "test@test.com";
        vm.startPrank(admin);
        customLINK = new ERC677Mock("Chainlink", "LINK", 1000000 ether);
        vrfMock = new VRFV2WrapperMock(BASE_FEE, GAS_PRICE_LINK);
        giveawayManager = new GiveawayManager(
            address(vrfMock),
            requestConfirmations,
            callbackGasLimit,
            address(keeperAddress),
            address(customLINK),
            registrarAddress,
            automationCallbackGas
        );
        customLINK.transfer(giveawayAdmin, 1000000 ether);

        // handler now acts as entry point for invariant tests
        handler = new Handler(giveawayManager, address(customLINK));
        bytes4[] memory selectors = new bytes4[](3);
        selectors[0] = Handler.enterGiveaway.selector;
        selectors[1] = Handler.createGiveaway.selector;
        selectors[2] = Handler.transferAndCall.selector;

        targetSelector(
            FuzzSelector({addr: address(handler), selectors: selectors})
        );
        targetContract(address(handler));

        vm.stopPrank();
    }

    function successFixtureWithETH() public {
        GiveawayManager.CreateGiveawayParams memory _params = GiveawayManager
            .CreateGiveawayParams({
                prizeName: "BigMac",
                timeLength: 0,
                fee: 1 ether,
                name: "Big Mac Contest",
                feeToken: address(0),
                merkleRoot: bytes32(""),
                automation: false,
                participants: new bytes32[](0),
                totalWinners: 1,
                entriesPerUser: 5
            });
        vm.prank(giveawayAdmin);
        customLINK.transferAndCall(
            address(giveawayManager),
            1 ether,
            bytes(abi.encode(_params))
        );
    }

    function successFixture() public {
        GiveawayManager.CreateGiveawayParams memory _params = GiveawayManager
            .CreateGiveawayParams({
                prizeName: "BigMac",
                timeLength: 30,
                fee: 0,
                name: "Big Mac Contest",
                feeToken: address(0),
                merkleRoot: bytes32(""),
                automation: false,
                participants: new bytes32[](0),
                totalWinners: 1,
                entriesPerUser: 100
            });
        vm.prank(giveawayAdmin);
        customLINK.transferAndCall(
            address(giveawayManager),
            1 ether,
            bytes(abi.encode(_params))
        );
    }

    function invariant_enterGiveaway_checkEthToEntries() public {
        for (uint256 i = 0; i < handler.ghost_totalGiveaways(); i++) {
            assertEq(
                intoUint256(giveawayManager.getGiveaway(i).prizeWorth),
                (handler.totalEntries(i) * 1 ether)
            );
        }
    }

    function invariant_transferAndCall_checkLINKBalanceMatches() public {
        for (uint256 i = 0; i < handler.ghost_totalLinkTransfered(); i++) {
            assertEq(
                giveawayManager
                    .getGiveaway(handler.linkArray(i))
                    .requestStatus
                    .totalLink,
                1 ether
            );
        }
    }

    /**
     * @notice Used to log different state variables during invariant testing
     */
    function invariant_callSummary() public view {
        handler.callSummary();
    }
}
