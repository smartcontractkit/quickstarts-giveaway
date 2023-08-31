// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/interfaces/automation/AutomationCompatibleInterface.sol";
import {AutomationRegistryInterface, State, Config} from "@chainlink/contracts/src/v0.8/interfaces/automation/1_2/AutomationRegistryInterface1_2.sol";
import {VRFV2WrapperConsumerBase} from "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {ERC677ReceiverInterface} from "@chainlink/contracts/src/v0.8/interfaces/ERC677ReceiverInterface.sol";
import {VRFV2WrapperInterface} from "@chainlink/contracts/src/v0.8/interfaces/VRFV2WrapperInterface.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {IGiveawayManager} from "@src/interfaces/IGiveawayManager.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {UD60x18, ud, intoUint256} from "@prb/math/UD60x18.sol";
import {IKeeperRegistrar} from "@src/interfaces/IKeeperRegistrar.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title Giveaway Manager
 * @notice Creates a mechanism for users to create and participate in giveaways
 */
contract GiveawayManager is
    IGiveawayManager,
    VRFV2WrapperConsumerBase,
    AutomationCompatibleInterface,
    ERC677ReceiverInterface,
    Pausable,
    ReentrancyGuard
{
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;
    using MerkleProof for bytes32[];

    Counters.Counter public giveawayCounter;
    RequestConfig public requestConfig;
    VRFV2WrapperInterface public vrfWrapper;
    AutomationRegistryInterface public immutable i_registry;
    address public immutable registrar;
    address public owner;
    address public linkTokenAddress;
    uint256[] public stagedGiveaways;
    EnumerableSet.UintSet private liveGiveaways;
    mapping(uint256 => GiveawayInstance) public giveaways;
    mapping(uint256 => uint256) public requestIdToGiveawayIndex;
    mapping(address => mapping(uint256 => uint8)) internal userEntries;

    bytes4 registerSig = IKeeperRegistrar.register.selector;

    // ------------------- STRUCTS -------------------
    enum GiveawayState {
        STAGED,
        LIVE,
        FINISHED,
        RESOLVING,
        CANCELLED
    }
    enum GiveawayType {
        DYNAMIC,
        STATIC
    }

    struct GiveawayInstance {
        GiveawayBase base;
        address owner;
        string giveawayName;
        bytes32[] contestants;
        bytes32[] winners;
        UD60x18 prizeWorth;
        RequestStatus requestStatus;
        uint256 timeLength;
        uint256 fee;
        GiveawayState giveawayState;
        Prize prize;
        bool paymentNeeded;
        bytes32 merkleRoot;
    }

    struct GiveawayBase {
        GiveawayType giveawayType;
        uint256 id;
        bool automation;
        bool feeToken;
        address feeTokenAddress;
        uint256 startDate;
        bool permissioned;
        uint8 totalWinners;
        bytes provenanceHash;
        uint8 entriesPerUser;
    }

    struct RequestStatus {
        uint256 requestId;
        uint256 paid;
        bool fulfilled;
        uint256[] randomWords;
        uint256 totalLink;
        bool withdrawn;
        uint256 upkeepId;
    }

    struct Prize {
        string prizeName;
        bytes32[] claimedPrizes;
    }

    struct RequestConfig {
        uint32 callbackGasLimit;
        uint16 requestConfirmations;
        uint32 numWords;
        uint32 automationGasLimit;
    }

    struct CreateGiveawayParams {
        string prizeName;
        uint256 timeLength;
        uint256 fee;
        string name;
        address feeToken;
        bytes32 merkleRoot;
        bool automation;
        bytes32[] participants;
        uint8 totalWinners;
        uint8 entriesPerUser;
    }

    //------------------------------ EVENTS ----------------------------------
    event GiveawayCreated(
        string prize,
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
    event GiveawayClosed(uint256 indexed giveawayId, bytes32[] participants);
    event GiveawayStaged(uint256 indexed giveawayId);
    event GiveawayCancelled(uint256 indexed giveawayId);
    event GiveawayWon(uint256 indexed giveawayId, bytes32[] indexed winners);
    event GiveawayPrizeClaimed(
        uint256 indexed giveawayId,
        address indexed winner,
        uint256 value
    );
    event GiveawayOwnerUpdated(
        uint256 indexed giveawayId,
        address oldOwner,
        address newOwner
    );

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyGiveawayOwner(uint256 giveawayId) {
        require(giveaways[giveawayId].owner == msg.sender);
        _;
    }

    constructor(
        address wrapperAddress,
        uint16 requestConfirmations,
        uint32 callbackGasLimit,
        address keeperAddress,
        address linkAddress,
        address registrarAddress,
        uint32 automationGas
    ) VRFV2WrapperConsumerBase(linkAddress, wrapperAddress) {
        require(linkAddress != address(0), "Link Token address cannot be 0x0");
        require(wrapperAddress != address(0), "Wrapper address cannot be 0x0");
        require(
            registrarAddress != address(0),
            "Registrar address cannot be 0x0"
        );
        owner = msg.sender;
        vrfWrapper = VRFV2WrapperInterface(wrapperAddress);
        linkTokenAddress = linkAddress;
        registrar = registrarAddress;
        i_registry = AutomationRegistryInterface(keeperAddress);
        requestConfig = RequestConfig({
            callbackGasLimit: callbackGasLimit,
            requestConfirmations: requestConfirmations,
            numWords: 1,
            automationGasLimit: automationGas
        });
    }

    // ------------------- EXTERNAL FUNCTIONS -------------------

    /**
     * @notice creates new giveaway
     * @param prizeName string of name of prize
     * @param timeLength time length of giveaway in seconds
     * @param fee fee to enter giveaway in wei
     * @param name name of giveaway
     * @param feeToken address of token to use for fee. If 0x0, Gas token will be used
     * @param merkleRoot merkle root for permissioned giveaway
     * @param automation whether giveaway is using Chainlink Automations
     * @param participants array of participants for static giveaway
     * @param totalWinners number of winners for giveaway
     * @param entriesPerUser number of entries per user
     *
     */
    function _createGiveaway(
        address sender,
        string memory prizeName,
        uint256 timeLength,
        uint256 fee,
        string memory name,
        address feeToken,
        bytes32 merkleRoot,
        bool automation,
        bytes32[] memory participants,
        uint8 totalWinners,
        uint8 entriesPerUser
    ) internal whenNotPaused returns (uint256) {
        require(
            totalWinners <= 200,
            "Max total winners must not be greater than 200"
        );
        GiveawayInstance memory newGiveaway = GiveawayInstance({
            base: GiveawayBase({
                giveawayType: participants.length > 0
                    ? GiveawayType.STATIC
                    : GiveawayType.DYNAMIC,
                id: giveawayCounter.current(),
                automation: automation,
                feeToken: feeToken != address(0) ? true : false,
                feeTokenAddress: feeToken,
                startDate: block.timestamp,
                permissioned: merkleRoot != bytes32(0) ? true : false,
                totalWinners: totalWinners,
                provenanceHash: new bytes(0),
                entriesPerUser: entriesPerUser
            }),
            owner: sender,
            giveawayName: name,
            contestants: participants.length > 0
                ? participants
                : new bytes32[](0),
            winners: new bytes32[](0),
            prizeWorth: ud(0),
            timeLength: timeLength,
            fee: fee,
            giveawayState: GiveawayState.LIVE,
            prize: Prize({
                prizeName: prizeName,
                claimedPrizes: new bytes32[](0)
            }),
            paymentNeeded: fee == 0 ? false : true,
            merkleRoot: merkleRoot,
            requestStatus: RequestStatus({
                requestId: 0,
                paid: 0,
                fulfilled: false,
                randomWords: new uint256[](0),
                totalLink: 0,
                withdrawn: false,
                upkeepId: 0
            })
        });
        giveaways[giveawayCounter.current()] = newGiveaway;
        liveGiveaways.add(giveawayCounter.current());
        giveawayCounter.increment();
        emit GiveawayCreated(
            prizeName,
            timeLength,
            fee,
            feeToken,
            merkleRoot != bytes32(0) ? true : false
        );

        return giveawayCounter.current() - 1;
    }

    /**
     * @notice cancels a live giveaway
     * @param giveawayId id of giveaway
     * @dev requires that giveaway is live
     *
     */
    function cancelGiveaway(
        uint256 giveawayId
    ) external onlyGiveawayOwner(giveawayId) {
        require(
            giveaways[giveawayId].giveawayState == GiveawayState.LIVE,
            "Giveaway is not live"
        );
        giveaways[giveawayId].giveawayState = GiveawayState.CANCELLED;
        liveGiveaways.remove(giveawayId);
        emit GiveawayCancelled(giveawayId);
    }

    /**
     * @notice joins giveaway by ID and number of entries
     * @param giveawayId id of giveaway
     * @param entries number of entries
     * @param proof merkle proof
     * @dev requires that giveaway is live and that enough gas token/user token is sent to cover fee
     * @dev if giveaway is permissioned, proof must be provided
     *
     */
    function enterGiveaway(
        uint256 giveawayId,
        uint8 entries,
        bytes32[] memory proof
    ) external payable nonReentrant {
        require(
            giveaways[giveawayId].giveawayState == GiveawayState.LIVE,
            "Giveaway is not live"
        );
        require(
            giveaways[giveawayId].base.giveawayType == GiveawayType.DYNAMIC,
            "Cannot enter static giveaway"
        );
        require(
            entries > 0 && entries <= giveaways[giveawayId].base.entriesPerUser,
            "Too many entries"
        );
        require(
            userEntries[msg.sender][giveawayId] + entries <=
                giveaways[giveawayId].base.entriesPerUser,
            "Too many entries"
        );
        bytes32 _userHash = keccak256(abi.encodePacked(msg.sender));
        if (giveaways[giveawayId].base.permissioned) {
            require(
                proof.verify(giveaways[giveawayId].merkleRoot, _userHash),
                "Not authorized"
            );
        }
        if (
            giveaways[giveawayId].paymentNeeded &&
            giveaways[giveawayId].base.feeToken
        ) {
            IERC20(giveaways[giveawayId].base.feeTokenAddress).safeTransferFrom(
                msg.sender,
                address(this),
                (giveaways[giveawayId].fee * entries)
            );
            giveaways[giveawayId].prizeWorth = giveaways[giveawayId]
                .prizeWorth
                .add(ud(giveaways[giveawayId].fee * entries));
        } else if (giveaways[giveawayId].paymentNeeded) {
            require(
                msg.value >= (giveaways[giveawayId].fee * entries),
                "Not enough gas token to join giveaway"
            );
            giveaways[giveawayId].prizeWorth = giveaways[giveawayId]
                .prizeWorth
                .add(ud(msg.value));
        }
        for (uint256 i = 0; i < entries; i++) {
            giveaways[giveawayId].contestants.push(_userHash);
        }
        userEntries[msg.sender][giveawayId] += entries;
        emit GiveawayJoined(giveawayId, _userHash, entries);
    }

    /**
     * @notice gets the winner of a specific giveaway
     * @param giveawayId id of the giveaway
     * @return address of the winner
     *
     */
    function getWinners(
        uint256 giveawayId
    ) external view returns (bytes32[] memory) {
        return giveaways[giveawayId].winners;
    }

    /**
     * @notice claims prize for a specific giveaway
     * @param giveawayId id of the giveaway
     * @dev requires that giveaway is finished and that the caller is the winner
     *
     */
    function claimPrize(uint256 giveawayId) external nonReentrant {
        require(
            giveaways[giveawayId].giveawayState == GiveawayState.FINISHED,
            "Giveaway is not finished"
        );
        require(
            intoUint256(giveaways[giveawayId].prizeWorth) > 0,
            "No prize to claim"
        );
        bytes32 _claimer = keccak256(abi.encodePacked(msg.sender));
        bool eligible = false;
        for (uint256 i = 0; i < giveaways[giveawayId].winners.length; i++) {
            if (giveaways[giveawayId].winners[i] == _claimer) {
                eligible = true;
                break;
            }
        }
        require(eligible, "You are not eligible to claim this prize");
        for (
            uint256 i = 0;
            i < giveaways[giveawayId].prize.claimedPrizes.length;
            i++
        ) {
            require(
                giveaways[giveawayId].prize.claimedPrizes[i] != _claimer,
                "Prize already claimed"
            );
        }
        // total claimable based on total prize pool divided by total winners using fixed point math
        uint256 _total = intoUint256(
            giveaways[giveawayId].prizeWorth.div(
                ud(giveaways[giveawayId].base.totalWinners * 1e18)
            )
        );
        if (giveaways[giveawayId].base.feeToken) {
            // custom token transfer
            giveaways[giveawayId].prize.claimedPrizes.push(_claimer);
            emit GiveawayPrizeClaimed(giveawayId, msg.sender, _total);
            IERC20(giveaways[giveawayId].base.feeTokenAddress).safeTransfer(
                msg.sender,
                _total
            );
        } else if (giveaways[giveawayId].fee > 0) {
            // gas token transfer
            giveaways[giveawayId].prize.claimedPrizes.push(_claimer);
            emit GiveawayPrizeClaimed(giveawayId, msg.sender, _total);
            (bool success, ) = msg.sender.call{value: _total}("");
            require(success, "Transfer failed.");
        }
    }

    /**
     * @notice Creates a new giveaway/Creates Upkeep | Picks random numbers
     * @dev Uses Chainlink VRF direct funding to generate random number paid by giveaway owner.
     *
     */
    function onTokenTransfer(
        address sender,
        uint256 value,
        bytes calldata data
    ) external {
        require(
            msg.sender == address(linkTokenAddress),
            "Sender must be LINK address"
        );
        if (data.length == 32) {
            uint256 _giveaway = abi.decode(data, (uint256));
            require(
                giveaways[_giveaway].owner == sender,
                "Only owner can pick winner"
            );
            require(
                _eligableToEnd(_giveaway),
                "Not enough contestants to pick winner"
            );
            require(
                giveaways[_giveaway].giveawayState != GiveawayState.FINISHED,
                "Giveaway is already finished"
            );
            _pickWinner(_giveaway, value);
        } else {
            CreateGiveawayParams memory _params = abi.decode(
                data,
                (CreateGiveawayParams)
            );

            uint256 _id = _createGiveaway(
                sender,
                _params.prizeName,
                _params.timeLength,
                _params.fee,
                _params.name,
                _params.feeToken,
                _params.merkleRoot,
                _params.automation,
                _params.participants,
                _params.totalWinners,
                _params.entriesPerUser
            );
            string memory name = string(
                abi.encodePacked("Giveaway ", Strings.toString(_id))
            );
            _registerAutomation(
                name,
                requestConfig.automationGasLimit,
                abi.encode(_id),
                uint96(value),
                0
            );
        }
    }

    /**
     * @notice checks status of contract
     * @return bool paused status
     *
     */
    function isPaused() external view returns (bool) {
        return paused();
    }

    /**
     * @notice pauses contract
     * @dev only owner can call
     *
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice unpauses contract
     * @dev only owner can call
     *
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice get giveaway by ID
     * @param giveawayId giveaway id
     * @return giveaway instance
     *
     */
    function getGiveaway(
        uint256 giveawayId
    ) external view returns (GiveawayInstance memory) {
        return giveaways[giveawayId];
    }

    /**
     * @notice get all giveaways
     * @return GiveawayInstance[] of all giveaways
     *
     */
    function getAllGiveaways()
        external
        view
        returns (GiveawayInstance[] memory)
    {
        GiveawayInstance[] memory _giveaways = new GiveawayInstance[](
            giveawayCounter.current()
        );
        for (uint256 i = 0; i < giveawayCounter.current(); i++) {
            _giveaways[i] = giveaways[i];
        }
        return _giveaways;
    }

    /**
     * @notice get all owner giveaways
     * @param giveawayOwner address of the giveaway owner
     * @return GiveawayInstance[] of all owner giveaways
     *
     */
    function getOwnerGiveaways(
        address giveawayOwner
    ) external view returns (GiveawayInstance[] memory) {
        uint256 _index = 0;
        for (uint256 i = 0; i < giveawayCounter.current(); i++) {
            if (giveaways[i].owner == giveawayOwner) {
                _index++;
            }
        }
        GiveawayInstance[] memory _giveaways = new GiveawayInstance[](_index);
        uint256 _index2 = 0;
        for (uint256 i = 0; i < giveawayCounter.current(); i++) {
            if (giveaways[i].owner == giveawayOwner) {
                _giveaways[_index2] = giveaways[i];
                _index2++;
            }
        }
        return _giveaways;
    }

    /**
     * @notice get amount of entries for a user in a specific giveaway
     * @param giveawayId id of the giveaway
     * @param user address of the user
     * @return uint256 amount of entries
     *
     */
    function getUserEntries(
        uint256 giveawayId,
        address user
    ) external view returns (uint256) {
        return userEntries[user][giveawayId];
    }

    /**
     * @notice update admin of a specific giveaway
     * @param giveawayId id of the giveaway
     * @param newAdmin address of the new admin
     *
     */
    function updateGiveawayOwner(
        uint256 giveawayId,
        address newAdmin
    ) external onlyGiveawayOwner(giveawayId) {
        giveaways[giveawayId].owner = newAdmin;
        emit GiveawayOwnerUpdated(giveawayId, msg.sender, newAdmin);
    }

    /**
     * @notice withdraw unspent LINK from giveaway
     * @param giveawayId id of the giveaway
     * @dev must be owner of giveaway to withdraw LINK from giveaway instance
     */
    function withdrawLink(
        uint256 giveawayId
    ) external onlyGiveawayOwner(giveawayId) nonReentrant {
        require(
            !giveaways[giveawayId].requestStatus.withdrawn,
            "Already withdrawn"
        );
        IERC20 link = IERC20(linkTokenAddress);
        uint256 claimable = giveaways[giveawayId].requestStatus.totalLink -
            giveaways[giveawayId].requestStatus.paid;
        require(claimable > 0, "Nothing to claim");
        giveaways[giveawayId].requestStatus.withdrawn = true;
        link.safeTransfer(msg.sender, claimable);
    }

    /**
     * @notice returns the amount of claimable LINK for a specific giveaway
     * @param giveawayId id of the giveaway
     * @return claimable amount of claimable LINK
     * @dev claimable LINK is the total LINK sent to the giveaway minus the amount already paid on VRF fees
     *
     */
    function claimableLink(
        uint256 giveawayId
    ) external view returns (uint256 claimable) {
        if (giveaways[giveawayId].requestStatus.withdrawn) {
            return 0;
        }
        claimable =
            giveaways[giveawayId].requestStatus.totalLink -
            giveaways[giveawayId].requestStatus.paid;
    }

    /**
     * @notice returns the amount of claimable LINK from upkeep
     * @param giveawayId id of the giveaway
     * @return claimable amount of claimable LINK
     * @dev claimable LINK is the total LINK available to withdraw from the upkeep contract
     *
     */
    function claimableAutomation(
        uint256 giveawayId
    ) external view returns (uint256 claimable) {
        (, , , uint96 balance, , , , ) = i_registry.getUpkeep(
            giveaways[giveawayId].requestStatus.upkeepId
        );
        claimable = balance;
    }

    function _registerAutomation(
        string memory name,
        uint32 gasLimit,
        bytes memory checkData,
        uint96 amount,
        uint8 source
    ) internal {
        uint256 giveawayId = abi.decode(checkData, (uint256));
        (State memory state, Config memory _c, address[] memory _k) = i_registry
            .getState();
        uint256 oldNonce = state.nonce;
        bytes memory payload = abi.encode(
            name,
            bytes(""),
            address(this),
            gasLimit,
            giveaways[giveawayId].owner,
            checkData,
            amount,
            source,
            address(this)
        );
        LinkTokenInterface(linkTokenAddress).transferAndCall(
            registrar,
            amount,
            bytes.concat(registerSig, payload)
        );
        (state, _c, _k) = i_registry.getState();
        uint256 newNonce = state.nonce;
        if (newNonce == oldNonce + 1) {
            uint256 upkeepID = uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        address(i_registry),
                        uint32(oldNonce)
                    )
                )
            );

            giveaways[giveawayId].requestStatus.upkeepId = upkeepID;
        } else {
            revert("auto-approve disabled");
        }
    }

    // ------------------- INTERNAL FUNCTIONS -------------------

    /**
     * @notice closes giveaway and picks winner
     * @param giveawayId id of giveaway
     * @dev requests random number from VRF and marks giveaway as finished
     *
     */
    function _pickWinner(uint256 giveawayId, uint256 value) internal {
        giveaways[giveawayId].requestStatus.totalLink += value;
        giveaways[giveawayId].giveawayState = GiveawayState.RESOLVING;
        _requestRandomWords(giveawayId, value);

        emit GiveawayClosed(giveawayId, giveaways[giveawayId].contestants);
    }

    function _shuffle(
        bytes32[] memory array,
        uint256 random
    ) internal pure returns (bytes32[] memory) {
        uint256 lastIndex = array.length - 1;
        bytes32 n_random = keccak256(abi.encodePacked(random));
        while (lastIndex > 0) {
            uint256 r_index = uint256(keccak256(abi.encode(n_random))) %
                lastIndex;
            bytes32 temp = array[lastIndex];
            array[lastIndex] = array[r_index];
            array[r_index] = temp;
            n_random = keccak256(abi.encodePacked(n_random));
            lastIndex--;
        }
        return array;
    }

    /**
     * @param randomValue random value generated by VRF
     *
     */
    function _pickRandom(
        uint256 randomValue,
        uint256 giveawayId
    ) internal view returns (bytes32[] memory) {
        bytes32[] memory shuffled = _shuffle(
            giveaways[giveawayId].contestants,
            randomValue
        );

        bytes32[] memory winners = new bytes32[](
            giveaways[giveawayId].base.totalWinners
        );
        for (uint256 i = 0; i < winners.length; i++) {
            winners[i] = shuffled[i];
        }

        return winners;
    }

    /**
     * @notice Updates live giveaways array when one finishes.
     */
    function _updateLiveGiveaways(uint256 _index) internal {
        liveGiveaways.remove(_index);
    }

    function _requestRandomWords(
        uint256 giveawayId,
        uint256 value
    ) internal returns (uint256 requestId) {
        requestId = requestRandomness(
            requestConfig.callbackGasLimit,
            requestConfig.requestConfirmations,
            requestConfig.numWords
        );
        emit GiveawayStaged(giveawayId);
        requestIdToGiveawayIndex[requestId] = giveawayId;
        giveaways[giveawayId].requestStatus = RequestStatus({
            requestId: requestId,
            paid: vrfWrapper.calculateRequestPrice(
                requestConfig.callbackGasLimit
            ),
            randomWords: new uint256[](0),
            fulfilled: false,
            totalLink: value,
            withdrawn: false,
            upkeepId: giveaways[giveawayId].requestStatus.upkeepId
        });

        return requestId;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 giveawayIndexFromRequestId = requestIdToGiveawayIndex[
            requestId
        ];
        giveaways[giveawayIndexFromRequestId]
            .requestStatus
            .randomWords = randomWords;
        giveaways[giveawayIndexFromRequestId].requestStatus.fulfilled = true;
        _updateLiveGiveaways(giveawayIndexFromRequestId);
    }

    /**
     * @dev used if automation is set to true for giveaway or to pick winner
     * @dev user will need to set up an upkeep and include the giveaway ID in the checkData
     * @dev the performData will be the giveaway ID and the winners. Winners are passed to the performUpkeep function
     *
     */
    function checkUpkeep(
        bytes calldata checkData
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint256 giveawayId = abi.decode(checkData, (uint256));
        if (giveaways[giveawayId].giveawayState == GiveawayState.RESOLVING) {
            bytes32[] memory winners = _pickRandom(
                giveaways[giveawayId].requestStatus.randomWords[0],
                giveawayId
            );
            performData = abi.encode(giveawayId, winners);
            upkeepNeeded = true;
        }
        if (
            giveaways[giveawayId].giveawayState == GiveawayState.LIVE &&
            giveaways[giveawayId].base.automation
        ) {
            upkeepNeeded =
                (block.timestamp - giveaways[giveawayId].base.startDate) >
                giveaways[giveawayId].timeLength;
            performData = abi.encode(giveawayId, new bytes32[](0));
        }
    }

    /**
     * @dev used if automation is set to true for giveaway or to pick winner.
     * @dev will stage the giveaway if the time has passed and allow for owner to call VRF
     * @dev will pick winner if the giveaway is in the RESOLVING state
     *
     */
    function performUpkeep(bytes calldata performData) external override {
        (uint256 giveawayId, bytes32[] memory winners) = abi.decode(
            performData,
            (uint256, bytes32[])
        );

        if (giveaways[giveawayId].giveawayState == GiveawayState.RESOLVING) {
            for (uint256 i = 0; i < winners.length; i++) {
                giveaways[giveawayId].winners.push(winners[i]);
            }
            giveaways[giveawayId].giveawayState = GiveawayState.FINISHED;
            emit GiveawayWon(giveawayId, giveaways[giveawayId].winners);
        } else {
            if (
                giveaways[giveawayId].giveawayState == GiveawayState.LIVE &&
                giveaways[giveawayId].base.automation
            ) {
                if (
                    (block.timestamp - giveaways[giveawayId].base.startDate) >
                    giveaways[giveawayId].timeLength
                ) {
                    // Check if the number of participants is less than the number of winners
                    if (
                        giveaways[giveawayId].contestants.length <
                        giveaways[giveawayId].base.totalWinners
                    ) {
                        giveaways[giveawayId].giveawayState = GiveawayState
                            .CANCELLED;
                        emit GiveawayCancelled(giveawayId);
                    } else {
                        giveaways[giveawayId].giveawayState = GiveawayState
                            .STAGED;
                        emit GiveawayStaged(giveawayId);
                    }
                }
            }
        }
    }

    /**
     * @notice checks if giveaway is eligable to end
     * @param giveawayId id of the giveaway
     * @return bool eligable to end
     * @dev eligable to end is when the amount of contestants is greater than or equal to the amount of winners
     * @dev this is used so there is not a div/modulo by 0 error
     *
     */
    function _eligableToEnd(uint256 giveawayId) internal view returns (bool) {
        return
            giveaways[giveawayId].contestants.length >=
            giveaways[giveawayId].base.totalWinners;
    }

    // ------------------- OWNER FUNCTIONS -------------------

    function setProvenanceHash(
        uint256 giveawayId,
        bytes memory provenanceHash
    ) external onlyGiveawayOwner(giveawayId) {
        require(
            giveaways[giveawayId].base.provenanceHash.length == 0,
            "provenance hash already set"
        );

        giveaways[giveawayId].base.provenanceHash = provenanceHash;
    }

    /**
     * @notice updates the callback gas limit
     * @param newGasLimit new gas limit
     * @dev this is used to update the gas limit if the VRF contract is updated
     */
    function updateVRFCallBackGasLimit(uint32 newGasLimit) external onlyOwner {
        requestConfig.callbackGasLimit = newGasLimit;
    }

    /**
     * @notice updates the callback gas limit
     * @param newGasLimit new gas limit
     * @dev this is used to update the gas limit of Automation registration
     */
    function updateAutomationCallBackGasLimit(
        uint32 newGasLimit
    ) external onlyOwner {
        requestConfig.automationGasLimit = newGasLimit;
    }
}
