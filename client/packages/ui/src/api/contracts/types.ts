import { BigNumber } from 'ethers'

export interface ClaimPrizeParams {
  id: number
}

export interface EnterGiveawayParams {
  id: number
  entries?: number
  proof?: string[]
  fee: string
}

export interface CreateGiveawayParams {
  value: BigNumber // link amount for funding txn
  prizeName: string
  timeLength?: number // time length
  fee: string
  name: string
  feeToken: string
  merkleRoot?: string // merkle root bytes32 hexadicimal
  automation?: boolean
  participants?: string[] // participants array of bytes32 hexadicimal
  totalWinners: number
  entriesPerUser?: number
}

export interface CancelGiveawayParams {
  id: number
}

export interface ResolveGiveawayParams {
  id: number
  value: BigNumber // link amount for funding txn
}

export interface WithdrawLinkParams {
  id: number
}

export interface CancelUpkeepParams {
  upkeepId: string // keeper id
}

export interface WithdrawFundsParams {
  upkeepId: string // keeper id
  address: string // address to withdraw funds to
}
