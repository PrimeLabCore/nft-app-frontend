import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import Analytics from "../../../Utils/Analytics";
import TextFieldComponent from "../../../Assets/FrequentlUsedComponents/TextFieldComponent";
import CustomPhoneInput from "../../../common/components/CustomPhoneInput/CustomPhoneInput";
import parseParams from "../../../Services/parseParams";
import styles from "./index.module.scss";
import { actionSetDynamic, actionSuccessfulLogin } from "../../../Store/Auth/actions";
import { actionAppStateSetLoginFormMethod } from "../../../Store/AppState/actions";
import { isValidateEmail, isValidPhoneNumber } from "../../../Utils/utils";
import { checkAccount, signupRequest, userLoginRequest } from "../../../api/user";
import TooltipButton from "../../../common/components/TooltipButton";

const SignUpWith = () => {
  const dispatch = useDispatch();
  const loginFormMethod = useSelector((state) => state.appState.loginFormMethod);
  const [inputFields, setinputFields] = useState({ email: "", phone: "" });
  const loginFields = { username: "" };
  const { redirectUrl } = useSelector((state) => state.authReducer);

  const [, setErrors] = useState({});
  const navigate = useNavigate();
  // HANDLE CHANGE

  const { search } = useLocation();

  const handleClick = (e) => {
    dispatch(actionAppStateSetLoginFormMethod(e.target.value))
  };

  const par = parseParams(search);

  const handleSignup = async (params) => {
    const fd = new FormData();
    if (loginFormMethod === "email") {
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

    const response = await signupRequest(fd);
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
      dispatch(actionSuccessfulLogin({ ...data, token: authorization }));
      navigate(redirectUrl ? redirectUrl : "/");
    }
  };

  const handleLogin = async (email) => {
    const fd = new FormData();
    const fieldName = !email ? "email" : "phone";
    fd.append(`user[${fieldName}]`, loginFields.username);

    const response = await userLoginRequest(fd);
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
      dispatch(actionSuccessfulLogin({ ...data, token: authorization }));
    }
  };

  useEffect(() => {
    par.email = "zeeshan@gmail.com";

    const validate = async () => {
      const response = await checkAccount(par.account_id);

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

  const handleValidation = () => {
    const errors = {};
    let formIsValid = true;
    if (!isValidateEmail(inputFields.email)) {
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
    if (!isValidPhoneNumber(inputFields.phone)) {
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

    loginFormMethod === "email"
      ? dispatch(actionSetDynamic("signupEmail", inputFields.email))
      : dispatch(actionSetDynamic("signupPhone", inputFields.phone));
    Analytics.pushEvent("event", {
      category: "Signup",
      action: "User Verified",
      label: "Signup",
      value: "Signup"
    });
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
    dispatch(actionSetDynamic("signupPhone", inputFields.phone));
    Analytics.pushEvent("event", {
      category: "Signup",
      action: "User Verified",
      label: "Signup",
      value: "Signup"
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
      loginFormMethod === "email" ? oldHandleSignup() : phoneNumberSignUp();
    }
  };

  const clearFieldData = (field) => {
    setinputFields({ ...inputFields, [field]: "" });
  };

  return (
    <div className={styles.half_container}>
      {/* EMAIL AND PHONE SIGNUP CONATINER */}
      <div className={styles.heading}>
        Create NearApps ID
      </div>
      <div className={styles.buttonContainer} onClick={handleClick}>
        <button
          onClick={() => {
            dispatch(actionAppStateSetLoginFormMethod("email"));
            clearFieldData("phone");
          }}
          value="email"
          className={`${styles.button} ${styles.secondary} ${
            loginFormMethod === "email" ? styles.active : ""
          }`}
        >
          Email
        </button>
        <button
          value="phone"
          onClick={() => {
            dispatch(actionAppStateSetLoginFormMethod("phone"));
            clearFieldData("email");
          }}
          className={`${styles.button} ${styles.secondary} ${
            loginFormMethod === "phone" ? styles.active : ""
          }`}
        >
          Phone
        </button>
      </div>

      <div className={styles.mainContainer}>
        {/* LOGIN WITH PHONE */}
        {loginFormMethod === "phone" && (
          <CustomPhoneInput
            placeholder="Ex. (373) 378 8383"
            value={inputFields.phone}
            onChange={HandleInputChange("phone")}
            HandelKeyPress={(e) => {
              CheckAndSubmitForm(e);
            }}
          />
        )}

        {/* LOGIN WITH EMAIL */}
        {loginFormMethod === "email" && (
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
            loginFormMethod === "email" ? oldHandleSignup() : phoneNumberSignUp()}
          className={`${styles.button} ${
            inputFields.email || isPossiblePhoneNumber(inputFields.phone)
              ? styles.primaryColor
              : styles.secondaryColor
          }`}
          disabled={
            loginFormMethod === "email"
              ? inputFields.email?.length === 0
              : !isPossiblePhoneNumber(inputFields.phone)
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

        <TooltipButton tooltipText="Coming soon..." buttonText="Login with NEAR" buttonStyle={`${styles.button} ${styles.comingSoonBtn}`} />
      </div>

      <div className={styles.home_page_text}>
        The easiest way to Create NFTs and share them others. Start minting NFTs
        in NEAR&apos;s rapidly expanding ecosystem
      </div>
    </div>
  );
};
export default SignUpWith;
