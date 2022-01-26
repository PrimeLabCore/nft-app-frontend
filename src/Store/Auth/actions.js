import {
  AUTH_LOGOUT,
  AUTH_SET_DYNAMIC_PARAM,
  AUTH_SET_SESSION,
  AUTH_SUCCESSFUL_LOGIN
} from "./actionTypes";

export const actionLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("welcome");
  localStorage.removeItem("firstImport");
  return {
    type: AUTH_LOGOUT
  };
}

export const actionSetSession = payload => ({
  type: AUTH_SET_SESSION,
  payload
});

export const actionSuccessfulLogin = payload => ({
  type: AUTH_SUCCESSFUL_LOGIN,
  payload
});

export const actionSetDynamic = (key, value) => ({
  type: AUTH_SET_DYNAMIC_PARAM,
  payload: {
    key,
    value
  }
});