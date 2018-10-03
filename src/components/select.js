import React, { Component } from 'react'
import styled from 'react-emotion'
import PropTypes from 'prop-types'
import { ChevronDown as IconDown, ChevronUp as IconUp } from 'react-feather'
import { themeGet, noop } from '../utils'

const SelectWrapper = styled('div')`
  position: relative;
  cursor: pointer;
`

const SelectDropdown = styled('div')`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  min-width: 100%;
  background-color: ${themeGet('color.white')};
  box-shadow: 0 0 30px ${themeGet('color.shadow')};
  border-radius: 10px;
  margin-top: 10px;
  overflow: hidden;
  padding-left: 5px;
  padding-right: 5px;
`

const SelectLabel = styled('div')`
  display: flex;
  align-items: center;
`

const SelectLabelText = styled('div')`
  margin-right: 5px;
`

const SelectOption = styled('div')`
  ${themeGet('textStyle.option')}

  background-color: ${props => props.isActive && themeGet('color.accent')};
  color: ${props => props.isActive && themeGet('color.white')};
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  margin-top: 5px;
  margin-bottom: 5px;
`

const defaultGetLabel = ({ value, label, placeholder }) =>
  value == null ? placeholder : label

class Select extends Component {
  static Option = SelectOption
  static defaultProps = {
    onChange: noop,
    getLabel: defaultGetLabel
  }
  static propTypes = {
    value: PropTypes.any,
    children: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    getLabel: PropTypes.func
  }
  constructor (props) {
    super(props)

    const {
      value = props.defaultValue,
      label = props.defaultLabel
    } = props

    this.state = {
      value,
      label,
      isControlled: props.value !== undefined,
      isOpen: false
    }
  }
  handleClick = (e) => {
    this.setState((state) => ({
      isOpen: !state.isOpen
    }))
  }
  handleBlur = (e) => {
    this.setState({ isOpen: false })
  }
  getOptionProps = ({ value, label }) => {
    const { isControlled } = this.state
    return {
      isActive: isControlled ? value === this.props.value : value === this.state.value,
      onClick: (e) => {
        e.preventDefault()
        this.props.onChange(value, label)

        if (!isControlled) {
          this.setState({ value, label })
        }
      }
    }
  }
  render () {
    const { getLabel, children, placeholder } = this.props
    const { isOpen, isControlled } = this.state

    const label = isControlled ? this.props.label : this.state.label
    const value = isControlled ? this.props.value : this.state.value

    const dropdownEl = (
      <SelectDropdown>
        {children({ getOptionProps: this.getOptionProps })}
      </SelectDropdown>
    )

    return (
      <SelectWrapper
        onClick={this.handleClick}
        onBlur={this.handleBlur}
        tabIndex={1}
      >
        <SelectLabel>
          <SelectLabelText>
            {getLabel({ value, label, isOpen, placeholder })}
          </SelectLabelText>
          {isOpen ? <IconUp /> : <IconDown />}
        </SelectLabel>
        {isOpen && dropdownEl}
      </SelectWrapper>
    )
  }
}

export {
  Select,
  SelectOption
}
