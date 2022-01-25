import {
  AUTH_LOGOUT, AUTH_SET_DYNAMIC_PARAM,
  AUTH_SET_SESSION,
  AUTH_SUCCESSFUL_LOGIN
} from "./actionTypes";

const initialValue = {
  user: null,
  jwt: null,
  signupEmail: "",
  signupPhone: "",
  nft: null,
  redirectUrl: null,
  contacts: [],
  otp_medium: "",
};

const authReducer = (state = initialValue, action) => {
  switch (action.type) {
    case AUTH_LOGOUT:
      return {
        ...state,
        user: null,
        jwt: null,
      };
    case AUTH_SET_SESSION:
      return {
        ...state,
        user: action.payload.user,
        jwt: action.payload.jwt,
      };
    case AUTH_SUCCESSFUL_LOGIN:
      return {
        ...state,
        user: action.payload,
      };
    case AUTH_SET_DYNAMIC_PARAM:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    default:
      return state;
  }
};

export default authReducer;
