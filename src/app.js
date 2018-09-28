import { hot } from 'react-hot-loader'
import React, { Component } from 'react'
import ExchangeView from './containers/exchange-view'

class App extends Component {
  render () {
    return (
      <ExchangeView />
    )
  }
}

export default hot(module)(App)
