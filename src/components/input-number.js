import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input } from './input'
import { noop, round } from '../utils'

const KEY_ARROW_UP = 'ArrowUp'
const KEY_ARROW_DOWN = 'ArrowDown'
const DECIMAL_REGEX = /(\.|\.\d?0)$/

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
  static getDerivedStateFromProps (props, state) {
    const isDecimal = DECIMAL_REGEX.test(state.value)
    return {
      value: isDecimal ? state.value : props.value
    }
  }
  state = {
    value: this.props.value
  }
  format = (value) => value > 0 ? this.props.prefix + String(value) : value
  normalize = (value) => String(value).replace(this.props.prefix, '')
  change = (value) => {
    if (Number.isNaN(Number(value))) return

    this.setState({ value })
    this.props.onChange(value ? round(value, 2) : value)
  }
  handleChange = (e) => {
    this.change(this.normalize(e.currentTarget.value))
  }
  handleKeyDown = (e) => {
    const { value } = this.props

    if ([ KEY_ARROW_UP, KEY_ARROW_DOWN ].includes(e.key)) {
      e.preventDefault()
      this.change(e.key === KEY_ARROW_UP ? value + 1 : value - 1)
    }
  }
  render () {
    const { value, onChange, prefix, ...rest } = this.props

    return (
      <Input
        type='text'
        inputMode='numeric'
        pattern='\d*'
        value={this.format(this.state.value)}
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
