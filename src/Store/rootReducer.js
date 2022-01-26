import { combineReducers } from "redux";

// -------These reducer files will be created in Reducers folder then will be imported here

import nftReducer from './NFT/reducer';
import authReducer from "./Auth/reducer";
import transactionsReducer from "./Transactions/reducer";
import appStateReducer from "./AppState/reducer";
import { AUTH_LOGOUT } from "./Auth/actionTypes";

// Here all reducers will get combined
const appReducer = combineReducers({
  authReducer,
  transactions: transactionsReducer,
  nft: nftReducer,
  appState: appStateReducer
});

export default (state, action) => {
  if (action.type === AUTH_LOGOUT) {
    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}
