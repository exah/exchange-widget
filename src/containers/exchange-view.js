import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { withData } from 'react-universal-data'
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
    const { fromCurrency } = this.props
    this.watchRatesFor(fromCurrency)
  }
  componentDidUpdate (prevProps) {
    if (prevProps.toCurrency !== this.props.toCurrency) {
      this.stopWatchRates()
      this.watchRatesFor(this.props.fromCurrency)
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
      updateExchangeValue: actions.updateExchangeValue,
      watchExchangeRatesFor: actions.watchExchangeRatesFor,
      getRatesFor: actions.getRatesFor
    }, dispatch)
  ),
  withData(
    (props) => {
      props.updateExchangeFromCurrency({ currency: props.defaultFromCurrency })
      props.updateExchangeToCurrency({ currency: props.defaultToCurrency })
      return props.getRatesFor(props.defaultFromCurrency)
        .then(() => ({ isSuccess: true }))
        .catch((error) => ({ error: error.message }))
    },
    () => false
  )
)(ExchangeView)
