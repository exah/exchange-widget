import React from 'react'
import styled from 'react-emotion'
import { Shuffle as IconShuffle, TrendingUp as IconTrendingUp } from 'react-feather'
import { themeGet, getCurrencySymbol } from '../utils'
import { Button } from './button'

const ExchangeViewMiddleBarContainer = styled('div')`
  display: flex;
  align-items: center;
  height: 0;
  margin-left: 10px;
  margin-right: 10px;
  padding-right: ${themeGet('size.default')}px; /* size of missing button on right side */
`

const ExchangeViewMiddleBar = ({
  onSwitchCurrencyClick,
  baseCurrency,
  targetCurrency,
  rate
}) => (
  <ExchangeViewMiddleBarContainer>
    <Button
      type='button'
      tabIndex={-1}
      onClick={onSwitchCurrencyClick}
    >
      <IconShuffle size={14} />
    </Button>
    <Button disabled css={{ margin: '0 auto' }}>
      <Button.Item>
        <IconTrendingUp size={14} css={{ fill: 'none' }} />
      </Button.Item>
      <Button.Item>
        1 {getCurrencySymbol(baseCurrency)} = {rate} {getCurrencySymbol(targetCurrency)}
      </Button.Item>
    </Button>
  </ExchangeViewMiddleBarContainer>
)

export {
  ExchangeViewMiddleBar
}
