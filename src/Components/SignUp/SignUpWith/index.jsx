import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TextFieldComponent from "../../../Assets/FrequentlUsedComponents/TextFieldComponent";
import CustomPhoneInput from "../../../common/components/CustomPhoneInput/CustomPhoneInput";
import { API_BASE_URL } from "../../../Utils/config";
import styles from "./index.module.css";

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const splitEmail = email.split("@");

  if (splitEmail.length > 2) return false;

  const t = /[ `!@#$%^&*()+\=\[\]{};':"\\|,<>\/?~]/;

  return re.test(email) && !t.test(splitEmail[0]);
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

const validatePhone = (phone) =>
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone);

const SignUpWith = () => {
  const dispatch = useDispatch();
  const loginForm = useSelector((state) => state.LoginFormMethod);
  const [inputFields, setinputFields] = useState({ email: "", phone: "" });
  // const [loginFields, setLoginFields] = useState({ username: "" });
  const loginFields = { username: "" };
  // const [validateUserLoading, setValidateUserLoading] = useState(true);
  // const [isUserIDAvailable, setIsUserIDAvailable] = useState(false);
  const [countryValue, setCountry] = useState({});
  const { redirectUrl } = useSelector((state) => state.authReducer);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
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

  const par = parseParams(search);

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
        `${params.phone}.near`
        // signupEmail?.replace(".", "") + ".near"
      );
    }

    const response = await axios.post(`${API_BASE_URL}/signup`, fd);
    const { status } = response;

    if (status === 200 || status === 201) {
      const {
        headers: { authorization },
        data: { data }
      } = response;

      axios.interceptors.request.use((config) => {
        // const token = store.getState().session.token;
        config.headers.Authorization = authorization;

        return config;
      });
      dispatch({
        type: "login_Successfully",
        payload: { ...data, token: authorization }
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
        data: { data }
      } = response;

      axios.interceptors.request.use((config) => {
        // const token = store.getState().session.token;
        config.headers.Authorization = authorization;

        return config;
      });
      dispatch({
        type: "login_Successfully",
        payload: { ...data, token: authorization }
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

  useEffect(() => {
    par.email = "zeeshan@gmail.com";

    const validate = async () => {
      const response = await axios.get(
        `${API_BASE_URL}/check_account_id?account_id=${par.account_id}`
      );

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

  useEffect(() => 0, [errors]);

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
  // const HandleLoginWithNear = () => {
  //   // navigate("/signin");
  //   window.open(`${API_BASE_URL}/near_login/login.html`, "_self");
  // };

  const SignIn = () => {
    navigate("/signin");
  };

  const handleValidation = () => {
    const errors = {};
    let formIsValid = true;
    if (!validateEmail(inputFields.email)) {
      formIsValid = false;
      errors.email = "Email is not valid";
    }

    setErrors(errors);
    return formIsValid;
  };

  // Rohit: Choose to create new function handlePhone
  // Validation to handle the phone number validation
  const handlePhoneValidation = () => {
    const errors = {};
    let formIsValid = true;
    if (!validatePhone(inputFields.phone)) {
      formIsValid = false;
      errors.email = "Phone is not valid";
    }

    setErrors(errors);
    return formIsValid;
  };

  const oldHandleSignup = () => {
    if (inputFields.email.length < 1) {
      toast.error("Required");
      return false;
    }
    if (!handleValidation()) {
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
        value: "Signup"
      }
    });
    // navigate("verification");
    navigate("/signup/create-account");
    return 0;
  };

  // Phone Input Continue
  const phoneNumberSignUp = () => {
    // Rohit : Displays the toast error if phone number is not valid
    if (inputFields.phone.length < 1) {
      toast.error("Required");
      return false;
    }
    if (!handlePhoneValidation()) {
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
        value: "Signup"
      }
    });

    // navigate("verification");
    navigate("/signup/create-account");
    return 0;
  };

  // HandleInputChange for text field component
  const HandleInputChange = (field) => (e) => {
    setinputFields({ ...inputFields, [field]: e.target.value });
  };

  // const handleInputUserName = (e) => {
  //   setLoginFields({ username: e.target.value });
  // };

  const CheckAndSubmitForm = (e) => {
    if (e.which === 13) {
      loginForm === "email" ? oldHandleSignup() : phoneNumberSignUp();
    }
  };

  const clearFieldData = (field) => {
    setinputFields({ ...inputFields, [field]: "" });
  };

  return (
    <div className={styles.half_container}>
      {/* EMAIL AND PHONE SIGNUP CONATINER */}
      <div className={styles.buttonContainer} onClick={handleClick}>
        <button
          onClick={() => {
            clearFieldData("phone");
          }}
          value="email"
          className={`${styles.button} ${styles.secondary} ${
            loginForm === "email" ? styles.active : ""
          }`}
        >
          Email
        </button>
        <button
          value="phone"
          onClick={() => {
            clearFieldData("email");
          }}
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
            setCountry={setCountry}
            countryValue={countryValue}
            placeholder="Ex. (373) 378 8383"
            containerStyle={{ margin: "10px 0px" }}
            type={"tel"}
            value={inputFields.phone}
            onChange={HandleInputChange("phone")}
            HandelKeyPress={(e) => {
              CheckAndSubmitForm(e);
            }}
            setinputFields={setinputFields}
            signUp
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
            loginForm === "email" ? oldHandleSignup() : phoneNumberSignUp()}
          className={`${styles.button} ${
            inputFields.email || inputFields.phone
              ? styles.primaryColor
              : styles.secondaryColor
          }`}
          disabled={
            loginForm === "email"
              ? inputFields.email.length === 0
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
          By creating a NEAR account, you agree to the&nbsp;
          <br />
          NEAR Wallet&nbsp;
          <span>
            <a
              href="https://terms.nftmakerapp.io/"
              rel="noreferrer"
              target={"_blank"}
            >
              Terms of Service
            </a>
          </span>
          &nbsp;and&nbsp;
          <span>
            <a
              href="https://privacy.nftmakerapp.io/"
              rel="noreferrer"
              target={"_blank"}
            >
              Privacy Policy
            </a>
          </span>
          .
        </p>
        <hr />

        <h6 className={styles.link}>Already have Near Account?</h6>

        <button className={styles.button} onClick={SignIn}>
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
        in NEAR&apos;s rapidly expanding ecosystem
      </div>
    </div>
  );
};
export default SignUpWith;
