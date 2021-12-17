import React, { useEffect, useState } from "react";
import styles from "./claim.module.css";
import { Modal } from "react-bootstrap";
// import {BiArrowBack} from "react-icons/bi"
import { BsArrowUpRight } from "react-icons/bs";
import { Accordion } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../Utils/config";

// import {MdCancel} from "react-icons/md"
// dispatch({ type: "nft__detail", payload: data });
//     navigate("/nft/detail/claim");

const Claim = () => {
  const [claimModal, setClaimModal] = useState(false);
  const nft__detail = useSelector((state) => state.nft__detail);
  const { user } = useSelector((state) => state.authReducer);
  const [nftDetail, setNftDetail] = useState();
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  let params = useParams();
  const dispatch = useDispatch();

  console.log(`invoiceId`, params?.invoiceId);

  const fetchNft = async () => {
    setLoading(true);
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/user_images/fetch_user_image?uuid=${params?.invoiceId}`
    );
    const { data, success } = response.data;
    console.log(`response`, data);
    if (success) {
      setNftDetail(data);
      dispatch({
        type: "nft__detail",
        payload: data,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    params?.invoiceId && fetchNft();
  }, [params?.invoiceId]);

  useEffect(() => {
    !params?.invoiceId && setNftDetail(nftDetail);
  }, [nftDetail]);

  const hitClaim = async () => {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/user_images/claim_image?uuid=${nft__detail.uuid}`
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
    // window.dataLayer.push({
    //   event: "event",
    //   eventProps: {
    //     category: "Claim NFT",
    //     action: "Redirected To Login",
    //     label: "Claim NFT",
    //     value: "Claim NFT",
    //   },
    // });
    // dispatch({
    //   type: "update_redirectUrl",
    //   payload: `/nft/detail/claim/${params?.invoiceId}`,
    // });
    // navigate("/signin");

    window.open(`${API_BASE_URL}/near_login/login.html`, "_self");
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
    dispatch({
      type: "update_redirectUrl",
      payload: `/nft/detail/claim/${params?.invoiceId}`,
    });
    navigate("/signup");
  };

  console.log(`nftDetail`, nftDetail);
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
            {nftDetail?.nftid}
          </a>
        </div>
        <div className={styles.details__info}>
          <div className={styles.details__profile}>
            <div className={styles.details__profile__picture}></div>
            <div className={styles.details__user__info}>
              <p>Creater</p>
              <h6>{nftDetail?.name}</h6>
            </div>
          </div>
        </div>
        {nftDetail?.is_nft_claimed === false && (
          <button className={styles.claim__btn} onClick={handleClaim}>
            Claim{" "}
            <span>
              <BsArrowUpRight />
            </span>
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
                      href={nftDetail?.token_id ? nftDetail?.token_id : ""}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {nftDetail?.token_id ? nftDetail?.token_id : ""}
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
