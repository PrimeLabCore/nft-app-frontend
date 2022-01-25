import {
  APP_STATE_SET_DYNAMIC,
  APP_STATE_SET_DYNAMIC_MULTIPLE,
  APP_STATE_SET_LOGIN_FORM_METHOD,
  APP_STATE_SET_GOOGLE_CONTACTS_DATA
} from "./actionTypes";

/**
 *
 * @param {String} key
 * @param {*} value
 * @returns {{payload: {value, key}, type: string}}
 */
export const actionAppStateSetDynamic = (key, value) => ({
  type: APP_STATE_SET_DYNAMIC,
  payload: {
    key,
    value
  }
});

/**
 *
 * @param {Object<string, *>} payload
 * @returns {{payload, type: string}}
 */
export const actionAppStateSetDynamicMultiple = (payload) => ({
  type: APP_STATE_SET_DYNAMIC_MULTIPLE,
  payload
});

/**
 * Set login form method.
 * @param {("phone"|"email")} method
 * @returns {{payload, type: string}}
 */
export const actionAppStateSetLoginFormMethod = method => ({
  type: APP_STATE_SET_LOGIN_FORM_METHOD,
  payload: method
});

export const actionAppStateGoogleContacts = payload => ({
  type: APP_STATE_SET_GOOGLE_CONTACTS_DATA,
  payload: Array.isArray(payload) ? payload : []
});