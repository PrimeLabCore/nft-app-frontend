import React from "react";
import GetStartedButton from "./GetStartedButton";
import HomeCard2 from "../../../Assets/Images/home-card-2.svg";
import HomeCard1 from "../../../Assets/Images/home-card-1.svg";
import styles from "../index.module.scss";

const Home = () => (
  <>
    <h2>NFT Maker App</h2>

    <div className={`${styles.getStartedBtn} ${styles.onlyOnMobile}`}>
      <GetStartedButton />
    </div>

    <p className={styles.nftMakerAppDesc}>
      The easiest way to Create NFTs and share them others. Start
      minting NFTs in NEAR&apos;s rapidly expanding ecosystem
    </p>

    <div className={styles.imageContainer}>
      <img src={HomeCard2} alt="home-card-2" className={styles.image1st} />
      <img src={HomeCard1} alt="home-card-1" className={styles.image2nd} />
    </div>
    <div className={styles.nftAboutFeatureList}>
      <ul>
        <li>Create NFTs</li>
        <li>Share with Friends</li>
        <li>Explore Blockchain</li>
      </ul>
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
    <div className={`${styles.getStartedBtn} ${styles.onlyOnDesktop}`}>
      <GetStartedButton />
    </div>
  </>
);

export default Home;
