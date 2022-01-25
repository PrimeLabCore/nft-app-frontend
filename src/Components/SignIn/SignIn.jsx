import { InputAdornment } from "@material-ui/core";
// import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import React, { useState } from "react";
import { BsArrowLeftRight } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TextFieldComponent from "../../Assets/FrequentlUsedComponents/TextFieldComponent";
import useRedirectIfUserLoggedIn from '../../common/hooks/useRedirectIfUserLoggedIn';
import { API_BASE_URL } from "../../Utils/config";
import AppLoader from "../Generic/AppLoader";
import styles from "./SignIn.module.css";
import TooltipButton from '../../common/components/TooltipButton';

const SignIn = () => {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState("");
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(false);

  useRedirectIfUserLoggedIn();

  const doesAccountStringHaveValidCharacters = (accountString) => {
    const matchesCharacterRequirements = /^[a-z_0-9-]+$/i.test(accountString);
    const hasUppercaseLetter = /[A-Z]+?/.test(accountString);

    return matchesCharacterRequirements && !hasUppercaseLetter;
  };

  const onAccountChange = (e) => {
    const { value } = e.target;

    if (!value || doesAccountStringHaveValidCharacters(value.toLowerCase())) {
      setAccountId(value.toLowerCase());
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

    // Ajax Request to send otp
    axios
      .post(`${API_BASE_URL}/login`, {
        walletName: accountId.includes(".near")
          ? accountId
          : `${accountId}.near`,
      })
      .then((response) => {
        dispatch({ type: "set_otp_medium", payload: response.data.type });
        navigate(`/signin/authentication/${accountId}`);
      })
      .catch(() => {
        toast.warn("This Wallet is not supported on the NFT App, please create a new one HERE", {
          onClick: () => {
            navigate('/signup')
            toast.dismiss()
          }
        });
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  const CheckAndSubmitForm = (e) => {
    if (e.which === 13) {
      handleLogin();
    }
  };

  return (
    <div className={styles.half_container}>
      {isLoading && <AppLoader />}
      <div className={styles.childContainer}>
        <BsArrowLeftRight className={styles.icon} />
        <div className={styles.requestText}>
          Login with your NearApps ID
        </div>

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
            HandelKeyPress={(e) => {
              CheckAndSubmitForm(e);
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

        <div className={styles.loginWithNearContainer}>
          <TooltipButton tooltipText="Coming soon..." buttonText="Login with NEAR" buttonStyle={`${styles.comingSoonBtn}`} />
        </div>

      </div>
    </div>
  );
};
export default SignIn;
