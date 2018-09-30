import test from 'ava'
import createStore from './index'
import * as actions from './exchange'

const storeWithState = (state) => createStore({
  exchange: {
    rates: { GBP: 0.5, USD: 1, EUR: 0.75 },
    value: 1,
    currency: 'USD',
    baseCurrency: 'USD',
    targetCurrency: 'GBP',
    ...state
  }
})

const selectors = actions.getSelectors((state) => state.exchange)

test('get initial values', t => {
  const store = storeWithState()
  const state = store.getState()

  t.is(selectors.getBaseValue(state), 1)
  t.is(selectors.getTargetValue(state), 0.5)
})

test('change currency and value', t => {
  const store = storeWithState()
  store.dispatch(actions.updateExchangeValue({ value: 10, currency: 'GBP' }))

  const changedState = store.getState()
  t.is(selectors.getBaseValue(changedState), 20)
  t.is(selectors.getTargetValue(changedState), 10)
})

test('recieve new exchange rates', t => {
  const store = storeWithState({ value: 10, currency: 'GBP' })
  store.dispatch(actions.recieveExchangeRates({ rates: { GBP: 0.25 } }))

  const changedState = store.getState()
  t.is(selectors.getBaseValue(changedState), 40)
  t.is(selectors.getTargetValue(changedState), 10)
})

test('set new base currency', t => {
  const store = storeWithState()
  const initialState = store.getState()
  const baseCurrency = selectors.getBaseCurrency(initialState)

  store.dispatch(actions.updateExchangeBaseCurrency('EUR'))
  store.dispatch(actions.recieveExchangeRates({ rates: { GBP: 0.5 } }))

  const changedState = store.getState()
  t.not(selectors.getBaseCurrency(changedState), baseCurrency)
  t.is(selectors.getBaseCurrency(changedState), 'EUR')
  t.is(selectors.getTargetValue(changedState), 0.5)
})

test('switch exchange currencies', t => {
  const store = storeWithState()
  const initialState = store.getState()
  const baseCurrency = selectors.getBaseCurrency(initialState)
  const targetCurrency = selectors.getTargetCurrency(initialState)

  store.dispatch(actions.switchExchangeCurrencies())

  const changedState = store.getState()
  t.is(selectors.getBaseCurrency(changedState), targetCurrency)
  t.is(selectors.getTargetCurrency(changedState), baseCurrency)
})

test('set new base currency to target currency value and switch them', t => {
  const store = storeWithState()
  const initialState = store.getState()
  const baseCurrency = selectors.getBaseCurrency(initialState)
  const targetCurrency = selectors.getTargetCurrency(initialState)

  store.dispatch(actions.updateExchangeBaseCurrency(targetCurrency))

  const changedState = store.getState()
  t.is(selectors.getBaseCurrency(changedState), targetCurrency)
  t.is(selectors.getTargetCurrency(changedState), baseCurrency)
})
