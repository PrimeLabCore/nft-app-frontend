import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import { IoIosArrowForward } from "react-icons/io";
import VerificationInput from "react-verification-input";
import { useDispatch, useSelector } from "react-redux";
import { ProgressBar } from "react-bootstrap";
import { cookieAuth } from "../../../Utils/config";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";

// import { toast } from 'react-toastify';
const Verification = () => {
  const loginMethodUsedByUser = useSelector((state) => state.LoginFormMethod);
  const email = useSelector((state) => state.authReducer.signupEmail);
  const [windowstate, setWindow] = useState(window.innerWidth < 767);
  const [allowLogin, setAllowLogin] = useState(false);
  const [details, setDetails] = useState({
    verification: [],
  });

  let navigate = useNavigate();
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        const ismobile = window.innerWidth < 767;
        if (ismobile !== windowstate) setWindow(ismobile);
      },
      false
    );
  }, [windowstate]);

  const tempLogIn = () => {
    Cookies.set(cookieAuth, "cookie");
    navigate("/signup/create-account");
    window.dataLayer.push({
      event: "event",
      eventProps: {
        category: "Signup",
        action: "User Verified",
        label: "Signup",
        value: "Signup",
      },
    });
  };

  // HandleClick for cancel button
  const HandleClick = () => {
    navigate("/signup");
  };
  const inputEvent = (e) => {
    const { name, value } = e.target;
    setDetails((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  };
  useEffect(() => {
    if (details.verification.length >= 6) {
      setAllowLogin(true);
    } else {
      setAllowLogin(false);
    }
    console.log(details.verification);
  }, [details.verification]);

  return (
    <div className={styles.half_container}>
      <AiFillCloseCircle className={styles.cross} onClick={HandleClick} />
      <div className={styles.container__header}>
        <span className={styles.verification}>Authentication</span>
        {windowstate && (
          <div className={styles.progress}>
            <ProgressBar now={(1 / 3) * 100} />
          </div>
        )}
      </div>

      <div className={styles.childContainer}>
        <p>
          We've sent a 6-digit Authentication code to
          <br />
          your email address
        </p>
        {loginMethodUsedByUser === "email" && <h2>{email}</h2>}
        {loginMethodUsedByUser === "phone" && <h2> + 1(373) 383 9933</h2>}

        <div className={styles.verficationContainer}>
          <p className={styles.enterCode}>Enter Verification Code</p>
          <VerificationInput
            autoFocus={true}
            placeholder=" "
            classNames={{
              container: "verification__container",
              character: "character",
              characterSelected: "character--selected",
            }}
            length={6}
            // value={details.verification}
            value={"123456"}
            inputProps={{
              value: details.verification,
              name: "verification",
              onChange: inputEvent,
            }}
          />
        </div>

        <button
          className={`${styles.button} ${styles.secondaryColor}`}
          //   disabled={allowLogin ? false : true}
          onClick={() => tempLogIn()}
        >
          Continue
          {
            <span>
              <IoIosArrowForward />
            </span>
          }
        </button>

        <hr />

        <h4>Didn't receive your code?</h4>

        <Link to="/signup" className={styles.link}>
          Send to a different phone number
        </Link>

        <Link to="." className={styles.link}>
          Resend your code
        </Link>
      </div>
    </div>
  );
};
export default Verification;
