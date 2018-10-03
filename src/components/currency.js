import React from 'react'
import styled from 'react-emotion'
import { MediaObject } from './media-object'
import { Select } from './select'
import { InputNumber } from './input-number'
import { themeGet, getCurrencySymbol } from '../utils'

const CurrencyContainer = styled('div')`
  padding-top: 50px;
  padding-bottom: 50px;
  padding-left: 15px;
  padding-right: 15px;
  background-color: ${(props) => props.alternateColor ? themeGet('color.bg') : themeGet('color.white')};
`

const CurrencyWrapper = styled('div')`
  ${themeGet('textStyle.accent')}
`

const CurrencyInput = styled(InputNumber)`
  width: 100%;
  text-align: right;
`

const BalanceWrapper = styled('div')`
  ${themeGet('textStyle.caption')}

  margin-top: 10px;
  color: ${themeGet('color.faded')}
`

const Currency = ({
  alternateColor,
  currencyCode,
  balance,
  value,
  sign,
  onCurrencyChange,
  onValueChange,
  currencies = [],
  autoFocus,
  tabIndex
}) => (
  <CurrencyContainer alternateColor={alternateColor}>
    <CurrencyWrapper>
      <MediaObject>
        <MediaObject.Side>
          <Select
            placeholder='Select'
            label={currencyCode}
            value={currencyCode}
            onChange={onCurrencyChange}
          >
            {({ getOptionProps }) => currencies.map((optionCurrency) => (
              <Select.Option
                key={optionCurrency}
                {...getOptionProps({ value: optionCurrency })}
              >
                {optionCurrency}
              </Select.Option>
            ))}
          </Select>
        </MediaObject.Side>
        <MediaObject.Content>
          <CurrencyInput
            placeholder={0}
            autoFocus={autoFocus}
            prefix={sign}
            value={value}
            onChange={onValueChange}
          />
        </MediaObject.Content>
      </MediaObject>
    </CurrencyWrapper>
    <BalanceWrapper>
      Balance: {balance} {getCurrencySymbol(currencyCode)}
    </BalanceWrapper>
  </CurrencyContainer>
)

export {
  Currency
}
