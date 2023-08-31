import { GiveawayInstance } from '@ui/models'
import { ethers } from 'ethers'

export const transformGiveawayItem = (giveaway): GiveawayInstance => {
  try {
    return {
      id: giveaway.base.id.toString(),
      name: giveaway[2],
      type: giveaway.base.giveawayType,
      status: giveaway.giveawayState,
      owner: giveaway.owner,
      startDate: giveaway.base.startDate.toString(),
      hours: giveaway.timeLength.toString() / 60 / 60,
      entriesPerUser: giveaway.base.entriesPerUser,
      totalWinners: giveaway.base.totalWinners,
      prizeName: giveaway.prize.prizeName,
      prizeWorth: ethers.utils.formatEther(giveaway.prizeWorth.toString()),
      paymentNeeded: giveaway.paymentNeeded,
      fee: ethers.utils.formatEther(giveaway.fee.toString()),
      feeTokenAddress: giveaway.base.feeTokenAddress,
      automation: giveaway.base.automation,
      merkleRoot: giveaway.merkleRoot,
      permissioned: giveaway.base.permissioned,
      provenanceHash: giveaway.base.provenanceHash,
      contestantsAddresses: giveaway.contestants,
      winners: giveaway.winners,
      claimedPrizes: giveaway.prize.claimedPrizes,
      withdrawn: giveaway.requestStatus.withdrawn,
      upkeepId: giveaway.requestStatus.upkeepId
    }
  } catch (error: any) {
    throw new Error(`Error transforming giveaway item: ${error.message}`)
  }
}

export const transformGiveawayList = (giveawayList): GiveawayInstance[] => {
  return giveawayList.map((giveawayInstance) => {
    return transformGiveawayItem(giveawayInstance)
  })
}

export const transformClaimable = (data): number =>
  parseFloat(ethers.utils.formatEther(data?._hex))
