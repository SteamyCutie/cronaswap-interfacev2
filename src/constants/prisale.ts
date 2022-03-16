import { ChainId, Token } from '@cronaswap/core-sdk'
import { ChainTokenMap } from 'app/config/tokens'

export const prisaleToken: ChainTokenMap = {
  [ChainId.ETHEREUM]: new Token(ChainId.ETHEREUM, '0x3cd06b0010feba4216b85b4477125cac1e708de0', 18, 'MERTA', 'MERTA'),
  [ChainId.CRONOS]: new Token(ChainId.CRONOS, '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', 18, 'MERTA', 'MERTA'),
  [ChainId.CRONOS_TESTNET]: new Token(
    ChainId.CRONOS_TESTNET,
    '0x374AC6edeE4385411FF36BEf74D2c1723bD7A6e8',
    18,
    'MERTA',
    'MERTA'
  ),
  [ChainId.BSC_TESTNET]: new Token(
    ChainId.BSC_TESTNET,
    '0x50fbded2063577995389fd5fa0eb349ccbc7ca67',
    18,
    'MERTA',
    'MERTA'
  ),
}
