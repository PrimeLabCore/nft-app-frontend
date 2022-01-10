import React, { useEffect, useState } from "react";
import styles from "./claim.module.css";
import { Modal } from "react-bootstrap";
import { Accordion } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { mapNftDetails } from "../../../Utils/utils";

import NFT_STATUSES from "../../../constants/nftStatuses";
import request from "../../../Services/httpClient";

const Claim = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nftId } = useParams();

  const [claimModal, setClaimModal] = useState(false);
  const { user } = useSelector((state) => state.authReducer);
  // const [nftDetail, setNftDetail] = useState();
  const nftDetail = useSelector((state) => state.nft__detail);

  const isUserLoggedIn = !!user;

  useEffect(() => {
    async function getNftDetails() {
      try {
        const {
          data: { data },
        } = await request({ url: `/nfts/${nftId}` });
        if (data) {
          // testing only: do not commit
          // data.status = "unclaimed_gift";
          dispatch({ type: "nft__detail", payload: mapNftDetails(data) });
        }
        // setNftDetail(data);
      } catch (error) {
        console.error(error);
      }
    }

    if (!nftDetail || nftId !== nftDetail.id) {
      getNftDetails();
    }
  }, [nftDetail]);

  const hitClaim = async () => {
    try {
      const {
        data: { message },
      } = await request({
        method: "post",
        url: `/nfts/${nftId}/claim`,
        body: {
          owner_id: user.user_id,
        },
      });

      toast.success(message);
      navigate("/");
    } catch (error) {
      toast.error(
        "There was an error while claim the NFT. Please try again later"
      );
      console.error(error);
    }
  };

  const handleClaim = () => {
    if (isUserLoggedIn) {
      hitClaim();
    } else {
      setClaimModal(true);
    }
  };

  const closeClaimModal = () => {
    setClaimModal(false);
  };

  function handleLoginWithWallet() {
    window.dataLayer.push({
      event: "event",
      eventProps: {
        category: "Claim NFT",
        action: "Redirected To Login",
        label: "Claim NFT",
        value: "Claim NFT",
      },
    });

    dispatch({
      type: "update_redirectUrl",
      payload: `/nft/detail/claim/${nftId}`,
    });

    navigate("/signin");
  }

  function handleCreateNewWallet() {
    window.dataLayer.push({
      event: "event",
      eventProps: {
        category: "Claim NFT",
        action: "Redirected To Signup",
        label: "Claim NFT",
        value: "Claim NFT",
      },
    });

    dispatch({
      type: "update_redirectUrl",
      payload: `/nft/details/claim/${nftId}`,
    });

    navigate("/signup");
  }

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
            <h6>{nftDetail?.category}</h6>
          </div>
          <h1>{nftDetail?.title}</h1>
          <a href="https://explorer.near.org/" target="_blank" rel="noreferrer">
            {nftDetail?.id}
          </a>
        </div>
        <div className={styles.details__info}>
          <div className={styles.details__profile}>
            <div className={styles.details__profile__picture}></div>
            <div className={styles.details__user__info}>
              <p>{nftDetail?.owner}</p>
              <h6>{nftDetail?.name}</h6>
            </div>
          </div>
        </div>
        {nftDetail?.status === NFT_STATUSES.unclaimed && (
          <button className={styles.claim__btn} onClick={handleClaim}>
            Claim
          </button>
        )}
        <div className={styles.details__accords}>
          <Accordion>
            <div className={styles.accord}>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Descriptions</Accordion.Header>
                <Accordion.Body className={styles.accord__body}>
                  <p>{nftDetail?.description}</p>
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
                      href={nftDetail?.id ? nftDetail?.id : ""}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {nftDetail?.id ? nftDetail?.id : ""}
                    </a>
                  </div>
                  <div className={styles.nft__info}>
                    <p>Contract Address</p>
                    <a
                      href={
                        nftDetail?.explorer_url ? nftDetail?.explorer_url : ""
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {nftDetail?.explorer_url ? nftDetail?.explorer_url : ""}
                    </a>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </div>
          </Accordion>
          {nftDetail?.attributes?.length > 0 && (
            <Accordion>
              <div className={styles.accord}>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Properties</Accordion.Header>
                  <Accordion.Body className={styles.accord__body}>
                    {nftDetail.attributes.map((attr, index) => (
                      <div key={index} className={styles.nft__info}>
                        <p>{attr.attr_name}</p>
                        <a
                          href={nftDetail?.explorer_url}
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

        <Modal
          className={`${styles.claim__modal} initial__modal claim__modal`}
          show={claimModal}
          onHide={closeClaimModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header className={styles.modal__header__wrapper} closeButton>
            <div className="modal__title__wrapper">
              <Modal.Title>
                <div className={styles.modal__header}>
                  <h2>Claim NFT</h2>
                </div>
              </Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.btn__wrapper}>
              <button
                onClick={handleCreateNewWallet}
                className={styles.secondary__btn}
              >
                Create New Wallet
                <span>
                  <IoIosArrowForward />
                </span>
              </button>
              <button
                onClick={handleLoginWithWallet}
                className={styles.primary__btn}
              >
                Login with NEAR wallet
                <span>
                  <IoIosArrowForward />
                </span>
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};
export default Claim;
