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
      :focus {
        outline: 1px solid ${THEME.color.focus};
      }
    `
  }
  render () {
    return (
      <ThemeProvider theme={THEME}>
        <ExchangeView
          // this should come from user action
          balanceBase={{ value: 1000, currency: 'USD' }}
          balanceTarget={{ value: 1000, currency: 'GBP' }}
        />
      </ThemeProvider>
    )
  }
}

export default hot(module)(App)
