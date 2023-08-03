//SPDX-License-Identifier: MIT
pragma solidity <=0.8.17;

contract AutomationMock {
    State public state;
    Config public config = Config(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, address(0), address(0));

    struct Config {
        uint32 paymentPremiumPPB;
        uint32 flatFeeMicroLink; // min 0.000001 LINK, max 4294 LINK
        uint24 blockCountPerTurn;
        uint32 checkGasLimit;
        uint24 stalenessSeconds;
        uint16 gasCeilingMultiplier;
        uint96 minUpkeepSpend;
        uint32 maxPerformGas;
        uint256 fallbackGasPrice;
        uint256 fallbackLinkPrice;
        address transcoder;
        address registrar;
    }

    struct State {
        uint32 nonce;
        uint96 ownerLinkBalance;
        uint256 expectedLinkBalance;
        uint256 numUpkeeps;
    }

    constructor() {
        state = State(0, 0, 0, 0);
    }

    function getState() external view returns (State memory, Config memory, address[] memory) {
        return (state, config, new address[](0));
    }

    function onTokenTransfer(address sender, uint256 value, bytes calldata data) external {
        state = State(1, 0, 0, 0);
    }

    function getUpkeep(uint256 id)
        external
        view
        returns (
            address target,
            uint32 executeGas,
            bytes memory checkData,
            uint96 balance,
            address lastKeeper,
            address admin,
            uint64 maxValidBlocknumber,
            uint96 amountSpent,
            bool paused
        )
    {
        return (address(0), 0, new bytes(0), 0, address(0), address(0), 0, 0, false);
    }
}
