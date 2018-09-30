import express from 'express'
import logdown from 'logdown'
import * as ratesApi from '../../api/rates-api'

import {
  DEBUG_SCOPE_SERVICE,
  API_GET_RATES,
  API_SOCKET_REQUEST_LIVE_RATES,
  API_SOCKET_GET_LIVE_RATES
} from '../../constants'

const logger = logdown(DEBUG_SCOPE_SERVICE)

function subscribeToRates (socket) {
  const state = {
    currency: null,
    timer: null
  }

  const stopTimer = () => clearTimeout(state.timer)

  socket.on(
    API_SOCKET_REQUEST_LIVE_RATES,
    function currencyListener ({ currency, interval = 10000 }) {
      if (state.currency !== currency) {
        state.currency = currency
        logger.info('Currency:', state.currency)

        stopTimer()
        ;(function getRatesOnRepeat () {
          return ratesApi.getLatest(currency)
            .then((data) => {
              socket.emit(API_SOCKET_GET_LIVE_RATES, data)
              logger.info('Emit rates:')
            })
            .then(() => new Promise((resolve) => { state.timer = setTimeout(resolve, interval) }))
            .then(() => getRatesOnRepeat())
            .catch((error) => logger.error(error)) // TODO: Send error to client
        })()
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
    ratesApi.getLatest(req.params.currency)
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
