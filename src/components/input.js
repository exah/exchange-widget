import styled from 'react-emotion'
import { themeGet } from '../utils'

const isEmpty = (value) => value == null || value === ''

const Input = styled('input')`
  appearance: none;
  font: inherit;
  line-height: inherit;
  border: none;
  border-radius: none;
  background: none;
  padding: 0;
  margin: 0;
  color: ${props => themeGet(isEmpty(props.value) ? 'color.faded' : 'color.text')};

  &::placeholder {
    color: ${themeGet('color.faded')}
  }
`

export {
  Input
}
