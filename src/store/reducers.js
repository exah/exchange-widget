import { combineReducers } from 'redux'
import exchangeReducer, { getSelectors as getExchangeSelectors } from './exchange'

export const exchange = getExchangeSelectors(state => state.exchange)

export default combineReducers({
  exchange: exchangeReducer
})
