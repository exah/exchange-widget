import globalFetch from 'isomorphic-unfetch'
import { CURRENCY_SYMBOLS } from './constants'

const identity = (val) => val
const noop = () => undefined
const toArray = (src) => src == null ? [] : [].concat(src)

const getCurrencySymbol = (currencyCode) =>
  CURRENCY_SYMBOLS[currencyCode] || currencyCode

const path = (input, src, fallback) => {
  const paths = typeof input === 'string' ? input.split('.') : toArray(input)
  let val = src
  let idx = 0

  while (idx < paths.length) {
    val = val[paths[idx]]
    idx += 1

    if (val == null) {
      return fallback
    }
  }

  return val === src ? fallback : val
}

const themeGet = (input) => (props) => path(input, props.theme)

const createScopeTypes = (scope) => (...types) =>
  types.reduce((acc, type) => ({
    ...acc,
    [type]: scope + '/' + type
  }), {})

const getQuery = (data = {}) => '?' + (
  Object
    .keys(data)
    .reduce((acc, key) => {
      const value = data[key]
      if (value == null) return acc
      return acc.concat(key + '=' + encodeURIComponent(value))
    }, [])
    .join('&')
)

const fetch = (...args) => globalFetch(...args).then((response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.json()
  }

  return response.json().then((data) => {
    throw Object.assign(new Error(response.statusText), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      url: response.url,
      data
    })
  })
})

export {
  getCurrencySymbol,
  createScopeTypes,
  themeGet,
  path,
  noop,
  fetch,
  getQuery,
  identity
}
