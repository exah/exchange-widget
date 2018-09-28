import express from 'express'
import exchangeService from './services/exchange'
import renderApp from './render-app'

export default function serverRender ({ files, io }) {
  const router = express.Router()

  io.removeAllListeners() // ensure fresh state after hot-reload
  router.use(exchangeService(io))
  router.use(renderApp(files))

  return router
}
