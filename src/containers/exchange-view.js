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
import * as actions from '../store/exchange'
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
    switchExchangeCurrencies: PropTypes.func.isRequired,
    updateExchangeBaseCurrency: PropTypes.func.isRequired,
    updateExchangeTargetCurrency: PropTypes.func.isRequired,
    updateExchangeValue: PropTypes.func.isRequired,
    getLiveExchangeRates: PropTypes.func.isRequired,
    commitBalanceChanges: PropTypes.func.isRequired,
    resetExchangeState: PropTypes.func.isRequired
  }
  constructor (props) {
    super(props)

    props.updateExchangeBaseCurrency(props.defaultBaseCurrency)
    props.updateExchangeTargetCurrency(props.defaultTargetCurrency)
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
  handleExchangeValueChange = (currency) => (value) => {
    this.props.updateExchangeValue({
      currency,
      value
    })
  }
  handleSubmitClick = (e) => {
    this.props.commitBalanceChanges()
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
    this.props.resetExchangeState()
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
          onValueChange={this.handleExchangeValueChange(baseCurrency)}
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
          onValueChange={this.handleExchangeValueChange(targetCurrency)}
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
      switchExchangeCurrencies: actions.switchExchangeCurrencies,
      updateExchangeBaseCurrency: actions.updateExchangeBaseCurrency,
      updateExchangeTargetCurrency: actions.updateExchangeTargetCurrency,
      updateExchangeValue: actions.updateExchangeValue,
      getLiveExchangeRates: actions.getLiveExchangeRates,
      getExchangeRates: actions.getExchangeRates,
      getUserBalance: actions.getUserBalance,
      commitBalanceChanges: actions.commitBalanceChanges,
      resetExchangeState: actions.resetExchangeState
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
