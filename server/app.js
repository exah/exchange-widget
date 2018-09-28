const config = require('config')
const http = require('http')
const express = require('express')
const createIO = require('socket.io')
const compression = require('compression')
const bodyParser = require('body-parser')
const webpackUniversalAndHot = require('@exah/webpack-universal-hot-middleware')

const app = express()
const server = http.createServer(app)
const io = createIO(server)

app.use(bodyParser.json())
app.use(compression({ threshold: 0 }))

app.use(express.static(config.paths.public, {
  maxAge: config.isDev ? 0 : 1000 * 60 * 60 * 24 * 7 // 7 days
}))

app.use(webpackUniversalAndHot({
  webpackConfig: require(config.paths.root + '/webpack.config.js'),
  isDev: config.isDev,
  isHot: true,
  clientEntry: 'main',
  serverEntry: 'server',
  clientStatsFileName: 'clientStats.json',
  serverStatsFileName: 'serverStats.json',
  getServerRendererOptions: (data) => ({ ...data, app, io, server })
}))

module.exports = {
  app,
  io,
  server
}
