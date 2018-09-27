import { createAction } from 'redux-actions'
import { createSelector } from 'reselect'

const SCOPE = '@exchange/'
const TYPES = {
  RESET: SCOPE + 'RESET',
  RECIEVE_RATES: SCOPE + 'RECIEVE_RATES',
  UPDATE_BASE_VALUE: SCOPE + 'UPDATE_BASE_VALUE',
  UPDATE_BASE_CURRENCY: SCOPE + 'UPDATE_BASE_CURRENCY',
  UPDATE_FROM_CURRENCY: SCOPE + 'UPDATE_FROM_CURRENCY',
  UPDATE_TO_CURRENCY: SCOPE + 'UPDATE_TO_CURRENCY'
}

//
// Reducer
//

const INITIAL_STATE = {
  rates: { USD: 1 },
  availableCurrencies: [ 'USD' ],
  value: 1,
  currency: 'USD',
  fromCurrency: 'USD',
  toCurrency: 'USD'
}

function exchangeReducer (state = INITIAL_STATE, action = {}) {
  const baseState = {
    ...INITIAL_STATE,
    ...state
  }

  switch (action.type) {
    case TYPES.RECIEVE_RATES: {
      return {
        ...state,
        rates: action.payload.rates
      }
    }
    case TYPES.UPDATE_FROM_CURRENCY: {
      return {
        ...state,
        fromCurrency: action.payload.currency
      }
    }
    case TYPES.UPDATE_TO_CURRENCY: {
      return {
        ...state,
        toCurrency: action.payload.currency
      }
    }
    case TYPES.UPDATE_BASE_VALUE: {
      return {
        ...state,
        value: action.payload.value,
        currency: action.payload.currency
      }
    }
    case TYPES.RESET: {
      return {
        ...state,
        ...INITIAL_STATE
      }
    }
    default: return baseState
  }
}

//
// Actions
//

const recieveExchangeRates = createAction(TYPES.RECIEVE_RATES)
const updateExchangeCurrency = createAction(TYPES.UPDATE_FROM_CURRENCY)
const updateExchangeValue = createAction(TYPES.UPDATE_BASE_VALUE)
const resetExchangeState = createAction(TYPES.RESET)

//
// Selectors
//

const exchangeRates = state => state.rates || {}
const exchangeValue = state => state.value || 0
const exchangeCurrency = state => state.currency
const exchangeFromCurrency = state => state.fromCurrency
const exchangeToCurrency = state => state.toCurrency

const exchangeRate = createSelector(
  exchangeRates,
  exchangeToCurrency,
  (rates, currency) => rates[currency]
)

const exchangeValueSelector = (...selectors) => createSelector(
  exchangeRate,
  exchangeCurrency,
  exchangeValue,
  ...selectors
)

const exchangeFromValue = exchangeValueSelector(
  exchangeFromCurrency,
  (rate, currency, value, base) => currency === base ? value : value / rate
)

const exchangeToValue = exchangeValueSelector(
  exchangeToCurrency,
  (rate, currency, value, base) => currency === base ? value : value * rate
)

export {
  recieveExchangeRates,
  updateExchangeCurrency,
  updateExchangeValue,
  resetExchangeState,
  exchangeFromCurrency,
  exchangeToCurrency,
  exchangeCurrency,
  exchangeValue,
  exchangeFromValue,
  exchangeToValue
}

export default exchangeReducer
