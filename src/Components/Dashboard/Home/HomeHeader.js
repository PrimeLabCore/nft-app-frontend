import React from "react";
import user_icon from "../../../Assets/Images/user-icon.png";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// import { useSelector } from "react-redux";

const HomeHeader = () => {

  const { user} = useSelector(
    (state) => state.authReducer
  );

  return (
    <>
      <div className={styles.home__header}>
        <Link to="/settings">
          <div className={styles.user__icon}>
            <img src={user_icon} alt="User Name" />
            {/* <h6>{email?.split("@")[0] + ".near"}</h6> */}
            <h6>{user?.account_id}</h6>

          </div>
        </Link>
      </div>
    </>
  );
};
export default HomeHeader;
