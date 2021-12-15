import React, { useState } from "react";
import styles from "./claim.module.css";
import { Modal } from "react-bootstrap";
// import {BiArrowBack} from "react-icons/bi"
import { BsArrowUpRight } from "react-icons/bs";
import { Accordion } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";

// import {MdCancel} from "react-icons/md"

const Claim = () => {
  const [claimModal, setClaimModal] = useState(false);
  let navigate = useNavigate();
  const nft__detail = useSelector((state) => state.nft__detail);
  const { user } = useSelector((state) => state.authReducer);

  const hitClaim = async () => {
    const response = await axios.post(
      `https://nftmaker.algorepublic.com/api/v1/user_images/claim_image?uuid=${nft__detail.uuid}`
    );
    const { status } = response;
    const { success, message } = response.data;
    console.log(`response`, response.data);
    if (success) {
      toast.success(message);
      navigate("/");
    } else if (status === 200) {
      toast.error(message);
    }
  };

  const handleClaim = () => {
    user === null ? setClaimModal(true) : hitClaim();
  };

  const closeClaimModal = () => {
    setClaimModal(false);
  };

  const Login = () => {
    window.dataLayer.push({
      event: "event",
      eventProps: {
        category: "Claim NFT",
        action: "Redirected To Login",
        label: "Claim NFT",
        value: "Claim NFT",
      },
    });
  };
  const createNewWallet = () => {
    window.dataLayer.push({
      event: "event",
      eventProps: {
        category: "Claim NFT",
        action: "Redirected To Signup",
        label: "Claim NFT",
        value: "Claim NFT",
      },
    });
  };

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
            <h6>{nft__detail.category}</h6>
          </div>
          <h1>{nft__detail.title}</h1>
          <a href="https://explorer.near.org/" target="_blank" rel="noreferrer">
            {nft__detail.nftid}
          </a>
        </div>
        <div className={styles.details__info}>
          <div className={styles.details__profile}>
            <div className={styles.details__profile__picture}></div>
            <div className={styles.details__user__info}>
              <p>Creater</p>
              <h6>{nft__detail.name}</h6>
            </div>
          </div>
        </div>
        <button className={styles.claim__btn} onClick={handleClaim}>
          Claim{" "}
          <span>
            <BsArrowUpRight />
          </span>
        </button>
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
                      38493
                    </a>
                  </div>
                  <div className={styles.nft__info}>
                    <p>Contract Address</p>
                    <a
                      href="https://explorer.near.org/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      d0xkedek..89reke
                    </a>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </div>
          </Accordion>
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
                onClick={createNewWallet}
                className={styles.secondary__btn}
              >
                Create New Wallet{" "}
                <span>
                  <IoIosArrowForward />
                </span>
              </button>
              <button onClick={Login} className={styles.primary__btn}>
                Login with NEAR wallet{" "}
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
