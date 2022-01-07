const fd = new FormData();
// if (loginForm === "email") {
fd.append("user[email]", email);
// } else {
//   fd.append("user[password]", 11223344);
// }

const response = await axios.post(`${API_BASE_URL}/login`, fd);
const { status } = response;

if (status === 200 || status === 201) {
  const {
    headers: { authorization },
    data: { data },
  } = response;

  axios.interceptors.request.use(function (config) {
    // const token = store.getState().session.token;
    config.headers.Authorization = authorization;

    return config;
  });
  dispatch({
    type: "login_Successfully",
    payload: { ...data, token: authorization },
  });
  // localStorage.setItem(
  //   "user",
  //   JSON.stringify({ ...data, token: authorization })
  // );
  navigate(redirectUrl ? redirectUrl : "/");
} else {
  navigate("verification");
}
