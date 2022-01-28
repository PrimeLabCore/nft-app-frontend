import React from "react";
import styles from "./Card.module.css";

const NFTCard = (props) => {
  const { data, detailPage, fileType } = props;
  return (
    <div className={styles.card_container} onClick={() => detailPage(data)}>
      <div className={styles.card_image_wrapper}>
        {fileType.toLowerCase() === "mp4" ? (
          <video className={styles.card_video_file} src={data?.file_url} />
        ) : fileType.toLowerCase() === "mp3" ? (
          <div className={styles.card_audio_container}>
            <audio className={styles.card_audio_mp3} controls>
              <source src={data?.file_url} />
            </audio>
          </div>
        ) : (
          <img
            className={styles.card_image}
            src={data?.file_url}
            alt={data.title}
          />
        )}
        <div className={styles.card_category_box}>
          <h6>{data?.category}</h6>
        </div>
      </div>
      <div className={styles.card_description_wrapper}>
        <h2 className={styles.text__ellipsis}>{data?.title}</h2>
        <p className={styles.text__ellipsis}>{data?.nft_id}</p>
      </div>
    </div>
  );
};

export default NFTCard;
