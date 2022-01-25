import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import user_icon from "../../../Assets/Images/user-icon.png";
import styles from "./Home.module.scss";

function HomeHeader() {
  const walletId = useSelector((state) => state.authReducer.user?.wallet_id);

  return (
    <div className={styles.home__header}>
      <Link to="/settings">
        <div className={styles.user__icon}>
          <img src={user_icon} alt="User Name" />
          <h6>{walletId}</h6>
        </div>
      </Link>
    </div>
  );
}
export default HomeHeader;
