import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Img from '../../Assets/Images/bg-img.png'
import Logo from '../../Assets/Images/logo.png'
import { IoIosArrowForward, IoLogoFacebook, IoMdMap, IoIosMegaphone, IoMdMail, IoIosContact, IoMdPhoneLandscape, IoMdPhonePortrait } from "react-icons/io";
import HomeCard1 from '../../Assets/Images/home-card-1.svg'
import HomeCard2 from '../../Assets/Images/home-card-2.svg'
import { API_BASE_URL } from "../../Utils/config";

const HomePage = (props) => {
  const dispatch = useDispatch();
  const { redirectUrl } = useSelector((state) => state.authReducer);
  const [errors, setErrors] = useState({});
  let navigate = useNavigate();

  const HandleLoginWithNear = () => {
    //window.open(`${API_BASE_URL}/near_login/login.html`, "_self");
  };

  let pageName = props.pageName || "home";

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.leftSide}>
          <Link to="/">
            <img src={Logo} className={styles.logo} alt="Brand Logo" />
          </Link>
          <h3 className={styles.leftSideMainText}>
            The easiest way to Create NFTs and share them others. Start minting NFTs in NEAR's rapidly expanding ecosystem
          </h3>
          {/* <div className={styles.featureList}>
            <ul>
              <li>
                Create NFTs
              </li>
              <li>
                Share with Friends
              </li>
              <li>
                Explore Blockchain
              </li>
            </ul>
          </div> */}
        </div>

        <div className={styles.rightSide}>
          <div className={styles.rightSideHeader}>
            <ul>
              <li className={pageName === "about-us" ? styles.active : ""}>
                <Link to="/about-us">
                  About
                </Link>
              </li>
              <li className={pageName === "contact-us" ? styles.active : ""}>
                <Link to="/contact-us">
                  Contact
                </Link>
              </li>
              <li className={`${styles.onlyOnDesktop}`}>
              <Link to="/signup">
                  <button>
                    Get Started
                    <span>
                      <IoIosArrowForward />
                    </span>
                  </button>
                </Link>
              </li>
              <li>
               <Link to="/signup">
                <button>
                  Login
                  <span>
                    <IoIosArrowForward />
                  </span>
                </button>
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.rightSideBody}>

            {
              pageName === "home" &&
              <>
                <h2>NFT Maker App</h2>

                <div className={`${styles.getStartedBtn} ${styles.onlyOnMobile}`}>
                <Link to="/signup">
                  <button>
                    Get Started
                    <span>
                      <IoIosArrowForward />
                    </span>
                  </button>
                </Link>
                </div>

                <p className={styles.nftMakerAppDesc}>
                  The easiest way to Create NFTs and share them others. Start minting NFTs in NEAR's rapidly expanding ecosystem
                </p>

                <div className={styles.imageContainer}>
                  <img src={HomeCard2} className={styles.image1st} />
                  <img src={HomeCard1} className={styles.image2nd} />
                </div>
                {/* <div className={styles.nftAboutFeatureList}>
                <ul>
                  <li>
                    Create NFTs
                  </li>
                  <li>
                    Share with Friends
                  </li>
                  <li>
                    Explore Blockchain
                  </li>
                </ul>
                </div> */}
                <div className={styles.getStartedBtn}>
                  <Link to="/signup">
                    <button>
                      Get Started
                      <span>
                        <IoIosArrowForward />
                      </span>
                    </button>
                  </Link>
                </div>
              </>
            }


            {
              pageName === "about-us" &&
              <>
                <h2>About NFT Maker App</h2>
                <div className={styles.pageContent}>
                  <p>
                    The easiest way to Create NFTs and share them others. Start minting NFTs in NEAR's rapidly expanding ecosystem
                  </p>
                  <p><b>Features</b></p>
                  <ul>
                    <li>
                      Create NFTs
                    </li>
                    <li>
                      Share with Friends
                    </li>
                    <li>
                      Explore Blockchain
                    </li>
                  </ul>
                </div>
                <div className={styles.getStartedBtn}>
                <Link to="/signup">
                    <button>
                      Get Started
                      <span>
                        <IoIosArrowForward />
                      </span>
                    </button>
                  </Link>
                </div>
              </>
            }



            {
              pageName === "contact-us" &&
              <>
                <h2>Contact Us</h2>
                <div className={styles.pageContent}>

                  <ul class={styles.contactList}>
                    <li class={styles.listItem}>
                      <span>
                        <IoMdMap className={styles.addressIcons} />
                      </span>
                      <span class={`${styles.contactText} ${styles.place}`}>Growth Lab, Inc. 1209 Orange Street, Wilmington Delaware</span></li>

                    <li class={styles.listItem}>
                      <span>
                        <IoMdPhonePortrait className={styles.addressIcons} />
                      </span>
                      <span class={`${styles.contactText} ${styles.phone}`}><a href="tel:+1 984-230-3429" title="">+1 984-230-3429</a></span></li>

                    <li class={styles.listItem}>
                    <span>
                        <IoMdMail className={styles.addressIcons} />
                      </span>
                      <span class={`${styles.contactText} ${styles.gmail}`}><a href="mailto:support@nftmakerapp.io" title="">support@nftmakerapp.io</a></span></li>

                  </ul>



                </div>
                <div className={styles.getStartedBtn}>
                <Link to="/signup">
                    <button>
                      Get Started
                      <span>
                        <IoIosArrowForward />
                      </span>
                    </button>
                  </Link>
                </div>
              </>
            }






            <div className={styles.privacyPolicyTC}>
              <ul>
                <li><a href="https://privacy.nftmakerapp.io/">Privacy Policy</a></li>
                <li><a href="https://terms.nftmakerapp.io/">Terms of Service</a></li>
              </ul>
            </div>
            <div className={styles.copyRightText}>
              &copy; {new Date().getFullYear()} Near Labs.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default HomePage;
