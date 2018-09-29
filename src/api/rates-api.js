import config from 'config'
import { RATES_API_GET_LATEST } from '../constants'
import { fetch, getQuery } from '../utils'

const api = (path) =>
  fetch(config.rates.apiUrl + path)

const getLatest = (base, symbols) =>
  api(RATES_API_GET_LATEST + getQuery({ base, symbols: symbols }))

export {
  getLatest
}
