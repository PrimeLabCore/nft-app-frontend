import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import TextFieldComponent from "../../../Assets/FrequentlUsedComponents/TextFieldComponent";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { InputAdornment } from "@material-ui/core";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Utils/config";

const SignUpWith = () => {
  const dispatch = useDispatch();
  const loginForm = useSelector((state) => state.LoginFormMethod);
  const [inputFields, setinputFields] = useState({ email: "", phone: "" });
  const [validateUserLoading, setValidateUserLoading] = useState(true);
  const [isUserIDAvailable, setIsUserIDAvailable] = useState(false);
  const { redirectUrl } = useSelector((state) => state.authReducer);

  let navigate = useNavigate();
  // HANDLE CHANGE

  const { search } = useLocation();

  const handleClick = (e) => {
    dispatch({ type: e.target.value, payload: e.target.value });
  };

  const parseParams = (querystring) => {
    // parse query string
    const params = new URLSearchParams(querystring);

    const obj = {};

    // iterate over all keys
    for (const key of params.keys()) {
      if (params.getAll(key).length > 1) {
        obj[key] = params.getAll(key);
      } else {
        obj[key] = params.get(key);
      }
    }

    return obj;
  };

  let par = parseParams(search);

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

  // HandleLogin
  const HandleLoginWithNear = () => {
    // navigate("/signin");
    window.open(`${API_BASE_URL}/near_login/login.html`, "_self");
  };

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

  const oldHandleSignup = () => {
    dispatch({ type: "set_signup_email", payload: inputFields.email });
    window.dataLayer.push({
      event: "event",
      // eventProps: {
      //   category: "Signup",
      //   action: "Signed Up",
      //   label: "Signup",
      //   value: "Signup",
      // },
      eventProps: {
        category: "Signup",
        action: "User Verified",
        label: "Signup",
        value: "Signup",
      },
    });
    // navigate("verification");
    navigate("/signup/create-account");
  };

  // Phone Input Continue
  const phoneNumberSignUp = () => {
    dispatch({ type: "set_signup_phone", payload: inputFields.phone });
    window.dataLayer.push({
      event: "event",
      // eventProps: {
      //   category: "Signup",
      //   action: "Signed Up",
      //   label: "Signup",
      //   value: "Signup",
      // },
      eventProps: {
        category: "Signup",
        action: "User Verified",
        label: "Signup",
        value: "Signup",
      },
    });

    // navigate("verification");
    navigate("/signup/create-account");
  };

  // HandleInputChange for text field component
  const HandleInputChange = (field) => (e) => {
    setinputFields({ ...inputFields, [field]: e.target.value });
  };

  return (
    <div className={styles.half_container}>
      {/* EMAIL AND PHONE SIGNUP CONATINER */}
      <div className={styles.buttonContainer} onClick={handleClick}>
        <button
          value="email"
          className={`${styles.button} ${styles.secondary} ${
            loginForm === "email" ? styles.active : ""
          }`}
        >
          Email
        </button>

        <button
          value="phone"
          className={`${styles.button} ${styles.secondary} ${
            loginForm === "phone" ? styles.active : ""
          }`}
        >
          Phone
        </button>
      </div>

      <div className={styles.mainContainer}>
        {/* LOGIN WITH PHONE */}
        {loginForm === "phone" && (
          <TextFieldComponent
            variant="outlined"
            placeholder="Ex. (373) 378 8383"
            type={"tel"}
            InputValue={inputFields.phone}
            HandleInputChange={HandleInputChange("phone")}
          />
        )}

        {/* LOGIN WITH EMAIL */}
        {loginForm === "email" && (
          <TextFieldComponent
            variant="outlined"
            placeholder="Ex. johdoe@gmail.com"
            type={"email"}
            InputValue={inputFields.email}
            // InputProps={{
            //   endAdornment: (
            //     <InputAdornment
            //       position="start"
            //       className={`${styles.button} ${styles.secondary} ${styles.active}`}
            //     >
            //       .near
            //     </InputAdornment>
            //   ),
            // }}
            HandleInputChange={HandleInputChange("email")}
          />
        )}
        <button
          //   onClick={handleSignup}
          onClick={() =>
            loginForm === "email" ? oldHandleSignup() : phoneNumberSignUp()
          }
          className={`${styles.button} ${
            inputFields.email ? styles.primaryColor : styles.secondaryColor
          }`}
          disabled={
            loginForm === "email"
              ? inputFields.email.length < 5
              : inputFields.phone.length < 2
          }
        >
          Continue
          {
            <span>
              <IoIosArrowForward />
            </span>
          }
        </button>

        <p>
          by clicking continue you must agree to near labs
          <br />
          <span>Terms & Conditions</span> and <span>Privacy Policy</span>
        </p>

        <hr />

        <h6 className={styles.link}>Already have Near Account?</h6>

        <button className={styles.button} onClick={HandleLoginWithNear}>
          Login With NEAR
          {
            <span>
              <IoIosArrowForward />
            </span>
          }
        </button>
      </div>
    </div>
  );
};
export default SignUpWith;
