import React from "react";
import GetStartedButton from "./GetStartedButton";
import styles from "../index.module.scss";

const AboutUS = () => (
  <>
    <h2>About NFT Maker App</h2>
    <div className={styles.pageContent}>
      <p>
        The easiest way to Create NFTs and share them others. Start
        minting NFTs in NEAR&apos;s rapidly expanding ecosystem
      </p>
      <p>
        <b>Features</b>
      </p>
      <ul>
        <li>Create NFTs</li>
        <li>Share with Friends</li>
        <li>Explore Blockchain</li>
      </ul>
    </div>
    <div className={styles.getStartedBtn}>
      <GetStartedButton />
    </div>
  </>
);

export default AboutUS;