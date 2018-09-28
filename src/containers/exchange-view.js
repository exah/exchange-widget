import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { exchange } from '../store/reducers'
import * as actions from '../store/exchange'

class ExchangeView extends Component {
  componentDidMount () {
    const { updateAndEmitExchangeToCurrency, watchExchangeRatesChanges } = this.props

    updateAndEmitExchangeToCurrency('GBP')
    this.stopWatchExchangeRatesChanges = watchExchangeRatesChanges()
  }
  componentWillUnmount () {
    this.stopWatchExchangeRatesChanges()
  }
  handleChange = (currency) => (e) => {
    this.props.updateExchangeValue({
      currency,
      value: e.currentTarget.value
    })
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
            onChange={this.handleChange(fromCurrency)}
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
            onChange={this.handleChange(toCurrency)}
          />
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
      updateAndEmitExchangeToCurrency: actions.updateAndEmitExchangeToCurrency,
      watchExchangeRatesChanges: actions.watchExchangeRatesChanges,
      updateExchangeValue: actions.updateExchangeValue,
      updateExchangeToCurrency: actions.updateExchangeToCurrency
    }, dispatch)
  )
)(ExchangeView)
