import express from 'express'
import * as oxcr from '../../api/oxcr'

import {
  API_GET_RATES,
  EVENT_EXCHANGE_RATES_FOR_CURRENCY,
  EVENT_EXCHANGE_RATES
} from '../../constants'

function subscribeToRates (socket) {
  const state = {
    currency: null,
    timer: null
  }

  const stopTimer = () => clearTimeout(state.timer)
  socket.on(
    EVENT_EXCHANGE_RATES_FOR_CURRENCY,
    function currencyListener ({ currency, interval = 10000 }) {
      if (state.currency !== currency) {
        state.currency = currency
        console.log(state)

        stopTimer()
        ;(function repeatGetRates (i) {
          i++
          return oxcr.getRates(currency)
            .then((data) => socket.emit(EVENT_EXCHANGE_RATES, data))
            .then(() => new Promise((resolve) => { state.timer = setTimeout(resolve, interval) }))
            .then(() => repeatGetRates(i))
            .catch((error) => console.error(error))
        })(0)
      }
    }
  )

  return stopTimer
}

export default function exchangeService (io) {
  const router = express.Router()

  io.on('connection', (socket) => {
    const unsubscribeFromRates = subscribeToRates(socket)

    socket.on('disconnect', (reason) => {
      unsubscribeFromRates()
    })
  })

  router.get(API_GET_RATES, (req, res, next) => {
    oxcr.getRates(req.params.currency)
      .then((data) => res.json({
        status: 200,
        message: 'ok',
        data: data.rates
      }))
      .catch((error) => res.status(error.status).json({
        status: error.status,
        message: error.message,
        data: null
      }))
  })

  return router
}
