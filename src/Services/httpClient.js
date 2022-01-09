import axios from "axios";

export function setupHttpClient(store) {
  const { authReducer: { jwt } } = store.getState();

  axios.interceptors.request.use(function (config) {
    config.headers = config.headers || {};

    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt.jwt_access_token}`;
    }

    return config;
  });

  axios.interceptors.response.use(res => res, error => {
    //@ToDo
    return Promise.reject(error);
  });
}
