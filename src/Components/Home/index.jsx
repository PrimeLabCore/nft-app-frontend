import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../Assets/Images/prime-lab-logo.png";
import styles from "./index.module.scss";

import AboutUS from "./components/AboutUS";
import ContactUS from "./components/ContactUS";
import Home from "./components/Home";

const HomePage = (props) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authReducer);

  const HandleLoginWithNear = () => {
    // window.open(`${API_BASE_URL}/near_login/login.html`, "_self");
    if (user) {
      navigate('/', { replace: true });
    } else {
      navigate("/signin");
    }
  };

  const pageName = props.pageName || "home";

  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftSide}>
        <Link to="/">
          <img src={Logo} className={styles.logo} alt="Brand Logo" />
        </Link>
        <h3 className={styles.leftSideMainText}>
          The easiest way to Create NFTs and share them others. Start minting
          NFTs in NEAR&apos;s rapidly expanding ecosystem
        </h3>
        <li className={styles.loginButton}>
          <button onClick={HandleLoginWithNear}>
            {user ? 'Dashboard' : 'Launch'}
            <span>
              <IoIosArrowForward />
            </span>
          </button>
        </li>
        {/* <div className={styles.featureList}>
            <ul>
              <li>Create NFTs</li>
              <li>Share with Friends</li>
              <li>Explore Blockchain</li>
            </ul>
          </div> */}
      </div>

      <div className={styles.rightSide}>
        <div className={styles.rightSideHeader}>
          <ul>
            <li className={pageName === "about-us" ? styles.is_selected : ""}>
              <Link to="/about-us">About Us</Link>
            </li>
            <li className={pageName === "contact-us" ? styles.is_selected : ""}>
              <Link to="/contact-us">Contact Us</Link>
            </li>
            <li className={styles.menuLoginButton}>
              <button onClick={HandleLoginWithNear}>
                {user ? 'Dashboard' : 'Launch'}
                <span>
                  <IoIosArrowForward />
                </span>
              </button>
            </li>
          </ul>
        </div>
        <div className={styles.rightSideBody}>
          {pageName === "home" && <Home />}
          {pageName === "about-us" && <AboutUS />}
          {pageName === "contact-us" && <ContactUS />}

          <div className={styles.privacyPolicyTC}>
            <ul>
              <li>
                <a href="https://privacy.nftmakerapp.io/">Privacy Policy</a>
              </li>
              <li>
                <a href="https://terms.nftmakerapp.io/">Terms of Service</a>
              </li>
            </ul>
          </div>
          <div className={styles.copyRightText}>
            &copy;
            {' '}
            {new Date().getFullYear()}
            {' '}
            Prime Lab.
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
