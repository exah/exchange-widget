import config from 'config'
import { createStore, applyMiddleware } from 'redux'
import reduxLogdown from 'redux-logdown'
import thunk from 'redux-thunk'
import { DEBUG_SCOPE } from '../constants'
import reducers from './reducers'

export default (intialState, socket) => {
  const store = createStore(
    reducers,
    intialState,
    applyMiddleware(
      thunk.withExtraArgument({ socket }),
      reduxLogdown(DEBUG_SCOPE + ':store', { diff: config.isClient })
    )
  )

  if (module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(reducers))
  }

  return store
}
