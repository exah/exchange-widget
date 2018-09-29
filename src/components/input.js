import styled from 'react-emotion'

const Input = styled('input')`
  appearance: none;
  font: inherit;
  line-height: inherit;
  border: none;
  border-radius: none;
  background: none;
  padding: 0;
  margin: 0;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }
`

export {
  Input
}
