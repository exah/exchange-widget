import { hot } from 'react-hot-loader'
import { injectGlobal } from 'emotion'
import { ThemeProvider } from 'emotion-theming'
import React, { Component } from 'react'
import { THEME } from './constants'
import ExchangeView from './containers/exchange-view'

class App extends Component {
  constructor (props) {
    super(props)

    injectGlobal`
      :root {
        ${THEME.textStyle.root}
      }
    `
  }
  render () {
    return (
      <ThemeProvider theme={THEME}>
        <ExchangeView
          defaultBaseCurrency='USD' // this should come from user action
          defaultTargetCurrency='GBP'
          balanceBase={1000}
          balanceTarget={1000}
        />
      </ThemeProvider>
    )
  }
}

export default hot(module)(App)
