import React, { useState } from "react";
import styles from "./index.module.css";
import TextFieldComponent from "../../../Assets/FrequentlUsedComponents/TextFieldComponent";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { InputAdornment } from "@material-ui/core";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const SignUpWith = () => {
  const dispatch = useDispatch();
  const loginForm = useSelector((state) => state.LoginFormMethod);
  const [inputFields, setinputFields] = useState({ email: "", phone: "" });
  const [errors, setErrors] = useState({});
  let navigate = useNavigate();
  // HANDLE CHANGE

  const handleClick = (e) => {
    dispatch({ type: e.target.value, payload: e.target.value });
  };

  // HandleLogin
  const HandleLogin = () => {
    navigate("/signin");
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    if (!validateEmail(inputFields.email)) {
      formIsValid = false;
      errors["email"] = "Email is not valid";
    }
    setErrors(errors);
    return formIsValid;
  };

  const oldHandleSignup = () => {
    if (!handleValidation()) {
      return;
    }
    loginForm === "email"
      ? dispatch({ type: "set_signup_email", payload: inputFields.email })
      : dispatch({ type: "set_signup_phone", payload: inputFields.phone });
    window.dataLayer.push({
      event: "event",
      eventProps: {
        category: "Signup",
        action: "Signed Up",
        label: "Signup",
        value: "Signup",
      },
    });
    navigate("verification");
  };

  // HandleInputChange for text field component
  const HandleInputChange = (field) => (e) => {
    setinputFields({ ...inputFields, [field]: e.target.value });
  };

  return (
    <div className={styles.half_container}>
      {/* EMAIL AND PHONE SIGNUP CONATINER */}
      <div
        className={styles.buttonContainer}
        //    onClick={handleClick}
      >
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
            helperText={errors.email}
            InputProps={{
              error: !!errors.email,
              endAdornment: (
                <InputAdornment
                  position="start"
                  className={`${styles.button} ${styles.secondary} ${styles.active}`}
                >
                  .near
                </InputAdornment>
              ),
            }}
            HandleInputChange={HandleInputChange("email")}
          />
        )}
        <button
          //   onClick={handleSignup}
          onClick={oldHandleSignup}
          className={`${styles.button} ${
            inputFields.email ? styles.primaryColor : styles.secondaryColor
          }`}
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

        <button className={styles.button} onClick={HandleLogin}>
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
