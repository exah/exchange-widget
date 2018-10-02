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
  border: 1px solid ${themeGet('color.bg')};
  border-radius: 9999px;
`

const SubmitButton = styled(ButtonBase)`
  ${themeGet('textStyle.action')}

  display: block;
  height: 50px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 9999px;
  color: ${themeGet('color.white')};
  background-color: ${themeGet('color.highlight')};
  box-shadow: 0 5px 15px ${themeGet('color.highlightShadow')};
  transition-property: background-color, box-shadow;
  transition-duration: .5s;

  &[disabled] {
    background-color: ${themeGet('color.highlightFaded')};
    box-shadow: 0 5px 15px ${themeGet('color.highlightShadowFaded')};
  }
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
  Button,
  SubmitButton
}
