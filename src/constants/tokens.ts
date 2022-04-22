import { ChainId, Token } from '@cronaswap/core-sdk'

const tokens = {
  duet: new Token(
    ChainId.BSC_TESTNET,
    '0x95EE03e1e2C5c4877f9A298F1C0D6c98698FAB7B',
    18,
    'DUET',
    'Duet Governance Token'
  ),
  era: new Token(ChainId.BSC_TESTNET, '0x6f9F0c4ad9Af7EbD61Ac5A1D4e0F2227F7B0E5f9', 18, 'ERA', 'Era Token'),
  froyo: new Token(ChainId.BSC_TESTNET, '0xe369fec23380f9F14ffD07a1DC4b7c1a9fdD81c9', 18, 'FROYO', 'Froyo Games'),
  dpt: new Token(ChainId.BSC_TESTNET, '0xE69cAef10A488D7AF31Da46c89154d025546e990', 18, 'DPT', 'Diviner Protocol'),
  santos: new Token(
    ChainId.BSC_TESTNET,
    '0xA64455a4553C9034236734FadDAddbb64aCE4Cc7',
    8,
    'SANTOS',
    'FC Santos Fan Token'
  ),
  porto: new Token(ChainId.BSC_TESTNET, '0x49f2145d6366099e13B10FbF80646C0F377eE7f6', 8, 'PORTO', 'FC Porto Fan Token'),
  dar: new Token(ChainId.BSC_TESTNET, '0x23CE9e926048273eF83be0A3A8Ba9Cb6D45cd978', 6, 'DAR', 'Mines of Dalarnia'),
  dkt: new Token(ChainId.BSC_TESTNET, '0x7Ceb519718A80Dd78a8545AD8e7f401dE4f2faA7', 18, 'DKT', 'Duelist King'),
  kalm: new Token(ChainId.BSC_TESTNET, '0x4BA0057f784858a48fe351445C672FF2a3d43515', 18, 'KALM', 'Kalmar Token'),
  hotcross: new Token(
    ChainId.BSC_TESTNET,
    '0x4FA7163E153419E0E1064e418dd7A99314Ed27b6',
    18,
    'HOTCROSS',
    'Hotcross Token'
  ),
  hzn: new Token(
    ChainId.BSC_TESTNET,
    '0xC0eFf7749b125444953ef89682201Fb8c6A917CD',
    18,
    'HZN',
    'Horizon Protocol Token'
  ),
}

export default tokens
