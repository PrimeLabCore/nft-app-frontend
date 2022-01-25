import { isEmpty } from 'lodash';
import React, { useEffect, useState } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { Accordion } from "react-bootstrap";
import TextPlaceholder from "react-bootstrap/Placeholder";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import Analytics from "../../../Utils/Analytics";
import { mapNftDetailsWithOwnerObject } from "../../../Utils/utils";
import request from "../../../Services/httpClient";
import styles from "./details.module.scss";
import { actionSetDynamic } from "../../../Store/Auth/actions";
import { actionAppStateSetDynamic } from "../../../Store/AppState/actions";
import { actionNFTSetCurrent } from "../../../Store/NFT/actions";

function Details() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nftIdFromUrl = useParams().nftId;
  const [isLoading, setIsLoading] = useState(true);

  const currentNft = useSelector(state => state.nft.currentNft);
  const sendNft = () => {
    dispatch(actionAppStateSetDynamic("sendNFTPopupIsOpen", true));
    localStorage.setItem("sendNftId", JSON.stringify(currentNft))
    dispatch(actionSetDynamic("nft", currentNft));
    navigate("/");
    Analytics.pushEvent("event", {
      category: "NFT Details",
      action: "Send NFT",
      label: "NFT Details",
      value: "NFT Details",
    });
  };

  useEffect(async () => {
    setIsLoading(true);
    try {
      const {
        data: { data },
      } = await request({ url: `/nfts/${nftIdFromUrl}` });
      if (data) {
        dispatch(actionNFTSetCurrent(mapNftDetailsWithOwnerObject(data)));
        setIsLoading(false)
      }
    } catch (error) {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
      }
    } finally {
      setIsLoading(false)
    }
  }, []);

  return (
    <div className={styles.details__wrapper}>
      <div className={styles.details__back}>
        <button onClick={() => navigate("/")}>
          <span>X</span>
        </button>
      </div>
      <div className={styles.details__head}>
        <div className={styles.details__cat}>
          <h6>{currentNft?.category}</h6>
        </div>
        <h1>{currentNft.title}</h1>
        <a href="https://explorer.near.org/" target="_blank" rel="noreferrer">
          {currentNft.nftid}
        </a>
      </div>
      <div className={styles.details__info}>
        <div className={styles.details__profile}>
          <div className={styles.details__profile__picture} />
          <div className={styles.details__user__info}>
            <p>Creator</p>
            {
              isLoading
                ? <TextPlaceholder xs={150} bg="light" />
                : <h6>{currentNft?.owner?.full_name}</h6>
            }
          </div>
        </div>

        {!currentNft?.is_nft_claimed && (
          <button onClick={() => sendNft()}>
            Send
            {" "}
            <span>
              <BsArrowUpRight />
            </span>
          </button>
        )}
      </div>
      <div className={styles.details__accords}>
        {currentNft?.description && (
        <Accordion>
          <div className={styles.accord}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Descriptions</Accordion.Header>
              <Accordion.Body className={styles.accord__body}>
                <p>{currentNft.description}</p>
              </Accordion.Body>
            </Accordion.Item>
          </div>
        </Accordion>
        )}
        {(currentNft?.token_id || currentNft?.explorer_url) && (
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
                    {currentNft?.token_id ? currentNft?.token_id : ""}
                  </a>
                </div>
                <div className={styles.nft__info}>
                  <p>Contract Address</p>
                  <a
                    href={currentNft?.explorer_url}
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
        )}
        {(currentNft?.attributes?.length > 0 && !isEmpty(currentNft?.attributes[0])) && (
          <Accordion>
            <div className={styles.accord}>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Properties</Accordion.Header>
                <Accordion.Body className={styles.accord__body}>
                  {currentNft.attributes.map(attr => (
                    <div key={nanoid()} className={styles.nft__info}>
                      <p>{attr.attr_name}</p>
                      <a
                        href={currentNft?.explorer_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {attr.attr_value}
                      </a>
                    </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </div>
          </Accordion>
        )}
      </div>
    </div>
  );
}

export default Details;
