const fd = new FormData();

//email signup
if (LoginFormMethod === "email") {
  fd.append("user[email]", signupEmail);
  fd.append("user[account_id]", accountId?.replace(".", "") + ".near");

  fd.append("user[full_name]", fullname);
}

//phone sign up
else {
  fd.append("user[phone_no]", signupPhone);
  fd.append("user[account_id]", accountId + ".near");
  fd.append("user[full_name]", fullname);
}

//sign up ajax
const response = await axios.post(`${API_BASE_URL}/signup`, fd);
const { success, errors } = response.data;

if (success) {
  const {
    headers: { authorization },
    data: { data },
  } = response;

  //
  axios.interceptors.request.use(function (config) {
    config.headers.Authorization = authorization;
    return config;
  });

  dispatch({
    type: "login_Successfully",
    payload: { ...data, token: authorization },
  });

  //cloudsponge import on signup
  localStorage.setItem("welcome", true);

  setIsloading(false);
  navigate(redirectUrl ? redirectUrl : "/");
} else {
  toast.error(errors[0]);
  setIsloading(false);
}

const createAccount = () => {
  // navigate("/signup/gift-nft")
  // dispatch({ type: 'open_dialog_gift_nft' })
  window.dataLayer.push({
    event: "event",
    eventProps: {
      category: "Signup",
      action: "Created Account",
      label: "Signup",
      value: "Signup",
    },
  });
};

//old codes

// const token = store.getState().session.token;

// localStorage.setItem(
//   "user",
//   JSON.stringify({ ...data, token: authorization })
// );

// navigate("verification");
// toast.error("Already Taken");

// && status === 200 || status === 201

// } catch (e) {
//   console.log("Error", e);
//   // toast.error("Already Taken");
// }
