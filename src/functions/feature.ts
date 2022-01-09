import { ChainId } from '@cronaswap/core-sdk'

export enum Feature {
  AMM = 'AMM',
  AMM_V2 = 'AMM V2',
  LIQUIDITY_MINING = 'Liquidity Mining',
  BENTOBOX = 'BentoBox',
  KASHI = 'Kashi',
  MISO = 'MISO',
  ANALYTICS = 'Analytics',
  MIGRATE = 'Migrate',
  STAKING = 'Staking',
  BOOST = 'Boost',
  ZAP = 'Zap',
}

const features = {
  [ChainId.ETHEREUM]: [
    Feature.AMM,
    Feature.LIQUIDITY_MINING,
    Feature.BENTOBOX,
    Feature.KASHI,
    Feature.MIGRATE,
    Feature.ANALYTICS,
    Feature.STAKING,
    Feature.MISO,
  ],
  [ChainId.CRONOS]: [
    Feature.AMM,
    Feature.LIQUIDITY_MINING,
    Feature.ZAP,
    Feature.BENTOBOX,
    Feature.KASHI,
    Feature.MIGRATE,
    Feature.ANALYTICS,
    Feature.STAKING,
    Feature.BOOST,
    Feature.MISO,
  ],
  [ChainId.CRONOS_TESTNET]: [
    Feature.AMM,
    Feature.LIQUIDITY_MINING,
    Feature.ZAP,
    Feature.BENTOBOX,
    Feature.KASHI,
    Feature.MIGRATE,
    Feature.ANALYTICS,
    Feature.STAKING,
    Feature.BOOST,
    Feature.MISO,
  ],
}

export function featureEnabled(feature: Feature, chainId: ChainId): boolean {
  return features?.[chainId]?.includes(feature)
}

export function chainsWithFeature(feature: Feature): ChainId[] {
  return Object.keys(features)
    .filter((chain) => features[chain].includes(feature))
    .map((chain) => ChainId[chain])
}
