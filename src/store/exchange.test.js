import test from 'ava'
import createStore from './index'

import {
  recieveExchangeRates,
  updateExchangeValue,
  exchangeFromValue,
  exchangeToValue
} from './exchange'

const INITIAL_STATE = {
  rates: { GBP: 0.5, USD: 1 },
  availableCurrencies: [ 'USD' ],
  value: 1,
  currency: 'USD',
  fromCurrency: 'USD',
  toCurrency: 'GBP'
}

test('get initial values', t => {
  const store = createStore(INITIAL_STATE)

  t.is(exchangeFromValue(store.getState()), 1)
  t.is(exchangeToValue(store.getState()), 0.5)
})

test('change currency and value', t => {
  const store = createStore(INITIAL_STATE)

  store.dispatch(updateExchangeValue({ value: 10, currency: 'GBP' }))

  t.is(exchangeFromValue(store.getState()), 20)
  t.is(exchangeToValue(store.getState()), 10)
})

test('recieve new exchange rates', t => {
  const store = createStore({ ...INITIAL_STATE, value: 10, currency: 'GBP' })
  store.dispatch(recieveExchangeRates({ rates: { GBP: 0.25 } }))

  t.is(exchangeFromValue(store.getState()), 40)
  t.is(exchangeToValue(store.getState()), 10)
})
