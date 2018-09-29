import config from 'config'
import { compile as compilePath } from 'path-to-regexp'
import { API_GET_RATES, API_GET_CURRENCIES } from '../constants'
import { fetch } from '../utils'

const api = (path) => fetch(config.public.siteUrl + path)
const ratesPath = compilePath(API_GET_RATES)

const getCurrencies = () => api(API_GET_CURRENCIES)
const getRates = (currency) => api(ratesPath({ currency }))

export {
  getCurrencies,
  getRates
}
