import express from 'express'
import renderApp from './server/render-app'

export default function serverRender ({ files }) {
  const router = express.Router()

  router.use(renderApp(files))
  return router
}
