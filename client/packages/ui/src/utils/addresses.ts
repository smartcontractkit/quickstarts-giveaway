import { BigNumber } from 'ethers'

export const shortenAddress = (addr) =>
  `${addr.substring(0, 6)}...${addr.slice(addr.length - 4)}`

export const bigNumberToNumber = (bigNumber: BigNumber): number | bigint => {
  try {
    return bigNumber.toNumber()
  } catch {
    return bigNumber.toBigInt()
  }
}

export const isValidBytes32Hex = (input: string): boolean => {
  return /^0x([a-fA-F0-9]{64})$/.test(input)
}
