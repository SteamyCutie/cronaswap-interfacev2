import { ChainId } from '@cronaswap/core-sdk'

export enum Feature {
  AMM = 'AMM',
  LIQUIDITY_MINING = 'Liquidity Mining',
  LENDING = 'Lending',
  ANALYTICS = 'Analytics',
  MIGRATE = 'Migrate',
  STAKING = 'Staking',
  LAUNCH = 'Launch',
  BOOST = 'Boost',
  BRIDGE = 'Bridge',
  ZAP = 'Zap',
}

const features = {
  [ChainId.ETHEREUM]: [
    Feature.AMM,
    Feature.LIQUIDITY_MINING,
    Feature.LENDING,
    Feature.MIGRATE,
    Feature.ANALYTICS,
    Feature.STAKING,
  ],

  [ChainId.CRONOS]: [
    Feature.AMM,
    Feature.LIQUIDITY_MINING,
    Feature.ZAP,
    Feature.MIGRATE,
    Feature.ANALYTICS,
    Feature.STAKING,
    Feature.BRIDGE,
    Feature.BOOST,
  ],

  [ChainId.CRONOS_TESTNET]: [
    Feature.AMM,
    Feature.LIQUIDITY_MINING,
    Feature.ZAP,
    Feature.LENDING,
    Feature.MIGRATE,
    Feature.ANALYTICS,
    Feature.LAUNCH,
    Feature.STAKING,
    Feature.BOOST,
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
