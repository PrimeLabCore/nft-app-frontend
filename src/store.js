import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import rootReducer from "./Reducers";
import thunk from "redux-thunk";

const persistConfig = {
  key: 'root',
  storage,
}

const composeEnhancers =
  window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;

// const store = createStore(
//   rootReducer,
//   composeEnhancers(applyMiddleware(thunk))
// );

const persistedReducer = persistReducer(persistConfig, rootReducer)
 
// export default () => {
  const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(thunk))
  );

//   let persistor = persistStore(store)
//   return { store, persistor }
// }

export default store;