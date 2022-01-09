import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from "redux-thunk";

import rootReducer from "./Reducers";

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

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);
