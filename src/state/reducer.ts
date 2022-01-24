import application from './application/reducer'
import burn from './burn/reducer'
import { combineReducers } from '@reduxjs/toolkit'
import create from './create/reducer'
import lists from './lists/reducer'
import mint from './mint/reducer'
import multicall from './multicall/reducer'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import bridgeTransactions from './bridgeTransactions/reducer'
import user from './user/reducer'

const reducer = combineReducers({
  application,
  user,
  transactions,
  bridgeTransactions,
  swap,
  mint,
  burn,
  multicall,
  lists,
  create,
})

export default reducer
