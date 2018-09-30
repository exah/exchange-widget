import { createAction } from 'redux-actions'
import { createSelector } from 'reselect'
import * as exchangeApi from '../api/exchange'
import { identity, noop, createScopeTypes } from '../utils'

import {
  API_SOCKET_GET_LIVE_RATES,
  API_SOCKET_REQUEST_LIVE_RATES
} from '../constants'

const scopeTypes = createScopeTypes('@exchange')

const TYPES = scopeTypes(
  'RESET',
  'RECIEVE_RATES',
  'UPDATE_VALUE',
  'UPDATE_FROM_CURRENCY',
  'UPDATE_TO_CURRENCY',
  'SWITCH_CURRENCIES'
)

//
// Reducer
//

const INITIAL_STATE = {
  rates: {},
  value: '',
  currency: null,
  baseCurrency: null,
  targetCurrency: null
}

const switchCurrencies = (state) => ({
  ...state,
  baseCurrency: state.targetCurrency,
  targetCurrency: state.baseCurrency
})

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
      if (state.targetCurrency === action.payload) {
        return switchCurrencies(state)
      }

      return {
        ...state,
        baseCurrency: action.payload
      }
    }
    case TYPES.UPDATE_TO_CURRENCY: {
      if (state.baseCurrency === action.payload) {
        return switchCurrencies(state)
      }

      return {
        ...state,
        targetCurrency: action.payload
      }
    }
    case TYPES.SWITCH_CURRENCIES: {
      return switchCurrencies(state)
    }
    case TYPES.UPDATE_VALUE: {
      if (action.payload.value < 0) return state
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
const updateExchangeBaseCurrency = createAction(TYPES.UPDATE_FROM_CURRENCY)
const updateExchangeTargetCurrency = createAction(TYPES.UPDATE_TO_CURRENCY)
const updateExchangeValue = createAction(TYPES.UPDATE_VALUE)
const switchExchangeCurrencies = createAction(TYPES.SWITCH_CURRENCIES)
const resetExchangeState = createAction(TYPES.RESET)

const getExchangeRates = (currency) => (dispatch) =>
  exchangeApi.getRates(currency)
    .then((res) => dispatch(recieveExchangeRates({ rates: res.data })))

const getLiveExchangeRates = (currency) => (dispatch, getState, { socket }) => {
  if (socket) {
    socket.emit(API_SOCKET_REQUEST_LIVE_RATES, { currency })

    const listener = (data) => dispatch(recieveExchangeRates({ rates: data.rates }))

    socket.on(API_SOCKET_GET_LIVE_RATES, listener)
    return () => socket.removeListener(API_SOCKET_GET_LIVE_RATES, listener)
  }

  return noop
}

//
// Selectors
//

const normalizeValue = (num) => num > 0 ? Math.floor(Number(num) * 100) / 100 : ''

function getSelectors (getState = identity) {
  const getRates = createSelector(getState, state => state.rates || {})
  const getValue = createSelector(getState, state => state.value)
  const getCurrency = createSelector(getState, state => state.currency)
  const getBaseCurrency = createSelector(getState, state => state.baseCurrency)
  const getTargetCurrency = createSelector(getState, state => state.targetCurrency)

  const getRate = createSelector(
    getRates,
    getTargetCurrency,
    (rates, currency) => {
      const rate = rates[currency]
      return Number(rate != null && rate)
    }
  )

  const getValueSelector = (...otherSelectors) => createSelector(
    getRate,
    getCurrency,
    getValue,
    ...otherSelectors
  )

  const getBaseValue = getValueSelector(
    getBaseCurrency,
    (rate, currency, value, base) =>
      normalizeValue(currency === base || rate === 0 ? value : value / rate)
  )

  const getTargetValue = getValueSelector(
    getTargetCurrency,
    (rate, currency, value, base) =>
      normalizeValue(currency === base ? value : value * rate)
  )

  return {
    getBaseCurrency,
    getTargetCurrency,
    getCurrency,
    getValue,
    getRate,
    getBaseValue,
    getTargetValue
  }
}

export {
  recieveExchangeRates,
  updateExchangeBaseCurrency,
  updateExchangeTargetCurrency,
  updateExchangeValue,
  resetExchangeState,
  switchExchangeCurrencies,
  getLiveExchangeRates,
  getExchangeRates,
  getSelectors
}

export default exchangeReducer
