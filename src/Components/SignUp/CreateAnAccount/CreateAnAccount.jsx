import React, { useState, useEffect } from "react";
import styles from "./CreateAnAccount.module.css";
import { IoIosArrowForward } from "react-icons/io";
import TextFieldComponent from "../../../Assets/FrequentlUsedComponents/TextFieldComponent";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { BsInfoCircleFill } from "react-icons/bs";
import { ProgressBar } from "react-bootstrap";
import {
  API_BASE_URL,
  googleClientId,
  googleRedirectUrl,
} from "../../../Utils/config";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { InputAdornment } from "@material-ui/core";
import { setAccessToken } from "../../../Services/AuthService";
import AppLoader from "../../Generic/AppLoader";

const CreateAnAccount = () => {
  const { signupEmail, signupPhone } = useSelector(
    (state) => state.authReducer
  );
  const [isLoading, setIsloading] = useState(false);

  const loginForm = useSelector((state) => state.LoginFormMethod);

  const { LoginFormMethod } = useSelector((state) => state);

  const { accId } = useParams();
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [details, setDetails] = useState({
    id: `${accId ? accId : ""}`,
  });
  const [fullname, setFullname] = useState("");
  const [accountId, setAccountId] = useState("");
  const [windowstate, setWindow] = useState(window.innerWidth < 767);
  const { redirectUrl } = useSelector((state) => state.authReducer);

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
  // const dispatch = useDispatch()
  const [info, setinfo] = useState("");

  useEffect(() => {
    if (LoginFormMethod === "email") {
      setAccountId(
        signupEmail?.split("@")[0]?.replace(".", "")
        // + ".near"
      );
    } else {
      setAccountId(
        signupPhone
        //  + ".near"
      );
    }
  }, [signupEmail, signupPhone]);

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

  // HandleClick for cancel button
  const HandleClick = () => {
    navigate("/signup");
  };

  // HandleLogin
  const HandleLogin = () => {
    //window.open(`${API_BASE_URL}/near_login/login.html`, "_self");
    // navigate("/signin");
  };

  // HandleFocus for input
  const HandleFocus = (ClickedInput) => {
    // console.log('i m focused', ClickedInput)
    setinfo(ClickedInput);
  };

  const doesAccountStringHaveValidCharacters = (accountString) => {
    const matchesCharacterRequirements = /^[a-z_0-9-]+$/i.test(accountString);
    const hasUppercaseLetter = /[A-Z]+?/.test(accountString);

    return matchesCharacterRequirements && !hasUppercaseLetter;
  };

  const doesAccountIdHaveValidLength = (accountString) =>
    accountString.length > 1 && accountString.length <= 64;

  const onAccountChange = (e) => {
    const { value } = e.target;

    if (!value || doesAccountStringHaveValidCharacters(value)) {
      setAccountId(value);
    }

    // setDetails((preValue) => {
    //   return {
    //     ...preValue,
    //     [name]: value,
    //   };
    // });
  };

  const onNameChange = (e) => {
    setFullname(e?.target?.value);
  };

  const handleSignup = async () => {
    if (!doesAccountIdHaveValidLength(accountId)) {
      toast.warn("Please enter an account ID of between 2 and 64 characters.");
      return;
    }

    setIsloading(true);
    // try {
    const fd = new FormData();
    if (LoginFormMethod === "email") {
      fd.append("user[email]", signupEmail);
      fd.append("user[account_id]", accountId?.replace(".", "") + ".near");

      fd.append("user[full_name]", fullname);
    } else {
      fd.append("user[phone_no]", signupPhone);
      fd.append("user[account_id]", accountId + ".near");
      fd.append("user[full_name]", fullname);
    }

    const response = await axios.post(`${API_BASE_URL}/signup`, fd);
    const { success, errors } = response.data;

    if (
      success
      // && status === 200 || status === 201
    ) {
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
      localStorage.setItem("welcome", true);
      setIsloading(false);
      navigate(redirectUrl ? redirectUrl : "/");
    } else {
      toast.error(errors[0]);
      setIsloading(false);
      // navigate("verification");
      // toast.error("Already Taken");
    }
    // } catch (e) {
    //   console.log("Error", e);
    //   // toast.error("Already Taken");
    // }
  };

  const isFormValid = ()=>{
    let returnVal = true;
    if(fullname ==""){
      returnVal = false;
    }else if(accountId == "" || !doesAccountStringHaveValidCharacters(accountId)){
      returnVal = false;
    }
    console.log("isFormValid=>", returnVal)
    return returnVal;
  }

  const CheckAndSubmitForm = (e)=>{
    if(e.which === 13 && isFormValid()){
      handleSignup()
    }
  }

  return (
    <div className={styles.half_container}>
      {
        isLoading && 
        <AppLoader />
      }
      <AiFillCloseCircle className={styles.cross} onClick={HandleClick} />
      <div className={styles.account__wrapper}>
        <span className={styles.createAnAccount}>Create an NFT account</span>
        {windowstate && (
          <div className={styles.progress}>
            <ProgressBar now={(2 / 3) * 100} />
          </div>
        )}
      </div>

      <div className={styles.childContainer}>
        <p className={styles.left}>
          Enter an Account ID to use with your NEAR <br />
          account. Your Account ID will be used for all NEAR <br />
          operations, including sending and receiving <br />
          assets.
        </p>

        {/* input field for full name */}
        <div className={styles.textField}>
          <TextFieldComponent
            label="FULL NAME"
            variant="outlined"
            placeholder="Ex John Doe"
            InputValue={fullname}
            type="text"
            HandleInputChange={onNameChange}
            HandleFocus={() => HandleFocus("name")}
            HandelKeyPress={(e)=>{CheckAndSubmitForm(e)}}
          />
        </div>

        {/* input field for account id */}
        <div className={styles.textField}>
          <TextFieldComponent
            label="ACCOUNT ID"
            variant="outlined"
            // InputValue={details.id}
            InputValue={accountId}
            name="id"
            HandleInputChange={onAccountChange}
            placeholder="yourname.near"
            type="text"
            HandelKeyPress={(e)=>{CheckAndSubmitForm(e)}}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="start"
                  className={`${styles.button} ${styles.secondary} ${styles.active}`}
                >
                  <span>.near</span>
                </InputAdornment>
              ),
            }}
            HandleFocus={() => HandleFocus("id")}
            // disabled
          />
        </div>

        {/* create account button */}
        <button
          onClick={handleSignup} // createAccount
          className={`${styles.secondary_button} ${
            isFormValid()? styles.active_button : ""
          }`}

          disabled={!isFormValid()}
        >
          Create an account
          {
            <span>
              <IoIosArrowForward />
            </span>
          }
        </button>
        {/* <button onClick={createAccount} className={styles.createAccountButton}>
          <a
            href={`https://accounts.google.com/o/oauth2/auth?response_type=code&redirect_uri=${googleRedirectUrl}&scope=https://www.googleapis.com/auth/contacts&client_id=${googleClientId}&access_type=offline&prompt=consent`}
            className={`${styles.secondary_button}`}
          >
            Create an account
            {
              <span>
                <IoIosArrowForward />
              </span>
            }
          </a>
        </button> */}

        <p>
          By creating a NEAR account, you agree to the <br />
          NEAR Wallet <span><a href="https://terms.nftmakerapp.io/" target={"_blank"}>Terms of Service</a></span> and{" "}
          <span><a href="https://privacy.nftmakerapp.io/" target={"_blank"}>Privacy Policy</a></span>.
        </p>

        {!accId && (
          <>
            <h6 className={styles.link}>Already have Near Account?</h6>

            <button disabled={true} className={styles.primary_button} onClick={HandleLogin}>
              Login
              {
                <span>
                  <IoIosArrowForward />
                </span>
              }
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateAnAccount;
