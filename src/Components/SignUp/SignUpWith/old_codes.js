useEffect(() => {
  par["email"] = "zeeshan@gmail.com";

  const validate = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/check_account_id?account_id=${par.account_id}`
    );

    console.log(`response`, response.data);
    const { success } = response.data;
    if (success) {
      handleSignup(par);
    } else {
      handleLogin(par.email);
    }
  };

  if (par?.account_id) {
    validate();
  }
}, []);

let par = parseParams(search);

const handleSignup = async (params) => {
  const fd = new FormData();
  if (loginForm === "email") {
    fd.append("user[email]", params.email);
    fd.append(
      "user[account_id]",
      params.account_id
      // signupEmail?.replace(".", "") + ".near"
    );
  } else {
    fd.append("user[phone_no]", params.phone);
    fd.append(
      "user[account_id]",
      params.phone + ".near"
      // signupEmail?.replace(".", "") + ".near"
    );
  }

  const response = await axios.post(`${API_BASE_URL}/signup`, fd);
  console.log(`response`, response);
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
  }

  // else {
  //   navigate("verification");
  // }
};

// useEffect(() => {
//   // If searchCity is 2 letters or more

//   if (!par?.account_id && loginForm === "email") {
//     const validate = async () => {
//       const response = await axios.get(
//         `${API_BASE_URL}/check_account_id?account_id=${inputFields.email?.replace(
//           ".",
//           ""
//         )}.near`
//       );

//       console.log(`response`, response.data);
//       const { success } = response.data;
//       setIsUserIDAvailable(success);
//     };
//     if (inputFields.email.length > 1) {
//       setValidateUserLoading(true);
//       validate();
//     }
//   }
// }, [inputFields.email]);

// const handleOnChange = (e) => {
//   e.preventDefault()
//   setSearchCity(e.target.value)
// }

const handleLogin = async (email) => {
  const fd = new FormData();
  if (!email) {
    fd.append("user[email]", inputFields.email);
  } else {
    fd.append("user[phone]", inputFields.phone);
  }

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
};

// eventProps: {
//   category: "Signup",
//   action: "Signed Up",
//   label: "Signup",
//   value: "Signup",
// },

// eventProps: {
//   category: "Signup",
//   action: "Signed Up",
//   label: "Signup",
//   value: "Signup",
// },

// InputProps={{
//   error: !!errors.email,
//   endAdornment: (
//     <InputAdornment
//       position="start"
//       className={`${styles.button} ${styles.secondary} ${styles.active}`}
//     >
//       .near
//     </InputAdornment>
//   ),
// }}
