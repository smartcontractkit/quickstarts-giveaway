import { ethers, BigNumber } from 'ethers'

export function toEther(amount: string) {
  try {
    return ethers.utils.parseEther(amount)
  } catch {
    return BigNumber.from('0')
  }
}
