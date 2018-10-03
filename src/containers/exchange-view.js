import React, { Component } from 'react'
import logdown from 'logdown'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { withData } from 'react-universal-data'
import { DEBUG_SCOPE_EXCHANGE_VIEW } from '../constants'
import { Currency, ExchangeViewMiddleBar, SubmitButton } from '../components'
import { exchange } from '../store/reducers'
import * as exchangeActions from '../store/exchange'
import { noop, composeHocs } from '../utils'

const logger = logdown(DEBUG_SCOPE_EXCHANGE_VIEW)

const valuePropType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.oneOf([ '' ])
])

class ExchangeView extends Component {
  static propTypes = {
    rate: PropTypes.number.isRequired,
    currencies: PropTypes.array.isRequired,
    isValid: PropTypes.bool.isRequired,
    baseBalanceValue: PropTypes.number.isRequired,
    targetBalanceValue: PropTypes.number.isRequired,
    baseCurrency: PropTypes.string,
    targetCurrency: PropTypes.string,
    baseValue: valuePropType.isRequired,
    targetValue: valuePropType.isRequired,
    switchCurrencies: PropTypes.func.isRequired,
    updateBaseCurrency: PropTypes.func.isRequired,
    updateTargetCurrency: PropTypes.func.isRequired,
    updateValue: PropTypes.func.isRequired,
    getLiveExchangeRates: PropTypes.func.isRequired,
    commitBalanceChanges: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired
  }
  constructor (props) {
    super(props)

    props.updateBaseCurrency(props.defaultBaseCurrency)
    props.updateTargetCurrency(props.defaultTargetCurrency)
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
    this.props.updateBaseCurrency(value)
  }
  handleTargetCurrencyChange = (value) => {
    this.props.updateTargetCurrency(value)
  }
  handleValueChange = (currency) => (value) => {
    this.props.updateValue({
      currency,
      value
    })
  }
  handleSubmitClick = (e) => {
    this.props.commitBalanceChanges()
  }
  handleSwitchCurrencyClick = (e) => {
    this.props.switchCurrencies()
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
    this.props.resetState()
  }
  render () {
    const {
      baseBalanceValue,
      targetBalanceValue,
      baseCurrency,
      baseValue,
      targetCurrency,
      targetValue,
      currencies,
      rate,
      isValid
    } = this.props

    return (
      <>
        <Currency
          currencyCode={baseCurrency}
          value={baseValue}
          balance={baseBalanceValue}
          onValueChange={this.handleValueChange(baseCurrency)}
          onCurrencyChange={this.handleBaseCurrencyChange}
          currencies={currencies}
          sign='-'
          autoFocus
        />
        <ExchangeViewMiddleBar
          onSwitchCurrencyClick={this.handleSwitchCurrencyClick}
          baseCurrency={baseCurrency}
          targetCurrency={targetCurrency}
          rate={rate}
        />
        <Currency
          currencyCode={targetCurrency}
          value={targetValue}
          balance={targetBalanceValue}
          onValueChange={this.handleValueChange(targetCurrency)}
          onCurrencyChange={this.handleTargetCurrencyChange}
          currencies={currencies}
          sign='+'
          autoFocus
          alternateColor
        />
        <SubmitButton onClick={this.handleSubmitClick} disabled={!isValid}>
          Exchange
        </SubmitButton>
      </>
    )
  }
}

export default composeHocs(
  connect(
    createStructuredSelector({
      rate: exchange.getRate,
      currencies: exchange.getCurrencies,
      isValid: exchange.getIsValid,
      baseCurrency: exchange.getBaseCurrency,
      targetCurrency: exchange.getTargetCurrency,
      baseValue: exchange.getBaseValue,
      targetValue: exchange.getTargetValue,
      baseBalanceValue: exchange.getBaseBalanceValue,
      targetBalanceValue: exchange.getTargetBalanceValue
    }),
    (dispatch) => bindActionCreators({
      switchCurrencies: exchangeActions.switchCurrencies,
      updateBaseCurrency: exchangeActions.updateBaseCurrency,
      updateTargetCurrency: exchangeActions.updateTargetCurrency,
      updateValue: exchangeActions.updateValue,
      getLiveExchangeRates: exchangeActions.getLiveExchangeRates,
      getExchangeRates: exchangeActions.getExchangeRates,
      getUserBalance: exchangeActions.getUserBalance,
      commitBalanceChanges: exchangeActions.commitBalanceChanges,
      resetState: exchangeActions.resetState
    }, dispatch)
  ),
  withData(
    (props) => (
      Promise.all([
        props.getUserBalance(),
        props.getExchangeRates(props.defaultBaseCurrency)
      ])
        .then(() => ({ isSuccess: true }))
        .catch((error) => ({ error: error.message }))
    ),
    () => false // only update once
  )
)(ExchangeView)
