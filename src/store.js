import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from "redux-thunk";
import { createLogger } from 'redux-logger';

import rootReducer from "./Reducers";
import { setupHttpClient } from './Services/httpClient';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authReducer'] // which reducer want to store
};

let composeEnhancers = compose;

if (process.env.REACT_APP_ENV === 'development') {
  const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  if (typeof composeWithDevToolsExtension === 'function') {
    composeEnhancers = composeWithDevToolsExtension;
  }
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk];

if (process.env.REACT_APP_ENV === 'development') {
  middleware.push(createLogger({ collapsed: true, duration: true }));
}

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

const dispatch = store.dispatch;
const onUnauthorizedCallback = () => {
  dispatch({ type: "auth/logout" });
};

export const persistor = persistStore(store);

persistor.subscribe(() => {
  const { bootstrapped } = persistor.getState();
  if (bootstrapped) {
    setupHttpClient(store, onUnauthorizedCallback)
  }
});
