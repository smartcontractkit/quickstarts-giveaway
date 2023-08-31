// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

interface IGiveawayManager {
    function enterGiveaway(
        uint256 giveawayId,
        uint8 entries,
        bytes32[] memory proof
    ) external payable;

    function getWinners(
        uint256 giveawayId
    ) external view returns (bytes32[] memory);

    function claimPrize(uint256 giveawayId) external;

    function setProvenanceHash(
        uint256 giveawayId,
        bytes memory provenanceHash
    ) external;

    function withdrawLink(uint256 giveawayId) external;

    function claimableLink(
        uint256 giveawayId
    ) external view returns (uint256 claimable);

    function updateGiveawayOwner(uint256 giveawayId, address newAdmin) external;

    function isPaused() external view returns (bool);

    function pause() external;

    function unpause() external;
}
