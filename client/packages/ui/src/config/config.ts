const getEnv = (app, local) => {
  const key = `GLOBAL_${app}`
  return window[key] ? window[key] : local
}

export const env = {
  giveawayManagerContractAddress: () =>
    getEnv(
      `UI_GIVEAWAY_MANAGER_CONTRACT_ADDRESS`,
      // @ts-ignore:next-line
      typeof envGiveawayManagerContractAddress == 'string'
        ? // @ts-ignore:next-line
          envGiveawayManagerContractAddress
        : undefined // eslint-disable-line no-undef
    ),
  linkTokenContractAddress: () =>
    getEnv(
      `UI_LINK_TOKEN_CONTRACT_ADDRESS`,
      // @ts-ignore:next-line
      typeof envLinkTokenContractAddress == 'string'
        ? // @ts-ignore:next-line
          envLinkTokenContractAddress
        : undefined // eslint-disable-line no-undef
    ),
  keeperRegistryContractAddress: () =>
    getEnv(
      `UI_KEEPER_REGISTRY_CONTRACT_ADDRESS`,
      // @ts-ignore:next-line
      typeof envKeeperRegistryContractAddress == 'string'
        ? // @ts-ignore:next-line
          envKeeperRegistryContractAddress
        : undefined // eslint-disable-line no-undef
    )
}
