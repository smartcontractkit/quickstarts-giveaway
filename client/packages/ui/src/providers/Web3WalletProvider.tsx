import React from 'react'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import {
  mainnet,
  localhost,
  hardhat,
  goerli,
  sepolia,
  polygonMumbai
} from 'wagmi/chains'

const DEFAULT_CHAIN_ID = polygonMumbai.id

export const CHAINS = [
  {
    ...mainnet,
    rpcUrls: {
      public: {
        http: ['https://cloudflare-eth.com']
      },
      default: {
        http: ['https://cloudflare-eth.com']
      }
    }
  },
  {
    ...localhost,
    rpcUrls: {
      public: {
        http: ['https://staking-metrics-monitor-alpha.staging.linkpool.io/dev']
      },
      default: {
        http: ['https://staking-metrics-monitor-alpha.staging.linkpool.io/dev']
      }
    }
  },
  {
    ...sepolia,
    rpcUrls: {
      public: {
        http: ['https://ethereum-sepolia-rpc.allthatnode.com']
      },
      default: {
        http: ['https://ethereum-sepolia-rpc.allthatnode.com']
      }
    }
  },
  {
    ...polygonMumbai,
    rpcUrls: {
      public: {
        http: ['https://endpoints.omniatech.io/v1/matic/mumbai/public']
      },
      default: {
        http: ['https://endpoints.omniatech.io/v1/matic/mumbai/public']
      }
    }
  },
  hardhat,
  goerli
]

const { chains, provider } = configureChains(
  CHAINS.sort((chain) => {
    return chain.id === DEFAULT_CHAIN_ID ? -1 : 1
  }),
  [
    jsonRpcProvider({
      priority: 1,
      rpc: (chain) => {
        return {
          http: chain.rpcUrls.default.http[0],
          webSocket: chain.rpcUrls.default.webSocket?.[0]
        }
      }
    }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== 1) return null
        return { http: 'https://rpc.flashbots.net/' }
      }
    }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== 1) return null
        return {
          http: 'https://api.mycryptoapi.com/eth'
        }
      }
    })
  ],
  { targetQuorum: 1 }
)

const connectors = () => {
  const list = [
    new InjectedConnector({
      chains
    })
  ]
  return list
}

export const client = createClient({
  autoConnect: true,
  connectors,
  provider
})

export const Web3WalletProvider = ({ children }) => (
  <WagmiConfig client={client}>{children}</WagmiConfig>
)
