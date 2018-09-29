import config from 'config'
import { OXCR_API_GET_RATES, OXCR_API_GET_CURRENCIES } from '../constants'
import { fetch, getQuery } from '../utils'

const api = (path) =>
  fetch(config.oxcr.apiUrl + path)

const getCurrencies = () =>
  api(OXCR_API_GET_CURRENCIES)

const getRates = (base) =>
  api(OXCR_API_GET_RATES + getQuery({ base, app_id: config.oxcr.appId }))

export {
  api,
  getCurrencies,
  getRates
}
