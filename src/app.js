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
          defaultFromCurrency='USD' // this should come from user action
          defaultToCurrency='GBP'
        />
      </ThemeProvider>
    )
  }
}

export default hot(module)(App)
