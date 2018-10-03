import { createAction } from 'redux-actions'
import { createSelector } from 'reselect'
import * as exchangeApi from '../api/exchange'
import { identity, noop, createScopeTypes, round } from '../utils'

import {
  API_SOCKET_GET_LIVE_RATES,
  API_SOCKET_REQUEST_LIVE_RATES
} from '../constants'

const TYPES = createScopeTypes('@exchange')(
  'RESET',
  'RECIEVE_RATES',
  'UPDATE_VALUE',
  'UPDATE_BASE_CURRENCY',
  'UPDATE_TARGET_CURRENCY',
  'SWITCH_CURRENCIES',
  'RECEIVE_BALANCE',
  'COMMIT_BALANCE_CHANGES'
)

//
// Reducer
//

const INITIAL_STATE = {
  rates: {},
  balance: [],
  value: '',
  currency: null,
  baseCurrency: null,
  targetCurrency: null
}

const selectors = getSelectors()

const switchCurrenciesState = (state) => ({
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
    case TYPES.UPDATE_BASE_CURRENCY: {
      if (state.targetCurrency === action.payload) {
        return switchCurrenciesState(state)
      }

      return {
        ...state,
        baseCurrency: action.payload
      }
    }
    case TYPES.UPDATE_TARGET_CURRENCY: {
      if (state.baseCurrency === action.payload) {
        return switchCurrenciesState(state)
      }

      return {
        ...state,
        targetCurrency: action.payload
      }
    }
    case TYPES.SWITCH_CURRENCIES: {
      return switchCurrenciesState(state)
    }
    case TYPES.UPDATE_VALUE: {
      if (action.payload.value < 0) return state
      return {
        ...state,
        value: action.payload.value,
        currency: action.payload.currency
      }
    }
    case TYPES.RECEIVE_BALANCE: {
      return {
        ...state,
        balance: action.payload.balance || []
      }
    }
    case TYPES.COMMIT_BALANCE_CHANGES: {
      const baseBalanceValue = selectors.getBaseBalanceValue(state)
      const targetBalanceValue = selectors.getTargetBalanceValue(state)

      return {
        ...state,
        value: '',
        balance: state.balance.map((balance) => {
          if (balance.currency === state.targetCurrency) {
            return {
              ...balance,
              value: targetBalanceValue
            }
          }

          if (balance.currency === state.baseCurrency) {
            return {
              ...balance,
              value: baseBalanceValue
            }
          }

          return balance
        })
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
// Selectors
//

const normalizeValue = (num) => num > 0 ? round(Number(num), 2) : ''
const normalizeBalance = (num) => round(Math.max(num, 0), 2)

function getSelectors (getState = identity) {
  const getRates = createSelector(getState, state => state.rates || {})
  const getValue = createSelector(getState, state => state.value)
  const getCurrency = createSelector(getState, state => state.currency)
  const getBaseCurrency = createSelector(getState, state => state.baseCurrency)
  const getTargetCurrency = createSelector(getState, state => state.targetCurrency)
  const getBalance = createSelector(getState, state => state.balance || [])

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

  const getCurrencies = createSelector(
    getBalance,
    balance => balance.map((b) => b.currency)
  )

  const findBalanceByCurrency = (balance, currency) =>
    balance.find(b => b.currency === currency)

  const getBaseBalance = createSelector(
    getBalance,
    getBaseCurrency,
    findBalanceByCurrency
  )

  const getTargetBalance = createSelector(
    getBalance,
    getTargetCurrency,
    findBalanceByCurrency
  )

  const getBaseBalanceValue = createSelector(
    getBaseValue,
    getBaseBalance,
    (value, balance) => balance ? normalizeBalance(balance.value - value) : 0
  )

  const getMaxTargetBalanceIncrementValue = createSelector(
    getRate,
    getBaseBalance,
    (rate, balance) => balance != null ? normalizeValue(rate * balance.value) : 0
  )

  const getTargetBalanceDifference = createSelector(
    getTargetValue,
    getTargetBalance,
    getMaxTargetBalanceIncrementValue,
    (value, balance, maxValue) => Math.min(value, maxValue)
  )

  const getTargetBalanceValue = createSelector(
    getTargetBalance,
    getTargetBalanceDifference,
    (balance, difference) => balance ? normalizeBalance(balance.value + difference) : 0
  )

  const getIsValid = createSelector(
    getTargetValue,
    getMaxTargetBalanceIncrementValue,
    (value, maxValue) => value > 0 && value <= maxValue
  )

  return {
    getIsValid,
    getBalance,
    getBaseCurrency,
    getTargetCurrency,
    getCurrency,
    getValue,
    getRate,
    getBaseValue,
    getTargetValue,
    getCurrencies,
    getBaseBalance,
    getTargetBalance,
    getBaseBalanceValue,
    getMaxTargetBalanceIncrementValue,
    getTargetBalanceValue
  }
}

//
// Actions
//

const recieveRates = createAction(TYPES.RECIEVE_RATES)
const updateBaseCurrency = createAction(TYPES.UPDATE_BASE_CURRENCY)
const updateTargetCurrency = createAction(TYPES.UPDATE_TARGET_CURRENCY)
const updateValue = createAction(TYPES.UPDATE_VALUE)
const switchCurrencies = createAction(TYPES.SWITCH_CURRENCIES)
const receiveBalance = createAction(TYPES.RECEIVE_BALANCE)
const commitBalanceChanges = createAction(TYPES.COMMIT_BALANCE_CHANGES)
const resetState = createAction(TYPES.RESET)

const getExchangeRates = (currency) => (dispatch) =>
  exchangeApi.getRates(currency)
    .then((res) => dispatch(recieveRates({ rates: res.data })))

const getLiveExchangeRates = (currency) => (dispatch, getState, { socket }) => {
  if (socket) {
    socket.emit(API_SOCKET_REQUEST_LIVE_RATES, { currency })

    const listener = (data) => dispatch(recieveRates({ rates: data.rates }))

    socket.on(API_SOCKET_GET_LIVE_RATES, listener)
    return () => socket.removeListener(API_SOCKET_GET_LIVE_RATES, listener)
  }

  return noop
}

const getUserBalance = () => (dispatch) =>
  exchangeApi.getUserBalance()
    .then((res) => dispatch(receiveBalance({ balance: res.data })))

export {
  recieveRates,
  updateBaseCurrency,
  updateTargetCurrency,
  updateValue,
  receiveBalance,
  commitBalanceChanges,
  resetState,
  switchCurrencies,
  getUserBalance,
  getExchangeRates,
  getLiveExchangeRates,
  getSelectors
}

export default exchangeReducer
