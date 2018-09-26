import 'defaults.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { hydrateData } from 'react-universal-data'
import { hydrate as hydrateCSS } from 'emotion'
import App from './app'

// Get server state
const { cssIds, initialData } = (window._ssr || {})

// Restore emotion css ids and withData state
hydrateCSS(cssIds)
hydrateData(initialData)

ReactDOM.hydrate(<App />, document.getElementById('app'))
