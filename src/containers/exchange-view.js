import React, { Component } from 'react'
import logdown from 'logdown'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { withData } from 'react-universal-data'
import { DEBUG_SCOPE_EXCHANGE_VIEW } from '../constants'
import { CurrencyInput, ExchangeViewMiddleBar } from '../components'
import { exchange } from '../store/reducers'
import * as actions from '../store/exchange'
import { noop } from '../utils'

const logger = logdown(DEBUG_SCOPE_EXCHANGE_VIEW)

const valuePropType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.oneOf([ '' ])
])

const balanceShape = PropTypes.shape({
  value: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired
})

class ExchangeView extends Component {
  static propTypes = {
    balanceBase: balanceShape.isRequired,
    balanceTarget: balanceShape.isRequired,
    baseCurrency: PropTypes.string.isRequired,
    targetCurrency: PropTypes.string.isRequired,
    baseValue: valuePropType.isRequired,
    targetValue: valuePropType.isRequired,
    rate: PropTypes.number.isRequired
  }
  stopGettingLiveRates = noop
  getLiveRates = (currency) => {
    if (currency == null) {
      logger.warn(`Can't get live rates for null or undefined`)
      return
    }

    this.stopGettingLiveRates()
    this.stopGettingLiveRates = this.props.getLiveExchangeRates(currency)
  }
  handleBaseCurrencyChange = (value) => {
    this.props.updateExchangeBaseCurrency(value)
  }
  handleTargetCurrencyChange = (value) => {
    this.props.updateExchangeTargetCurrency(value)
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
    this.getLiveRates(this.props.baseCurrency)
  }
  componentDidUpdate (prevProps) {
    if (this.props.baseCurrency !== prevProps.baseCurrency) {
      this.getLiveRates(this.props.baseCurrency)
    }
  }
  componentWillUnmount () {
    this.stopGettingLiveRates()
  }
  render () {
    const {
      balanceBase,
      balanceTarget,
      baseCurrency,
      baseValue,
      targetCurrency,
      targetValue,
      currencies,
      rate
    } = this.props

    return (
      <>
        <CurrencyInput
          currencyCode={baseCurrency}
          value={baseValue}
          balance={(balanceBase.value - baseValue)}
          onValueChange={this.handleExchangeValueChange(baseCurrency)}
          onCurrencyChange={this.handleBaseCurrencyChange}
          currencies={currencies}
          autoFocus
        />
        <ExchangeViewMiddleBar
          onSwitchCurrencyClick={this.handleSwitchCurrencyClick}
          baseCurrency={baseCurrency}
          targetCurrency={targetCurrency}
          rate={rate}
        />
        <CurrencyInput
          currencyCode={targetCurrency}
          value={targetValue}
          balance={(balanceTarget.value + targetValue)}
          onValueChange={this.handleExchangeValueChange(targetCurrency)}
          onCurrencyChange={this.handleTargetCurrencyChange}
          currencies={currencies}
          autoFocus
          alternateColor
        />
      </>
    )
  }
}

export default compose(
  connect(
    createStructuredSelector({
      baseCurrency: exchange.getBaseCurrency,
      targetCurrency: exchange.getTargetCurrency,
      baseValue: exchange.getBaseValue,
      targetValue: exchange.getTargetValue,
      rate: exchange.getRate
    }),
    (dispatch) => bindActionCreators({
      switchExchangeCurrencies: actions.switchExchangeCurrencies,
      updateExchangeBaseCurrency: actions.updateExchangeBaseCurrency,
      updateExchangeTargetCurrency: actions.updateExchangeTargetCurrency,
      updateExchangeValue: actions.updateExchangeValue,
      getLiveExchangeRates: actions.getLiveExchangeRates,
      getExchangeRates: actions.getExchangeRates
    }, dispatch)
  ),
  withData(
    (props) => {
      props.updateExchangeBaseCurrency(props.balanceBase.currency)
      props.updateExchangeTargetCurrency(props.balanceTarget.currency)

      return props.getExchangeRates(props.balanceBase.currency)
        .then(() => ({ isSuccess: true }))
        .catch((error) => ({ error: error.message }))
    },
    () => false // only update once
  )
)(ExchangeView)
