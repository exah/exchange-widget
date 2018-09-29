import { createStore, applyMiddleware } from 'redux'
import reduxLogdown from 'redux-logdown'
import thunk from 'redux-thunk'
import reducers from './reducers'

export default (intialState, socket) => {
  const store = createStore(
    reducers,
    intialState,
    applyMiddleware(
      thunk.withExtraArgument({ socket }),
      reduxLogdown('exchange-widget:store', { diff: true })
    )
  )

  if (module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(reducers))
  }

  return store
}
