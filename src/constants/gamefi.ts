import { CoinTossStatus } from 'app/features/gamefi/cointoss/enum'
import { DiceRollStatus } from 'app/features/gamefi/diceroll/enum'
export type DiceRollOption = {
  [DiceRollStatus.D1]: boolean | false
  [DiceRollStatus.D2]: boolean | false
  [DiceRollStatus.D3]: boolean | false
  [DiceRollStatus.D4]: boolean | false
  [DiceRollStatus.D5]: boolean | false
  [DiceRollStatus.D6]: boolean | false
}
export type CoinTossOption = {
  opt: CoinTossStatus
}

export type PlacedBet = {
  id: number
  txnHash: string
  player: string
  betAmount: string
  choice: CoinTossOption | DiceRollOption | null
  result: CoinTossStatus | DiceRollStatus | -1
  wasSuccess: boolean
  rewardAmount: string
}

export type TopGamerInfo = {
  player: string
  winCount: number
  rewardsAmount: string
}
