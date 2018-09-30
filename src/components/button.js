import styled from 'react-emotion'
import { themeGet } from '../utils'

const ButtonBase = styled('button')`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: none;
`

const Button = styled(ButtonBase)`
  padding-left: 8px;
  padding-right: 8px;
  min-width: ${themeGet('size.default')}px;
  min-height: ${themeGet('size.default')}px;
  background: ${themeGet('color.white')};
  color: ${themeGet('color.accent')};
  border: 1px solid ${themeGet('color.alternate')};
  border-radius: 9999px;
`

const ButtonItem = styled('span')`
  display: inline-flex;
  flex-shrink: 0;

  & + & {
    margin-left: 8px
  }
`

Object.assign(Button, {
  Item: ButtonItem
})

export {
  ButtonBase,
  ButtonItem,
  Button
}
