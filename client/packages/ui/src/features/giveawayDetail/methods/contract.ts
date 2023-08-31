import { BigNumber } from 'ethers'

import { contracts } from '@ui/api'

export const getGiveaway = async (
  { id, asyncManager, update },
  returnGiveaway = false
) => {
  try {
    asyncManager.start()

    const giveaway = await contracts.getGiveaway(id)

    asyncManager.success()

    if (returnGiveaway) return giveaway

    update({ giveaway })
    return true
  } catch (error) {
    asyncManager.fail(`Could not get giveaway id \`${id}\``)
    if (returnGiveaway) return null
    return false
  }
}

export const cancelGiveaway = async ({ id, asyncManager, update, success }) => {
  try {
    asyncManager.start()

    const payload: contracts.CancelGiveawayParams = { id }
    const { wait } = await contracts.cancelGiveaway(payload)

    asyncManager.waiting()

    const isSuccess = await wait().then((receipt) => receipt.status === 1)
    if (!isSuccess)
      throw new Error('Request to cancel giveaway was not successful')

    asyncManager.success()

    const giveaway = await getGiveaway({ id, asyncManager, update }, true)

    success(true)

    return { giveaway }
  } catch (error) {
    asyncManager.fail(`Could not cancel giveaway id \`${id}\``)
    return {}
  }
}

export const claimPrize = async ({ id, asyncManager, update }) => {
  try {
    asyncManager.start()

    const payload: contracts.ClaimPrizeParams = { id }
    const { wait } = await contracts.claimPrize(payload)

    asyncManager.waiting()

    const isSuccess = await wait().then((receipt) => receipt.status === 1)
    if (!isSuccess) throw new Error('Request to claim prize was not successful')

    asyncManager.success()

    const giveaway = await getGiveaway({ id, asyncManager, update }, true)

    return { giveaway }
  } catch (error) {
    asyncManager.fail(`Could not claim prize on giveaway id \`${id}\``)
    return {}
  }
}

export const joinGiveaway = async ({
  id,
  fee,
  asyncManager,
  update,
  success
}) => {
  try {
    asyncManager.start()

    const payload: contracts.EnterGiveawayParams = { id, fee }
    const { wait } = await contracts.enterGiveaway(payload)

    asyncManager.waiting()

    const isSuccess = await wait().then((receipt) => receipt.status === 1)
    if (!isSuccess)
      throw new Error('Request to join giveaway was not successful')

    asyncManager.success()

    await getGiveaway({ id, asyncManager, update })

    success(true)
    return true
  } catch (error) {
    asyncManager.fail(`Could not join giveaway id \`${id}\``)
    return false
  }
}

export const pickWinners = async ({ id, asyncManager, success, txHash }) => {
  try {
    /*
     * @FeatureEnhancement
     * For now we harcode value to 10 LINK to cover all reasonable cases for funding the txn.
     * Later we will need to have this be smarter, as the actual amount required is variable.
     * The risk of a high fixed amount is offset both by (a) initial deployment is on eth goerli
     * and (b) the owner can withdraw excess link amount after the giveaway has been resolved.
     */
    asyncManager.start()
    let update: boolean
    const giveaway = await getGiveaway({ id, asyncManager, update }, true)
    if (typeof giveaway === 'object') {
      const totalWinners = giveaway.totalWinners as number
      const totalPar = giveaway.contestantsAddresses as string[]
      if (totalWinners > totalPar.length) {
        throw new Error(
          `Total winners cannot be greater than total participants`
        )
      }
    }
    const value = BigNumber.from('100000000000000000') // 0.1 LINK
    const payload: contracts.ResolveGiveawayParams = { id, value }
    const { wait, hash } = await contracts.resolveGiveaway(payload)

    asyncManager.waiting()

    const isSuccess = await wait().then((receipt) => receipt.status === 1)
    if (!isSuccess)
      throw new Error('Request to pick winners was not successful')

    asyncManager.success()

    txHash(hash)

    success(true)
    return true
  } catch (error) {
    asyncManager.fail(`
    Could not pick winners for giveaway id \`${id}\` \n${error}`)
    return false
  }
}

export const withdrawLink = async ({ id, asyncManager, success, update }) => {
  try {
    asyncManager.start()

    const payload: contracts.WithdrawLinkParams = { id }
    const { wait } = await contracts.withdrawLink(payload)

    asyncManager.waiting()

    const isSuccess = await wait().then((receipt) => receipt.status === 1)
    if (!isSuccess)
      throw new Error('Request to withdraw LINK was not successful')

    asyncManager.success()

    await getGiveaway({ id, asyncManager, update })

    success(true)
    return true
  } catch (error) {
    asyncManager.fail(`Could not withdraw LINK for giveaway id \`${id}\``)
    return false
  }
}

export const getClaimableLink = async ({ id, asyncManager, update }) => {
  try {
    asyncManager.start()

    const claimableLink: number = await contracts.getClaimableLink(id)

    asyncManager.success()

    update({ claimableLink })
    return true
  } catch (error) {
    asyncManager.fail(
      `Could not determine how much LINK is able to be withdrawn for giveaway id \`${id}\`.`
    )
    return false
  }
}

export const cancelUpkeep = async ({
  id,
  upkeepId,
  asyncManager,
  success,
  update
}) => {
  try {
    asyncManager.start()

    const payload: contracts.CancelUpkeepParams = { upkeepId }
    const { wait } = await contracts.cancelUpkeep(payload)

    asyncManager.waiting()

    const isSuccess = await wait().then((receipt) => receipt.status === 1)
    if (!isSuccess)
      throw new Error('Request to cancel upkeep was not successful')

    asyncManager.success()

    await getGiveaway({ id, asyncManager, update })
    success(true)

    return true
  } catch (error) {
    asyncManager.fail(`Upkeep has already been cancelled`)
    return false
  }
}

export const getClaimableAutomation = async ({ id, asyncManager, update }) => {
  try {
    asyncManager.start()

    const claimableAutomation: number = await contracts.getClaimableAutomation(
      id
    )

    asyncManager.success()

    update({ claimableAutomation })
    return true
  } catch (error) {
    asyncManager.fail(
      `Could not determine how much LINK is able to be withdrawn from keeper for giveaway id \`${id}\`.`
    )
    return false
  }
}

export const withdrawFunds = async ({
  id,
  upkeepId,
  address,
  asyncManager,
  success,
  update
}) => {
  try {
    asyncManager.start()

    const payload: contracts.WithdrawFundsParams = { upkeepId, address }
    const { wait } = await contracts.withdrawFunds(payload)

    asyncManager.waiting()

    const isSuccess = await wait().then((receipt) => receipt.status === 1)
    if (!isSuccess)
      throw new Error('Request to withdraw LINK was not successful')

    asyncManager.success()

    await getGiveaway({ id, asyncManager, update })

    success(true)
    return true
  } catch (error) {
    asyncManager.fail(`Could not withdraw LINK for giveaway id \`${id}\``)
    return false
  }
}
