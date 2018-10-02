import config from 'config'
import { compile as compilePath } from 'path-to-regexp'
import { API_GET_RATES, API_GET_USER_BALANCE } from '../constants'
import { fetch } from '../utils'

const api = (path) => fetch(config.public.siteUrl + path)
const ratesPath = compilePath(API_GET_RATES)

const getRates = (currency) => api(ratesPath({ currency }))
const getUserBalance = () => api(API_GET_USER_BALANCE)

export {
  getRates,
  getUserBalance
}
