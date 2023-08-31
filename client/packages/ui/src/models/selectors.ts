import { GiveawayInstance, GiveawayType, GiveawayStatus } from '@ui/models'

export const filterGiveawayList = (list, filters): GiveawayInstance[] =>
  list.filter((giveaway) => filters.every((filter) => filter(giveaway)))

export const isGiveawayOwner = (giveaway, account): boolean =>
  giveaway?.owner === account

export const isGiveawayParticipant = (giveaway, account): boolean => {
  return giveaway?.contestantsAddresses.includes(account)
}

export const isGiveawayWinner = (giveaway, account): boolean =>
  giveaway?.winners.includes(account)

export const isGiveawayClaimedPrize = (giveaway, account): boolean =>
  giveaway?.claimedPrizes.includes(account)

export const isGiveawayStatic = (giveaway): boolean =>
  giveaway?.type === GiveawayType.STATIC

export const isGiveawayDynamic = (giveaway): boolean =>
  giveaway?.type === GiveawayType.DYNAMIC

export const isGiveawayStaged = (giveaway): boolean =>
  giveaway?.status === GiveawayStatus.STAGED

export const isGiveawayLive = (giveaway): boolean =>
  giveaway?.status === GiveawayStatus.LIVE

export const isGiveawayFinished = (giveaway): boolean =>
  giveaway?.status === GiveawayStatus.FINISHED

export const isGiveawayResolving = (giveaway): boolean =>
  giveaway?.status === GiveawayStatus.RESOLVING

export const isGiveawayCancelled = (giveaway): boolean =>
  giveaway?.status === GiveawayStatus.CANCELLED
