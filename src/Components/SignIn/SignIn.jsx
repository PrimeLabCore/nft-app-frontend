import { InputAdornment } from "@material-ui/core";
// import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import React, { useState } from "react";
import { BsArrowLeftRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TextFieldComponent from "../../Assets/FrequentlUsedComponents/TextFieldComponent";
import { API_BASE_URL } from "../../Utils/config";
import AppLoader from "../Generic/AppLoader";
import styles from "./SignIn.module.css";

const useStyles = makeStyles((theme) => ({
  inputfield: {
    margin: "10px 0px",
    width: "100%",
  },
  inputStyles: {
    textAlign: "left",
    fontWeight: 600,
    fontSize: "19.2px",
    lineHeight: "23px",
    color: "rgba(0, 0, 0, 0.91)",
  },
}));

const SignIn = () => {
  let navigate = useNavigate();
  const classes = useStyles();
  const [email, setemail] = useState("");
  const [accountId, setAccountId] = useState("");
  const dispatch = useDispatch();
  const { redirectUrl } = useSelector((state) => state.authReducer);
  const [isLoading, setIsloading] = useState(false);

  const doesAccountStringHaveValidCharacters = (accountString) => {
    const matchesCharacterRequirements = /^[a-z_0-9-]+$/i.test(accountString);
    const hasUppercaseLetter = /[A-Z]+?/.test(accountString);

    return matchesCharacterRequirements && !hasUppercaseLetter;
  };

  const onAccountChange = (e) => {
    const { value } = e.target;

    if (!value || doesAccountStringHaveValidCharacters(value)) {
      setAccountId(value);
    }
  };

  const doesAccountIdHaveValidLength = (accountString) =>
    accountString.length > 1 && accountString.length <= 64;

  const handleLogin = async () => {
    if (!doesAccountIdHaveValidLength(accountId)) {
      toast.warn("Please enter an account ID of between 2 and 64 characters.");
      return;
    }
    setIsloading(true);

    //Ajax Request to send otp
    axios
      .post(`${API_BASE_URL}/login`, {
        walletName: accountId.includes(".near")
          ? accountId
          : accountId + ".near",
      })
      .then((response) => {
        dispatch({ type: "set_otp_medium", payload: response.data.type });
        navigate("/signin/verification/" + accountId);
      })
      .catch((error) => {
        if (error.response.data) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  return (
    <>
      <div className={styles.half_container}>
        {isLoading && <AppLoader />}
        <div className={styles.childContainer}>
          <BsArrowLeftRight className={styles.icon} />
          <div className={styles.requestText}>
            NEAR Labs
            <br />
            is requesting to
            <br />
            access your account.
          </div>
          <p className={styles.para}>
            This does not allow the app to transfer
            <br /> any tokens.
          </p>
          <div className={styles.MoreInfo}>More Info</div>

          {/* TEXT FIELD */}

          <div className={styles.textField}>
            <TextFieldComponent
              label="ACCOUNT ID"
              variant="outlined"
              // InputValue={details.id}
              InputValue={accountId}
              name="id"
              HandleInputChange={onAccountChange}
              placeholder="accountId"
              type="text"
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
            />
          </div>

          {/* BUTTON CONTAINER */}
          <div className={styles.buttonContainer}>
            <button
              onClick={() => navigate("/signup")}
              className={styles.secondary_button}
            >
              Deny
            </button>

            <button className={styles.primary_button} onClick={handleLogin}>
              Allow
            </button>
            {/* <Link
              to={`/signup/create-account/${"Johndoe.near"}`}
              className={styles.primary_button}
            >
              Allow
            </Link> */}
          </div>
        </div>
      </div>
    </>
  );
};
export default SignIn;
