import { EVENT_USER_EXCHANGE_CURRENCY, EVENT_EXCHANGE_RATES } from '../../constants'

import rates1 from '../../data/exchange-rates-1.json'
import rates2 from '../../data/exchange-rates-2.json'

export default function exchangeService (io) {
  io.on('connection', (socket) => {
    let intervalId
    let i = 0

    socket.on(EVENT_USER_EXCHANGE_CURRENCY, (currency) => {
      socket.emit(EVENT_EXCHANGE_RATES, rates1)

      intervalId = setInterval(() => {
        i++
        socket.emit(EVENT_EXCHANGE_RATES, i % 2 === 0 ? rates1 : rates2)
      }, 2000)
    })

    socket.on('disconnect', (reason) => {
      i = 0
      clearInterval(intervalId)
    })
  })

  return function exchangeMiddleware (req, res, next) {
    next()
  }
}
