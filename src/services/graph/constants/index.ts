import { ChainId } from '@cronaswap/core-sdk'
const THE_GRAPH = 'https://api.thegraph.com'
export const GRAPH_HOST = {
  [ChainId.ETHEREUM]: THE_GRAPH,
  [ChainId.CRONOS]: 'https://graph.cronaswap.org',
}
