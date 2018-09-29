import React from 'react'
import styled from 'react-emotion'
import { Input } from './input'
import { MediaObject } from './media-object'
import { themeGet } from '../utils'

const CurrencyWrapper = styled('div')`
  ${themeGet('textStyle.accent')}
`

const CurrencyWrapperInput = styled(Input)`
  width: 100%;
  text-align: right;

  &::placeholder {
    color: ${themeGet('color.faded')}
  }

  ${(props) => `
    color: ${!props.value ? themeGet('color.faded') : themeGet('color.text')};
  `}
`

const BalanceWrapper = styled('div')`
  ${themeGet('textStyle.caption')}
  color: ${themeGet('color.faded')}
`

const CurrencyInput = ({
  currencyCode,
  currencySymbol,
  balance,
  value,
  onChange,
  autoFocus,
  tabIndex
}) => (
  <>
    <CurrencyWrapper>
      <MediaObject>
        <MediaObject.Side>
          <div>
            {currencyCode}
          </div>
        </MediaObject.Side>
        <MediaObject.Content>
          <CurrencyWrapperInput
            type='number'
            autoFocus={autoFocus}
            value={value}
            onChange={onChange}
            placeholder={0}
            min={0}
          />
        </MediaObject.Content>
      </MediaObject>
    </CurrencyWrapper>
    <BalanceWrapper>
      Balance: {balance} {currencySymbol}
    </BalanceWrapper>
  </>
)

export {
  CurrencyInput
}
