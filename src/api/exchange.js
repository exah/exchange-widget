import config from 'config'
import { compile as compilePath } from 'path-to-regexp'
import { API_GET_RATES } from '../constants'
import { fetch } from '../utils'

const api = (path) => fetch(config.public.siteUrl + path)
const ratesPath = compilePath(API_GET_RATES)

const getRates = (currency) => api(ratesPath({ currency }))

export {
  getRates
}
