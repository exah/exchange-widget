import React from 'react'
import styled from 'react-emotion'
import { Input } from './input'
import { MediaObject } from './media-object'
import { Select } from './select'
import { themeGet, getCurrencySymbol } from '../utils'

const CurrencyContainer = styled('div')`
  padding-top: 50px;
  padding-bottom: 50px;
  padding-left: 15px;
  padding-right: 15px;
  background-color: ${(props) => props.alternateColor && themeGet('color.alternate')};
`

const CurrencyWrapper = styled('div')`
  ${themeGet('textStyle.accent')}
`

const CurrencyWrapperInput = styled(Input)`
  width: 100%;
  text-align: right;
  color: ${props => themeGet(props.value ? 'color.text' : 'color.faded')};

  &::placeholder {
    color: ${themeGet('color.faded')}
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }
`

const BalanceWrapper = styled('div')`
  ${themeGet('textStyle.caption')}

  margin-top: 10px;
  color: ${themeGet('color.faded')}
`

const CurrencyInput = ({
  alternateColor,
  currencyCode,
  balance,
  value,
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
            label={currencyCode}
            value={currencyCode}
            onChange={onCurrencyChange}
          >
            {({ getOptionProps }) => currencies.map((optionCurrency) => (
              <Select.Option
                key={optionCurrency}
                {...getOptionProps(optionCurrency)}
              >
                {optionCurrency}
              </Select.Option>
            ))}
          </Select>
        </MediaObject.Side>
        <MediaObject.Content>
          <CurrencyWrapperInput
            type='number'
            autoFocus={autoFocus}
            value={value}
            onChange={onValueChange}
            placeholder={0}
            min={0}
          />
        </MediaObject.Content>
      </MediaObject>
    </CurrencyWrapper>
    <BalanceWrapper>
      Balance: {Math.max(balance, 0)} {getCurrencySymbol(currencyCode)}
    </BalanceWrapper>
  </CurrencyContainer>
)

export {
  CurrencyInput
}
