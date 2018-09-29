export const DEBUG_SCOPE = 'exchange-widget'

export const API_GET_RATES = '/api/rates/:currency'
export const RATES_API_GET_LATEST = '/api/latest'
export const API_SOCKET_REQUEST_LIVE_RATES = 'exchange-rates.live.request'
export const API_SOCKET_GET_LIVE_RATES = 'exchange-rates.live.get'

export const THEME_COLORS = {
  text: '#000',
  faded: 'rgba(0, 0, 0, 0.5)',
  accent: '#1880EE',
  highlight: '#E63FA5',
  bg: 'rgba(0, 0, 0, 0.93)'
}

export const THEME_TEXT_STYLES = {
  root: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: 18,
    lineHeight: 1.2,
    fontWeight: 400
  },
  default: {
    fontSize: '1rem',
    fontWeight: 400
  },
  accent: {
    fontSize: '1.4rem',
    fontWeight: 500
  },
  caption: {
    fontSize: '0.8rem',
    fontWeight: 300
  }
}

export const THEME = {
  color: THEME_COLORS,
  textStyle: THEME_TEXT_STYLES
}
