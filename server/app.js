const config = require('config')
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const webpackUniversalAndHot = require('@exah/webpack-universal-hot-middleware')
const webpackConfig = require(config.paths.root + '/webpack.config.js')
const sample = require('../data/latest.json')
const app = require('./create-app')

app.use(bodyParser.json())
app.use(compression({ threshold: 0 }))

app.use(express.static(config.paths.public, {
  maxAge: config.isDev ? 0 : 1000 * 60 * 60 * 24 * 7 // 7 days
}))

app.use(webpackUniversalAndHot({
  webpackConfig,
  isDev: config.isDev,
  isHot: true,
  clientEntry: 'main',
  serverEntry: 'server',
  clientStatsFileName: 'clientStats.json',
  serverStatsFileName: 'serverStats.json'
}))

app.io.on('connection', (socket) => {
  socket.on('exchange-currency', (currency) => {
    console.log('exchange-currency', currency)
    socket.emit('exchange-rates', sample)
  })
})

module.exports = app
