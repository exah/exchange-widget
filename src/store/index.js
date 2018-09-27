import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

export default (intialState, socket) => {
  const store = createStore(
    reducers,
    intialState,
    applyMiddleware(thunk.withExtraArgument({ socket }))
  )

  if (module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(reducers))
  }

  return store
}
