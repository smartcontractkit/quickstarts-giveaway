import { contracts } from '@ui/api'

export const getGiveawayList = async ({ asyncManager, update }) => {
  try {
    asyncManager.start()
    const list = await contracts.getAllGiveaways()
    asyncManager.success()
    update({ list })
  } catch (error) {
    asyncManager.fail(
      `Could not get giveaway list, please check your're connected to the correct network.`
    )
  }
}
