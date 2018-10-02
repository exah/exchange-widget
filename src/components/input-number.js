import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input } from './input'
import { noop } from '../utils'

const KEY_ARROW_UP = 'ArrowUp'
const KEY_ARROW_DOWN = 'ArrowDown'

class InputNumber extends Component {
  static defaultProps = {
    prefix: '',
    value: '',
    onChange: noop
  }
  static propTypes = {
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    prefix: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }
  format = (value) => value > 0 ? this.props.prefix + String(value) : value
  normalize = (value) => parseInt(String(value).replace(this.props.prefix, ''))
  handleChange = (e) => {
    this.props.onChange(this.normalize(e.currentTarget.value))
  }
  handleKeyDown = (e) => {
    const { value, onChange } = this.props

    if ([ KEY_ARROW_UP, KEY_ARROW_DOWN ].includes(e.key)) {
      e.preventDefault()
      onChange(e.key === KEY_ARROW_UP ? value + 1 : value - 1)
    }
  }
  render () {
    const { value, onChange, prefix, ...rest } = this.props

    return (
      <Input
        type='text'
        inputMode='numeric'
        value={this.format(value)}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        {...rest}
      />
    )
  }
}

export {
  InputNumber
}
