import { createAction } from 'redux-actions'
import { createSelector } from 'reselect'
import { EVENT_EXCHANGE_RATES, EVENT_USER_EXCHANGE_CURRENCY } from '../constants'
import { identity, noop } from '../utils'

const SCOPE = '@exchange/'

const TYPES = {
  RESET: SCOPE + 'RESET',
  RECIEVE_RATES: SCOPE + 'RECIEVE_RATES',
  UPDATE_VALUE: SCOPE + 'UPDATE_VALUE',
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

const round = (num) =>
  !num && num !== 0 ? '' : Math.floor(Number(num) * 100) / 100

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
    case TYPES.UPDATE_BASE_CURRENCY: {
      return {
        ...state,
        currency: action.payload.currency
      }
    }
    case TYPES.UPDATE_VALUE: {
      if (action.payload.value < 0) return state
      return {
        ...state,
        value: round(action.payload.value),
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
const updateExchangeFromCurrency = createAction(TYPES.UPDATE_FROM_CURRENCY)
const updateExchangeToCurrency = createAction(TYPES.UPDATE_TO_CURRENCY)
const updateExchangeCurrency = createAction(TYPES.UPDATE_BASE_CURRENCY)
const updateExchangeValue = createAction(TYPES.UPDATE_VALUE)
const resetExchangeState = createAction(TYPES.RESET)

const updateAndEmitExchangeToCurrency = (currency) => (dispatch, getState, { socket }) => {
  dispatch(updateExchangeToCurrency({ currency }))
  socket.emit(EVENT_USER_EXCHANGE_CURRENCY, currency)
}

const watchExchangeRatesChanges = () => (dispatch, getState, { socket }) => {
  if (socket) {
    const listener = (data) => dispatch(recieveExchangeRates({ rates: data.rates }))
    socket.on(EVENT_EXCHANGE_RATES, listener)
    return () => socket.removeListener(EVENT_EXCHANGE_RATES, listener)
  }

  return noop
}

//
// Selectors
//

function getSelectors (getState = identity) {
  const getRates = createSelector(getState, state => state.rates || {})
  const getValue = createSelector(getState, state => round(state.value))
  const getCurrency = createSelector(getState, state => state.currency)
  const getFromCurrency = createSelector(getState, state => state.fromCurrency)
  const getToCurrency = createSelector(getState, state => state.toCurrency)

  const getRate = createSelector(
    getRates,
    getToCurrency,
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

  const getFromValue = getValueSelector(
    getFromCurrency,
    (rate, currency, value, base) => currency === base ? value : round(value / rate)
  )

  const getToValue = getValueSelector(
    getToCurrency,
    (rate, currency, value, base) => currency === base ? value : round(value * rate)
  )

  return {
    getFromCurrency,
    getToCurrency,
    getCurrency,
    getValue,
    getRate,
    getFromValue,
    getToValue
  }
}

export {
  recieveExchangeRates,
  updateExchangeFromCurrency,
  updateExchangeToCurrency,
  updateExchangeCurrency,
  updateExchangeValue,
  resetExchangeState,
  updateAndEmitExchangeToCurrency,
  watchExchangeRatesChanges,
  getSelectors
}

export default exchangeReducer
