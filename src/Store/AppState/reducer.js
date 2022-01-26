import {
  APP_STATE_SET_DYNAMIC,
  APP_STATE_SET_DYNAMIC_MULTIPLE, APP_STATE_SET_LOGIN_FORM_METHOD,
  APP_STATE_SET_GOOGLE_CONTACTS_DATA
} from "./actionTypes";

const initialValue = {
  createNFTPopupIsOpen: false,
  sendNFTPopupIsOpen: false,
  giftNFTPopupIsOpen: false,
  menuTooltipIsOpen: false,
  loginFormMethod: "email",
  googleContactData: []
};

const transactionsReducer = (state = initialValue, action) => {
  switch (action.type) {
    case APP_STATE_SET_DYNAMIC:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      }
    case APP_STATE_SET_DYNAMIC_MULTIPLE:
      return {
        ...state,
        ...action.payload
      }
    case APP_STATE_SET_LOGIN_FORM_METHOD:
      return {
        ...state,
        loginFormMethod: action.payload
      }
    case APP_STATE_SET_GOOGLE_CONTACTS_DATA:
      return {
        ...state,
        googleContactData: action.payload
      }
    default:
      return state;
  }
};
export default transactionsReducer;
