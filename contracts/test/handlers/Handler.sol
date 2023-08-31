// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "@src/GiveawayManager.sol";
import {ERC20Mock} from "@src/mock/ERC20Mock.sol";
import {ERC677Mock} from "@src/mock/ERC677Mock.sol";
import {VRFV2WrapperMock} from "@src/mock/VRFV2WrapperMock.sol";
import {console} from "forge-std/console.sol";
import {AddressSet, LibAddressSet} from "../helpers/AddressSet.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract Handler is Test {
    using LibAddressSet for AddressSet;

    address admin;
    GiveawayManager public giveawayManager;
    AddressSet internal _actors;
    AddressSet internal _giveawayAdmins;
    address internal currentGiveawayAdmin;
    address internal currentActor;
    address internal linkAddress;

    uint256 public ghost_zeroEntries;
    uint256 public ghost_totalEntries;
    uint256 public ghost_totalGiveaways;
    uint256 public ghost_totalLinkTransfered;

    uint256[] public linkArray;

    mapping(bytes32 => uint256) public calls;
    mapping(uint256 => uint256) public totalEntries;
    mapping(uint256 => uint256) public totalLink;
    mapping(address => Giveaway) public giveaways;

    struct Giveaway {
        uint256 id;
        bool live;
    }

    modifier createActor() {
        currentActor = msg.sender;
        _actors.add(msg.sender);
        _;
    }

    modifier createGiveawayAdmin() {
        vm.prank(admin);
        LinkTokenInterface(linkAddress).transfer(msg.sender, 10 ether);
        currentGiveawayAdmin = msg.sender;
        _giveawayAdmins.add(msg.sender);
        _;
    }

    modifier countCall(bytes32 key) {
        calls[key]++;
        _;
    }

    constructor(GiveawayManager _giveawayManager, address _linkAddress) {
        admin = msg.sender;
        giveawayManager = _giveawayManager;
        linkAddress = _linkAddress;
    }

    function enterGiveaway(
        uint256 seed
    ) public createActor countCall("enterGiveaway") {
        // used to check if the actor has already called this function to not cause a revert
        if (
            _actors.called[currentActor] == 1 &&
            giveawayManager.giveawayCounter() > 0
        ) {
            seed = bound(seed, 1, type(uint256).max);
            uint256 _count = giveawayManager.giveawayCounter();
            uint256 id = (seed % _count);
            uint8 entries = giveawayManager.getGiveaway(id).base.entriesPerUser;
            vm.deal(currentActor, entries * 1e18);
            vm.prank(currentActor);
            giveawayManager.enterGiveaway{value: entries * 1e18}(
                id,
                entries,
                new bytes32[](0)
            );
            totalEntries[id] += entries;
        }
    }

    function createGiveaway(
        uint8 totalWinners,
        uint256 _entries
    ) public createGiveawayAdmin countCall("createGiveaway") {
        _entries = bound(_entries, 1, 5);
        vm.startPrank(currentGiveawayAdmin);
        if (!giveaways[currentGiveawayAdmin].live) {
            GiveawayManager.CreateGiveawayParams
                memory _params = GiveawayManager.CreateGiveawayParams({
                    prizeName: "BigMac",
                    timeLength: 30,
                    fee: 1 ether,
                    name: "Big Mac Contest",
                    feeToken: address(0),
                    merkleRoot: bytes32(""),
                    automation: false,
                    participants: new bytes32[](0),
                    totalWinners: totalWinners,
                    entriesPerUser: uint8(_entries)
                });

            LinkTokenInterface(linkAddress).transferAndCall(
                address(giveawayManager),
                5 ether,
                bytes(abi.encode(_params))
            );

            giveaways[currentGiveawayAdmin] = Giveaway(
                giveawayManager.giveawayCounter() - 1,
                true
            );
            ghost_totalGiveaways++;
        }
        vm.stopPrank();
    }

    function transferAndCall(uint256 seed) public countCall("transferLINK") {
        address caller = _giveawayAdmins.rand(seed);
        if (
            giveawayManager
                .getGiveaway(giveaways[caller].id)
                .contestants
                .length >
            0 &&
            !_giveawayAdmins.depositLink[caller]
        ) {
            vm.prank(admin);
            LinkTokenInterface(linkAddress).transfer(caller, 1 ether);
            vm.prank(caller);
            LinkTokenInterface(linkAddress).transferAndCall(
                address(giveawayManager),
                1 ether,
                bytes(abi.encode(giveaways[caller].id))
            );
            totalLink[giveaways[caller].id] += 1 ether;
            _giveawayAdmins.depositLink[caller] = true;
            linkArray.push(giveaways[caller].id);
            ghost_totalLinkTransfered++;
        }
    }

    function callSummary() external view {
        console.log("Call summary:");
        console.log("-------------------");
        console.log("createGiveaway", calls["createGiveaway"]);
        console.log("enterGiveaway", calls["enterGiveaway"]);
        console.log("transferLINK", calls["transferLINK"]);
    }
}
