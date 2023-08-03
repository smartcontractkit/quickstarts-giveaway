import { BigNumber } from 'ethers'
export enum GiveawayStatus {
  STAGED = 0,
  LIVE = 1,
  FINISHED = 2,
  RESOLVING = 3,
  CANCELLED = 4
}

export enum GiveawayType {
  DYNAMIC = 0,
  STATIC = 1
}

export interface GiveawayInstance {
  id: string
  name: string // bytes32
  type: GiveawayType
  status: GiveawayStatus
  owner: string // address
  startDate: string
  hours: number
  entriesPerUser: number // uint8
  totalWinners: number // uint8
  prizeName: string
  prizeWorth: string // denominated in: feeTokenAddress ? feeTokenAddress : eth address
  paymentNeeded: boolean
  fee: string
  feeTokenAddress: string // address
  automation: boolean
  merkleRoot: string // bytes32
  permissioned: boolean
  provenanceHash: string // bytes
  contestantsAddresses: Array<string> // bytes32[]
  winners: Array<string> // bytes32[]
  claimedPrizes: Array<string> // bytes32[]
  withdrawn: boolean
  upkeepId: BigNumber
}
