import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { exchange } from '../store/reducers'
import * as actions from '../store/exchange'
import { noop } from '../utils'

class ExchangeView extends Component {
  stopWatchRates = noop
  watchRatesFor = (currency) => {
    this.stopWatchRates = this.props.watchExchangeRatesFor({ currency })
  }
  handleExchangeValueChange = (currency) => (e) => {
    this.props.updateExchangeValue({
      currency,
      value: e.currentTarget.value
    })
  }
  handleSwitchCurrencyClick = (e) => {
    this.props.switchExchangeCurrencies()
  }
  componentDidMount () {
    const {
      updateExchangeFromCurrency,
      updateExchangeToCurrency,
      defaultToCurrency,
      defaultFromCurrency
    } = this.props

    updateExchangeFromCurrency({ currency: defaultFromCurrency })
    updateExchangeToCurrency({ currency: defaultToCurrency })

    this.watchRatesFor(defaultToCurrency)
  }
  componentDidUpdate (prevProps) {
    if (prevProps.toCurrency !== this.props.toCurrency) {
      this.stopWatchRates()
      this.watchRatesFor(this.props.toCurrency)
    }
  }
  componentWillUnmount () {
    this.stopWatchRates()
  }
  render () {
    const {
      fromCurrency,
      fromValue,
      toCurrency,
      toValue,
      rate
    } = this.props

    return (
      <div>
        <div>
          <div>From {fromCurrency}</div>
          <input
            type='number'
            value={fromValue}
            placeholder={0}
            min={0}
            onChange={this.handleExchangeValueChange(fromCurrency)}
            autoFocus
          />
        </div>
        <div>
          Rate: {rate}
        </div>
        <div>
          <div>To {toCurrency}</div>
          <input
            type='number'
            value={toValue}
            placeholder={0}
            min={0}
            onChange={this.handleExchangeValueChange(toCurrency)}
          />
        </div>
        <div>
          <button type='button' onClick={this.handleSwitchCurrencyClick}>
            switch
          </button>
        </div>
      </div>
    )
  }
}

export default compose(
  connect(
    createStructuredSelector({
      fromCurrency: exchange.getFromCurrency,
      toCurrency: exchange.getToCurrency,
      fromValue: exchange.getFromValue,
      toValue: exchange.getToValue,
      rate: exchange.getRate
    }),
    (dispatch) => bindActionCreators({
      switchExchangeCurrencies: actions.switchExchangeCurrencies,
      updateExchangeFromCurrency: actions.updateExchangeFromCurrency,
      updateExchangeToCurrency: actions.updateExchangeToCurrency,
      watchExchangeRatesFor: actions.watchExchangeRatesFor,
      updateExchangeValue: actions.updateExchangeValue
    }, dispatch)
  )
)(ExchangeView)
