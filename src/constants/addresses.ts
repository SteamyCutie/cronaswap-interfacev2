import { ChainId } from '@cronaswap/core-sdk'

type AddressMap = { [chainId: number]: string }

export const MASTERCHEFV2_ADDRESS: AddressMap = {
  [ChainId.CRONOS]: '',
  [ChainId.CRONOS_TESTNET]: '0x4E88d01e22437F99d9E9313C40306700b214132C',
}

export const DASHBOARDV1_ADDRESS: AddressMap = {
  [ChainId.CRONOS]: '0x3647f6A3Ef1Aa70697b09407FF092fe878e9CeBA',
  [ChainId.CRONOS_TESTNET]: '0xA745124f47D53B5c3d1a7A880BD9Edc5461F2e75',
}

export const DASHBOARDV2_ADDRESS: AddressMap = {
  [ChainId.CRONOS]: '',
  [ChainId.CRONOS_TESTNET]: '0x7333Ec605ef964b5cF521cB32177c93A53895b31',
}

export const VOTING_ESCROW_ADDRESS: AddressMap = {
  [ChainId.CRONOS]: '',
  [ChainId.CRONOS_TESTNET]: '0x6C7F30a34C744a9Effd94CDfFEE1E03569188a05',
}

// Seed / Private / Public Sale
export const SEED_SALE_ADDRESS: AddressMap = {
  [ChainId.CRONOS]: '0x94f3Dfc9E8AE00892984d8fA003BF09a46987DFd',
  [ChainId.CRONOS_TESTNET]: '',
}

export const PRIVATE_SALEA_ADDRESS: AddressMap = {
  [ChainId.CRONOS]: '0x1c41BE3D395494e636aE7Ec9b8B5AB32A9Ddd1Ce',
  [ChainId.CRONOS_TESTNET]: '',
}

export const PRIVATE_SALEB_ADDRESS: AddressMap = {
  [ChainId.CRONOS]: '0x309afba23f791B5c38Ab9057D11D6869755fAcaf',
  [ChainId.CRONOS_TESTNET]: '',
}

export const PUBLIC_SALE_ADDRESS: AddressMap = {
  [ChainId.CRONOS]: '0x941a3703E106707668f38E779c7984383638173e',
  [ChainId.CRONOS_TESTNET]: '',
}
