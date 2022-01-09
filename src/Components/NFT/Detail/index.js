import React, { useEffect } from "react";
import axios from "axios";
import { BsArrowUpRight } from "react-icons/bs";
import { Accordion } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { API_BASE_URL } from "../../../Utils/config";
import { mapNftDetails } from "../../../Utils/utils";
import styles from "./details.module.css";

const Details = () => {
  let dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer);

  const sendNft = () => {
    dispatch({ type: "sendnft__open" });
    dispatch({
      type: "current_selected_nft",
      payload: nftData,
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

  const nftData = useSelector((state) => state.nft__detail);
  const nftIdFromUrl = useParams().nftid;

  useEffect(() => {
    async function getNftDetails() {
      try {
        const response = await axios.get(`${API_BASE_URL}/nfts/${nftIdFromUrl}`);
        dispatch({ type: "nft__detail", payload: mapNftDetails(response.data.data) });
      } catch (error) {
        if (error.response.data) {
          toast.error(error.response.data.message);
        }
      }
    }

    if (!nftData || nftIdFromUrl !== nftData.id) {
      getNftDetails();
    }
  }, [nftData]);

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
            <h6>{nftData?.category}</h6>
          </div>
          <h1>{nftData.title}</h1>
          <a href="https://explorer.near.org/" target="_blank" rel="noreferrer">
            {nftData.nftid}
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

          {!nftData?.is_nft_claimed && (
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
                  <p>{nftData.description}</p>
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
                      {nftData?.token_id ? nftData?.token_id : ""}
                    </a>
                  </div>
                  <div className={styles.nft__info}>
                    <p>Contract Address</p>
                    <a
                      href={nftData?.explorer_url}
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
