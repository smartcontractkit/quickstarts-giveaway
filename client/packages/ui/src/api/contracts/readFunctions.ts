import { readContract } from '@wagmi/core'
import { useEffect } from 'react'
import { useContractRead } from 'wagmi'
import { env } from '@ui/config'
import {
  transformGiveawayItem,
  transformGiveawayList,
  transformClaimable,
  GiveawayInstance
} from '@ui/models'
import abi from './abi/GiveawayManager.json'

const giveawayManagerContractAddress = env.giveawayManagerContractAddress()
const linkTokenContractAddress = env.linkTokenContractAddress()
const defaultOptions = { abi, watch: true }

export const getAllGiveaways = async (): Promise<GiveawayInstance[]> => {
  try {
    const data = await readContract({
      ...defaultOptions,
      address: giveawayManagerContractAddress,
      functionName: 'getAllGiveaways'
    })
    return transformGiveawayList(data)
  } catch (error: any) {
    throw new Error(
      `Error fetching giveaways list from contract: ${error.message}`
    )
  }
}

export const getGiveaway = async (id: number): Promise<GiveawayInstance> => {
  try {
    const data = await readContract({
      ...defaultOptions,
      address: giveawayManagerContractAddress,
      functionName: 'getGiveaway',
      args: [id]
    })
    return transformGiveawayItem(data)
  } catch (error: any) {
    throw new Error(`Error fetching giveaway from contract: ${error.message}`)
  }
}

export const getGiveawayHook = (store, id) => {
  const { data, isError, isLoading, isSuccess } = useContractRead({
    ...defaultOptions,
    address: giveawayManagerContractAddress,
    functionName: 'getGiveaway',
    args: [id]
  })
  useEffect(() => {
    if (!id || !isSuccess) return
    const transformedData = transformGiveawayItem(data)
    if (
      data &&
      JSON.stringify(store.state.giveaway) !== JSON.stringify(transformedData)
    ) {
      store.update({ giveaway: transformedData })
    }
  }, [data, store, id, isSuccess])

  return { data, isError, isLoading, isSuccess }
}

export const getClaimableLink = async (id: number): Promise<number> => {
  try {
    const data = await readContract({
      ...defaultOptions,
      address: giveawayManagerContractAddress,
      functionName: 'claimableLink',
      args: [id]
    })
    return transformClaimable(data)
  } catch (error: any) {
    throw new Error(`Error getting claimable link: ${error.message}`)
  }
}

export const getClaimableAutomation = async (id: number): Promise<number> => {
  try {
    const data = await readContract({
      ...defaultOptions,
      address: giveawayManagerContractAddress,
      functionName: 'claimableAutomation',
      args: [id]
    })
    return transformClaimable(data)
  } catch (error: any) {
    throw new Error(`Error getting claimable link: ${error.message}`)
  }
}

export const getLINKBalance = async (address: string): Promise<number> => {
  try {
    const data = await readContract({
      ...defaultOptions,
      address: linkTokenContractAddress,
      functionName: 'balanceOf',
      args: [address]
    })
    return transformClaimable(data)
  } catch (error: any) {
    throw new Error(`Error getting LINK balance: ${error.message}`)
  }
}
