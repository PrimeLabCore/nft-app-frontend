import qs from 'qs';
import axios from "axios";

import { API_BASE_URL } from "../Utils/config";

/**
 * Intercept the request and response of our http client - axios to improve its functionality.
 * @param {Store} store The redux store
 * @param {Function} onUnauthorizedCallback Upon receiving 401 response (unauthorized) from the server, call this callback function.
 */
export function setupHttpClient(store, onUnauthorizedCallback) {
  const { authReducer: { jwt } } = store.getState();

  axios.interceptors.request.use(function (config) {
    config.headers = config.headers || {};

    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt.jwt_access_token}`;
    }

    return config;
  });

  axios.interceptors.response.use(res => res, error => {
    const status = error.response && error.response.status;
    if (status === 401) {
      onUnauthorizedCallback()
    }
    return Promise.reject(error);
  });
}

// Request helper function
export default function request({
  url,
  method = 'get',
  params = {},
  headers = {},
  body = {},
  type = 'application/json',
  stringify = false,
  timeout = 20000
}) {
  if (!url) return Promise.reject(new Error('Request URL is undefined'));
  const urlParams = {
    ...params
  };
  const reqHeaders = {
    Accept: 'application/json',
    'Content-Type': type,
    ...headers
  };
  const apiUrl = `${API_BASE_URL}${url}`;
  const formattedBody = stringify
    ? Object.keys(body).reduce((acc, key) => {
        acc[key] =
          typeof body[key] === 'object' ? JSON.stringify(body[key]) : body[key];
        return acc;
      }, {})
    : body;
  return axios({
    method,
    url: apiUrl,
    data: stringify ? qs.stringify(formattedBody) : formattedBody,
    params: urlParams,
    headers: reqHeaders,
    timeout
  });
}
