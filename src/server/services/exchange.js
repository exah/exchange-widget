import { EVENT_EXCHANGE_RATES_FOR_CURRENCY, EVENT_EXCHANGE_RATES } from '../../constants'
import { noop } from '../../utils'

import rates1 from '../../data/exchange-rates-1.json'
import rates2 from '../../data/exchange-rates-2.json'

function subscribeToRates (socket) {
  const state = {
    currency: null
  }

  function watchRates (currency, interval = 2000) {
    let i = 0
    const id = setInterval(() => {
      i++
      socket.emit(EVENT_EXCHANGE_RATES, i % 2 === 0 ? rates1 : rates2)
    }, interval)

    return () => clearInterval(id)
  }

  let stopWatchRates = noop
  socket.on(EVENT_EXCHANGE_RATES_FOR_CURRENCY, function currencyListener ({ currency, interval }) {
    if (state.currency !== currency) {
      stopWatchRates()
      state.currency = currency
      stopWatchRates = watchRates(currency, interval)
    }
  })

  return stopWatchRates
}

export default function exchangeService (io) {
  io.on('connection', (socket) => {
    const unsubscribeFromRates = subscribeToRates(socket)

    socket.on('disconnect', (reason) => {
      unsubscribeFromRates()
    })
  })

  return function exchangeMiddleware (req, res, next) {
    next()
  }
}
