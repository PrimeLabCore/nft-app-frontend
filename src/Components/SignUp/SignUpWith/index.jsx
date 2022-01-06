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
import CustomPhoneInput from "../../../common/components/CustomPhoneInput/CustomPhoneInput";
import SignIn from "../../SignIn/SignIn";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// Date : Jan 4 2021, 09:27 AM IST, Rohit Yadav
// Added phone number validation.
// Valid formats:

// (123) 456-7890
// (123)456-7890
// 123-456-7890
// 123.456.7890
// 1234567890
// +31636363634
// 075-63546725

const validatePhone = (phone) => {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
    phone
  );
};

const SignUpWith = () => {
  const dispatch = useDispatch();
  const loginForm = useSelector((state) => state.LoginFormMethod);
  const [inputFields, setinputFields] = useState({ email: "", phone: "" });
  const [loginFields, setLoginFields] = useState({ username: "" });
  const [validateUserLoading, setValidateUserLoading] = useState(true);
  const [isUserIDAvailable, setIsUserIDAvailable] = useState(false);
  const { redirectUrl } = useSelector((state) => state.authReducer);

  const [errors, setErrors] = useState({});
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
      fd.append("user[email]", loginFields.username);
    } else {
      fd.append("user[phone]", loginFields.username);
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
      console.log("data", redirectUrl);
      dispatch({
        type: "login_Successfully",
        payload: { ...data, token: authorization },
      });
      // localStorage.setItem(
      //   "user",
      //   JSON.stringify({ ...data, token: authorization })
      // );
      // navigate(redirectUrl ? redirectUrl : "/");
    } else {
      // navigate("verification");
    }
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    console.log(`inputFields.email.length`, inputFields.email.length < 1);
    if (!validateEmail(inputFields.email)) {
      formIsValid = false;
      errors["email"] = "Email is not valid";
    }

    setErrors(errors);
    return formIsValid;
  };

  // Rohit: Choose to create new function handlePhoneValidation to handle the phone number validation
  const handlePhoneValidation = () => {
    let errors = {};
    let formIsValid = true;
    console.log(`inputFields.email.length`, inputFields.phone.length < 1);
    if (!validatePhone(inputFields.phone)) {
      formIsValid = false;
      errors["email"] = "Phone is not valid";
    }

    setErrors(errors);
    return formIsValid;
  };

  const oldHandleSignup = () => {
    if (inputFields.email.length < 1) {
      toast.error("Required");
      return false;
    } else if (!handleValidation()) {
      return toast.error("Email is not valid");
    }
    loginForm === "email"
      ? dispatch({ type: "set_signup_email", payload: inputFields.email })
      : dispatch({ type: "set_signup_phone", payload: inputFields.phone });
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
    // Rohit : Displays the toast error if phone number is not valid
    if (inputFields.phone.length < 1) {
      toast.error("Required");
      return false;
    } else if (!handlePhoneValidation()) {
      return toast.error("Phone is not valid");
    }

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

  const handleInputUserName = (e) => {
    setLoginFields({ username: e.target.value });
  };

  const CheckAndSubmitForm = (e) => {
    if (e.which === 13) {
      loginForm === "email" ? oldHandleSignup() : phoneNumberSignUp();
    }
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
          <CustomPhoneInput
            variant="outlined"
            placeholder="Ex. (373) 378 8383"
            type={"tel"}
            value={inputFields.phone}
            onChange={HandleInputChange("phone")}
            HandelKeyPress={(e) => {
              CheckAndSubmitForm(e);
            }}
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
            HandleInputChange={HandleInputChange("email")}
            HandelKeyPress={(e) => {
              CheckAndSubmitForm(e);
            }}
          />
        )}
        <button
          //   onClick={handleSignup}
          onClick={() =>
            loginForm === "email" ? oldHandleSignup() : phoneNumberSignUp()
          }
          className={`${styles.button} ${
            inputFields.email || inputFields.phone
              ? styles.primaryColor
              : styles.secondaryColor
          }`}
          disabled={
            loginForm === "email"
              ? inputFields.email.length < 0
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
          By creating a NEAR account, you agree to the <br />
          NEAR Wallet{" "}
          <span>
            <a href="https://terms.nftmakerapp.io/" target={"_blank"}>
              Terms of Service
            </a>
          </span>{" "}
          and{" "}
          <span>
            <a href="https://privacy.nftmakerapp.io/" target={"_blank"}>
              Privacy Policy
            </a>
          </span>
          .
        </p>
        <hr />

        <h6 className={styles.link}>Already have Near Account?</h6>

        <TextFieldComponent
          variant="outlined"
          placeholder="walletName.near"
          type={"email"}
          InputValue={loginFields.username}
          HandleInputChange={handleInputUserName}
          HandelKeyPress={(e) => {
            // CheckAndSubmitForm(e);
          }}
        />
        <button
          disabled={loginFields.username.length > 2 ? false : true}
          className={styles.button}
          onClick={() => handleLogin(loginFields.username)}
        >
          Login
          {
            <span>
              <IoIosArrowForward />
            </span>
          }
        </button>
      </div>

      <div className={styles.home_page_text}>
        The easiest way to Create NFTs and share them others. Start minting NFTs
        in NEAR's rapidly expanding ecosystem
      </div>
    </div>
  );
};
export default SignUpWith;
