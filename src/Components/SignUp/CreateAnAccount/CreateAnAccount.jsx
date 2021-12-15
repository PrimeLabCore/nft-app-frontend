import React, { useState, useEffect } from "react";
import styles from "./CreateAnAccount.module.css";
import { IoIosArrowForward } from "react-icons/io";
import TextFieldComponent from "../../../Assets/FrequentlUsedComponents/TextFieldComponent";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { BsInfoCircleFill } from "react-icons/bs";
import { ProgressBar } from "react-bootstrap";
import { googleClientId, googleRedirectUrl } from "../../../Utils/config";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const CreateAnAccount = () => {
  const { signupEmail, signupPhone } = useSelector(
    (state) => state.authReducer
  );
  const { LoginFormMethod } = useSelector((state) => state);

  const { accId } = useParams();
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [details, setDetails] = useState({
    id: `${accId ? accId : ""}`,
  });
  const [fullname, setFullname] = useState("");
  const [windowstate, setWindow] = useState(window.innerWidth < 767);
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
    navigate("/signin");
  };

  // HandleFocus for input
  const HandleFocus = (ClickedInput) => {
    // console.log('i m focused', ClickedInput)
    setinfo(ClickedInput);
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

  const hadleFullname = (e) => {
    setFullname(e?.target?.value);
  };

  const handleSignup = async () => {
    const fd = new FormData();
    if (LoginFormMethod === "email") {
      fd.append("user[email]", signupEmail);
    } else {
      fd.append("user[phone_no]", signupPhone);
    }
    // fd.append("user[password]", 11223344);
    const response = await axios.post("http://147.182.199.116/signup", fd);
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
        payload: data,
      });
      navigate("/");
    }
    // else {
    //   navigate("verification");
    // }
  };

  return (
    <div className={styles.half_container}>
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
          {info === "name" ? (
            <BsInfoCircleFill className={styles.infoIcon} />
          ) : null}
          <TextFieldComponent
            label="FULL NAME"
            variant="outlined"
            placeholder="Ex John Doe"
            InputValue={fullname}
            type="text"
            HandleInputChange={hadleFullname}
            HandleFocus={() => HandleFocus("name")}
          />
        </div>

        {/* input field for account id */}
        <div className={styles.textField}>
          {info === "id" ? (
            <BsInfoCircleFill className={styles.infoIcon} />
          ) : null}
          <TextFieldComponent
            label="ACCOUNT ID"
            variant="outlined"
            // InputValue={details.id}
            InputValue={signupEmail?.split("@")[0]?.replace(".", "") + ".near"}
            name="id"
            HandleInputChange={inputEvent}
            placeholder="yourname.near"
            type="text"
            HandleFocus={() => HandleFocus("id")}
            disabled
          />
        </div>

        {/* create account button */}
        <button
          onClick={handleSignup} // createAccount
          className={`${styles.secondary_button}`}
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
          NEAR Wallet <span>Terms of Service</span> and{" "}
          <span>Privacy Policy</span>.
        </p>

        {!accId && (
          <>
            <h6 className={styles.link}>Already have Near Account?</h6>

            <button className={styles.primary_button} onClick={HandleLogin}>
              Login With NEAR
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
