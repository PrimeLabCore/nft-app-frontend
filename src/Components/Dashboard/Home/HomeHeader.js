import React from "react";
import user_icon from "../../../Assets/Images/user-icon.png";
import styles from "./Home.module.css";
import {Link} from "react-router-dom"
const HomeHeader = () => {
  return (
    <>
      <div className={styles.home__header}>
        <Link to="/settings">
          <div className={styles.user__icon}>
            <img src={user_icon} alt="User Name" />
            <h6>john.near</h6>
          </div>
        </Link>
      </div>
    </>
  );
};
export default HomeHeader;
