const express = require('express')
const http = require('http')
const createIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = createIO(server)

module.exports = Object.assign(app, { server, io })
