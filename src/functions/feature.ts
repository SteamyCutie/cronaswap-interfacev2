import { ChainId } from '@cronaswap/core-sdk'

export enum Feature {
  AMM = 'AMM',
  FARMV1 = 'Farm V1',
  FARMV2 = 'Farm V2',
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
  [ChainId.ETHEREUM]: [Feature.AMM],

  [ChainId.CRONOS]: [
    Feature.AMM,
    Feature.FARMV1,
    Feature.FARMV2,
    Feature.ZAP,
    Feature.MIGRATE,
    Feature.ANALYTICS,
    Feature.STAKING,
    Feature.BRIDGE,
    Feature.BOOST,
  ],

  [ChainId.CRONOS_TESTNET]: [
    Feature.AMM,
    Feature.FARMV1,
    Feature.FARMV2,
    Feature.ZAP,
    // Feature.LENDING,
    // Feature.LAUNCH,
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
