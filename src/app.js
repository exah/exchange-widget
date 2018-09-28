import { hot } from 'react-hot-loader'
import React, { Component } from 'react'
import ExchangeView from './containers/exchange-view'

class App extends Component {
  render () {
    return (
      <ExchangeView
        defaultFromCurrency='USD' // this should come from user action
        defaultToCurrency='GBP'
      />
    )
  }
}

export default hot(module)(App)
