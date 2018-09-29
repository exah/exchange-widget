import test from 'ava'
import createStore from '../index'
import * as actions from '../exchange'

const getIntialState = (state) => ({
  exchange: {
    rates: { GBP: 0.5, USD: 1 },
    value: 1,
    currency: 'USD',
    fromCurrency: 'USD',
    toCurrency: 'GBP',
    ...state
  }
})

const exchange = actions.getSelectors((state) => state.exchange)

test('get initial values', t => {
  const store = createStore(getIntialState())

  t.is(exchange.getFromValue(store.getState()), 1)
  t.is(exchange.getToValue(store.getState()), 0.5)
})

test('change currency and value', t => {
  const store = createStore(getIntialState())

  store.dispatch(actions.updateExchangeValue({ value: 10, currency: 'GBP' }))

  t.is(exchange.getFromValue(store.getState()), 20)
  t.is(exchange.getToValue(store.getState()), 10)
})

test('recieve new actions.exchange rates', t => {
  const store = createStore(getIntialState({ value: 10, currency: 'GBP' }))
  store.dispatch(actions.recieveExchangeRates({ rates: { GBP: 0.25 } }))

  t.is(exchange.getFromValue(store.getState()), 40)
  t.is(exchange.getToValue(store.getState()), 10)
})
