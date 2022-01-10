import axios from "axios";

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
