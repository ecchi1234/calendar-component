import { createStore, applyMiddleware, compose } from 'redux';
import reducers from 'redux-part';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    reducers,
    compose(
      applyMiddleware(sagaMiddleware),
      window['devToolsExtension']
        ? window['devToolsExtension']()
        : function (f) {
            return f;
          }
    )
  );

export default store;