import globalFetch from 'isomorphic-unfetch'
import logdown from 'logdown'
import { DEBUG_SCOPE } from './constants'

const identity = (val) => val
const noop = () => undefined
const toArray = (src) => src == null ? [] : [].concat(src)

const createLogger = (scope) => logdown(DEBUG_SCOPE + ':' + scope)

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

const getIndent = (lines) => {
  const lengths = lines
    .filter(line => line.trim().length !== 0)
    .map((str) => str.length - str.trimLeft().length)

  const result = Math.min(...lengths)

  return result === Infinity ? 0 : result
}

const dedent = (strings, ...values) => {
  const stripIndent = getIndent(strings.join('').split('\n'))

  const parts = []

  for (let stringIndex = 0; stringIndex < strings.length; stringIndex++) {
    const trimmed = strings[stringIndex]
      .split('\n')
      .map((line, lineIndex) => stringIndex === 0 || lineIndex > 0 ? line.substring(stripIndent) : line)

    parts.push(trimmed.join('\n'))

    if (stringIndex < values.length) {
      const indent = getIndent(trimmed.slice(1))

      parts.push(
        toArray(values[stringIndex]).join('\n' + ''.padStart(indent))
      )
    }
  }

  return parts.join('').trim()
}

export {
  createScopeTypes,
  createLogger,
  dedent,
  noop,
  fetch,
  getQuery,
  identity
}
