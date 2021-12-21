import React from "react";
import styles from "./details.module.css";
// import {BiArrowBack} from "react-icons/bi"
import { BsArrowUpRight } from "react-icons/bs";
import { Accordion } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import {MdCancel} from "react-icons/md"
const Details = () => {
  let dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer);

  const sendNft = () => {
    dispatch({ type: "sendnft__open" });
    dispatch({
      type: "current_selected_nft",
      payload: nft__detail,
    });
    navigate("/");
    window.dataLayer.push({
      event: "event",
      eventProps: {
        category: "NFT Details",
        action: "Send NFT",
        label: "NFT Details",
        value: "NFT Details",
      },
    });
  };
  let navigate = useNavigate();

  const nft__detail = useSelector((state) => state.nft__detail);

  console.log(`nft__detail`, nft__detail);

  return (
    <>
      <div className={styles.details__wrapper}>
        <div className={styles.details__back}>
          <button onClick={() => navigate("/")}>
            <span>X</span>
          </button>
        </div>
        <div className={styles.details__head}>
          <div className={styles.details__cat}>
            <h6>{nft__detail?.category}</h6>
          </div>
          <h1>{nft__detail.name}</h1>
          <a href="https://explorer.near.org/" target="_blank" rel="noreferrer">
            {nft__detail.nftid}
          </a>
        </div>
        <div className={styles.details__info}>
          <div className={styles.details__profile}>
            <div className={styles.details__profile__picture}></div>
            <div className={styles.details__user__info}>
              <p>Creater</p>
              <h6>{user?.account_id}</h6>
            </div>
          </div>

          {!nft__detail?.is_nft_claimed && (
            <button onClick={() => sendNft()}>
              Send{" "}
              <span>
                <BsArrowUpRight />
              </span>
            </button>
          )}
        </div>
        <div className={styles.details__accords}>
          <Accordion>
            <div className={styles.accord}>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Descriptions</Accordion.Header>
                <Accordion.Body className={styles.accord__body}>
                  <p>{nft__detail.description}</p>
                </Accordion.Body>
              </Accordion.Item>
            </div>
          </Accordion>
          <Accordion>
            <div className={styles.accord}>
              <Accordion.Item eventKey="1">
                <Accordion.Header>NFT Info</Accordion.Header>
                <Accordion.Body className={styles.accord__body}>
                  <div className={styles.nft__info}>
                    <p>Token ID</p>
                    <a
                      href="https://explorer.near.org/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {nft__detail?.token_id ? nft__detail?.token_id : ""}
                    </a>
                  </div>
                  <div className={styles.nft__info}>
                    <p>Contract Address</p>
                    <a
                      href={nft__detail?.explorer_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Explorer
                    </a>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </div>
          </Accordion>
        </div>
      </div>
    </>
  );
};
export default Details;
