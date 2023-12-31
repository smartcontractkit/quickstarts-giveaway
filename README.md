# Giveaway Manager (Automation + VRF)

## I. About

The app is a highly configurable proof of concept for provably-fair giveaways using Chainlink Automation and VRF. It is capable of drawing winners from a CSV list or onchain entries utilizing Chainlink VRF Direct Funding and Automation. Fulfillment is not included and this app is for provably fair selection purposes only.

![image](https://i.imgur.com/lCIAVrR.png)

Recommended Networks:

- Ethereum Mainnet
- Ethereum Goerli
- Polygon Mainnet
- Polygon Mumbai

It is recommened to start with a testnet deployment to get familar with the functionality before deploying to mainnets.

## II. Pre-requisites

### 1. Clone repo

```bash
$ git clone https://github.com/smartcontractkit/quickstart-giveaway.git
```

### 2. Create block explorer API key

- [Etherscan](https://docs.etherscan.io/getting-started/viewing-api-usage-statistics)
- [Polyscan](https://docs.polygonscan.com/getting-started/viewing-api-usage-statistics)

### 3. Setup contracts environment variables

Setup an `env` variables

```bash
# <root>/contracts
$ touch .env
$ open .env
# Consider using a secure env management package instead
# Make sure this is untracked if you're going to push to your own repo
```

```bash
# Do NOT use quotes to assign values!

# Network RPCs
export RPC_URL=

# Private key for contract deployment
export PRIVATE_KEY=

# Explorer API key used to verify contracts
export EXPLORER_KEY=
```

### 4. Setup Wallet

Install any wallet to your browser (currently supports Metamask)

## III. Setup (for public network deployments)

### 1. Setup Foundry

[Installation instructions](https://book.getfoundry.sh/getting-started/installation)

```bash
# Download foundry
$ curl -L https://foundry.paradigm.xyz | bash

# Install foundry
$ foundryup

# (Mac) Install anvil (prereq: Homebrew)
$ brew install libusb
```

### 2. Install contract dependencies if changes have been made to contracts

```bash
# <root>/contracts
$ make install
```

### 4. Deploy contract

```bash
# <root>/contracts
$ make deploy
```

**Note:** Save the deployed contract address from your terminal output, you'll need for step 6.

### 5. Install UI dependencies

```bash
# <root>/client
# (Mac) you may need to run 'source ~/.nvm/nvm.sh'
$ nvm use
$ yarn
```

### 6. Run UI

Prepare your UI `env` variables for export (needed for each time you want to run UI):

- Giveaway Contract Manager Address from Step 4 "Deploy Contract"
- Token Contract Addresses can be found [here](https://docs.chain.link/resources/link-token-contracts)
- Keeper Registry Contract Addresses (currently only Automation v1.2 supported): `0x02777053d6764996e594c3E88AF1D58D5363a2e6` 

```bash
# <root>/client/packages/ui
# run these commands to set up your env vars (do not use quotes to assign values):
$ export UI_GIVEAWAY_MANAGER_CONTRACT_ADDRESS=
$ export UI_LINK_TOKEN_CONTRACT_ADDRESS=
$ export UI_KEEPER_REGISTRY_CONTRACT_ADDRESS=
$ yarn start
```

### 7. View UI

- Open browser at [localhost:3005](localhost:3005)

## IV. Testing

### 1. Test Contracts

```bash
# <root>/contracts
make test-contracts-all
```

### 2. Test UI

```bash
# <root>/client/packages/ui
$ yarn test
$ yarn tsc
$ yarn lint
$ yarn prettier
```

### 8. Notes

#### 1. Balance Amounts

As a creator of a giveaway, the minimum token requirments are needed to ensure that your giveaway is created and finished without issues. All unused LINK token amounts are able to be withdrawn after completion of giveaway.

- 5.1 LINK
  - 0.1 (VRF request)
  - 5 (Automation subscription)

#### 2. Giveaway Status

After picking winners is initiated in the UI, the status of the giveaway is moved to `pending`. Each subsequent block is then checked to see if the VRF request has been finished and winners picked. Once found, the status is automatically moved to `finished`. The winners are then able to be viewed and leftover LINK is able to be withdrawn.

#### 3. Developer Integration for Entering Dynamic Giveaway

The Giveaway contract is able to be integrated with any application that is able to send a transaction to the contract. The user will need to call the `enterGiveaway` function with the following parameters:

- `giveawayId` - The ID of the giveaway that the user is entering
- `entries` - The amount of entries the user is purchasing
- `proof` The merkle proof of the user's entry if the giveaway is permissioned

This is how the UI in this repo calls the `enterGiveaway` function using `wagmi`:

```javascript
export const enterGiveaway = async (params: contracts.EnterGiveawayParams) => {
  try {
    const { id, proof, fee } = params
    const config = await prepareWriteContract({
      address: giveawayManagerContractAddress,
      abi: giveawayManagerABI,
      functionName: 'enterGiveaway',
      overrides: {
        value: ethers.utils.parseEther(fee)
      },
      args: [id, params.entries ? params.entries : 1, proof ? proof : []]
    })
    const data = await writeContract(config)
    return data
  } catch (error: any) {
    throw new Error(`Error entering giveaway: ${error.message}`)
  }
}

export interface EnterGiveawayParams {
  id: number
  entries?: number
  proof?: string[]
  fee: string
}
```
> :warning: **Disclaimer**: "This repository represents an example of using a Chainlink product or service and is provided to help you understand how to interact with Chainlink’s systems and services so that you can integrate them into your own. This template is provided “AS IS” and “AS AVAILABLE” without warranties of any kind, has not been audited, and may be missing key checks or error handling to make the usage of the product more clear. Do not use the code in this example in a production environment without completing your own audits and application of best practices. Neither Chainlink Labs, the Chainlink Foundation, nor Chainlink node operators are responsible for unintended outputs that are generated due to errors in code."
