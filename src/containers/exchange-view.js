import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { withData } from 'react-universal-data'
import { CurrencyInput, ExchangeViewMiddleBar } from '../components'
import { exchange } from '../store/reducers'
import * as actions from '../store/exchange'
import { noop } from '../utils'

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
    this.stopGettingLiveRates()
    this.stopGettingLiveRates = this.props.getLiveExchangeRates({ currency })
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
    const { baseCurrency } = this.props
    this.getLiveRates(baseCurrency)
  }
  componentDidUpdate (prevProps) {
    if (prevProps.targetCurrency !== this.props.targetCurrency) {
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
      rate
    } = this.props

    return (
      <>
        <CurrencyInput
          currencyCode={baseCurrency}
          value={baseValue}
          balance={(balanceBase.value - baseValue)}
          onChange={this.handleExchangeValueChange(baseCurrency)}
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
          onChange={this.handleExchangeValueChange(targetCurrency)}
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
      props.updateExchangeBaseCurrency({ currency: props.balanceBase.currency })
      props.updateExchangeTargetCurrency({ currency: props.balanceTarget.currency })
      return props.getExchangeRates(props.balanceBase.currency)
        .then(() => ({ isSuccess: true }))
        .catch((error) => ({ error: error.message }))
    },
    () => false
  )
)(ExchangeView)
