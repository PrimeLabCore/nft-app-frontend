import React, { useState } from "react";
import styles from "./SignIn.module.css";
import { useNavigate } from "react-router-dom";
import { BsArrowLeftRight } from "react-icons/bs";
import TextField from "@material-ui/core/TextField";
// import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../Utils/config";

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
  const dispatch = useDispatch();
  const { redirectUrl } = useSelector((state) => state.authReducer);

  const handleLogin = async () => {
    const fd = new FormData();
    // if (loginForm === "email") {
    fd.append("user[email]", email);
    // } else {
    //   fd.append("user[password]", 11223344);
    // }

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

  return (
    <>
      <div className={styles.half_container}>
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
            <TextField
              id="outlined-select-currency"
              //   select
              variant="outlined"
              //   placeholder="Johndoe.near"
              placeholder="johndoe@gmail.com"
              value={email}
              className={classes.inputfield}
              fullWidth={true}
              inputProps={{
                className: classes.inputStyles,
              }}
              onChange={(e) => setemail(e.target.value)}
            >
              {/* this will be mapped by using map function */}
              {/* <MenuItem value={"Johndoe.near"}>Johndoe.near</MenuItem>
              <MenuItem value={"Johndoe.near"}>Johndoe.near</MenuItem>
              <MenuItem value={"Johndoe.near"}>Johndoe.near</MenuItem> */}
            </TextField>
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
