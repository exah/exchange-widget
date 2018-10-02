import React from 'react'
import styled from 'react-emotion'
import { Shuffle as IconShuffle, TrendingUp as IconTrendingUp } from 'react-feather'
import { themeGet, getCurrencySymbol } from '../utils'
import { Button } from './button'

const ExchangeViewMiddleBarCollapsed = styled('div')`
  height: 0;
`

const ExchangeViewMiddleBarContainer = styled('div')`
  position: relative;
  display: flex;
  margin-left: 10px;
  margin-right: 10px;
  padding-right: ${themeGet('size.default')}px; /* size of missing button on right side */
  transform: translateY(-50%);
`

const ExchangeViewMiddleBar = ({
  onSwitchCurrencyClick,
  baseCurrency,
  targetCurrency,
  rate
}) => (
  <ExchangeViewMiddleBarCollapsed>
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
          <IconTrendingUp size={14} />
        </Button.Item>
        <Button.Item>
          1&nbsp;{getCurrencySymbol(baseCurrency)} = {rate}&nbsp;{getCurrencySymbol(targetCurrency)}
        </Button.Item>
      </Button>
    </ExchangeViewMiddleBarContainer>
  </ExchangeViewMiddleBarCollapsed>
)

export {
  ExchangeViewMiddleBar
}
