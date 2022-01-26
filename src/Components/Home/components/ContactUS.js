import React from "react";
import { IoMdMail, IoMdMap, IoMdPhonePortrait } from "react-icons/io";
import GetStartedButton from "./GetStartedButton";
import styles from "../index.module.scss";

const ContactUS = () => (
  <>
    <h2>Contact Us</h2>
    <div className={styles.pageContent}>
      <ul className={styles.contactList}>
        <li className={styles.listItem}>
          <span><IoMdMap className={styles.addressIcons} /></span>
          <span className={`${styles.contactText} ${styles.place}`}>
            Growth Lab, Inc. 1209 Orange Street, Wilmington Delaware
          </span>
        </li>

        <li className={styles.listItem}>
          <span><IoMdPhonePortrait className={styles.addressIcons} /></span>
          <span className={`${styles.contactText} ${styles.phone}`}>
            <a href="tel:+1 984-230-3429" title="">
              +1 984-230-3429
            </a>
          </span>
        </li>

        <li className={styles.listItem}>
          <span>
            <IoMdMail className={styles.addressIcons} />
          </span>
          <span className={`${styles.contactText} ${styles.gmail}`}>
            <a href="mailto:support@nftmakerapp.io" title="">
              support@nftmakerapp.io
            </a>
          </span>
        </li>
      </ul>
    </div>
    <div className={styles.getStartedBtn}>
      <GetStartedButton />
      {/* <Link to="/signup">
                    <button>
                      Get Started
                      <span>
                        <IoIosArrowForward />
                      </span>
                    </button>
                  </Link> */}
    </div>
  </>
);

export default ContactUS;