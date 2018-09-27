import 'defaults.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { hydrateData } from 'react-universal-data'
import { Provider as ReduxProvider } from 'react-redux'
import { hydrate as hydrateCSS } from 'emotion'
import socket from '../api/client-socket'
import createStore from '../store'
import App from '../app'

// Socket
socket.emit('exchange-currency', 'USD')
socket.on('exchange-rates', (data) => console.log(data))

// Get server state
const { cssIds, intialState, initialData } = (window._ssr || {})

// Restore emotion css ids and withData state
const store = createStore(intialState, socket)
hydrateCSS(cssIds)
hydrateData(initialData)

ReactDOM.hydrate((
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
), document.getElementById('app'))
