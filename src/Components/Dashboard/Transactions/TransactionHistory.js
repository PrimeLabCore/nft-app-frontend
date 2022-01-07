import React, { memo, Fragment, useState, useEffect } from "react";
import styles from "./transactions.module.css";
// import {Link} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";
import { BsArrowUpRight, BsArrowDownLeft } from "react-icons/bs";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../Utils/config";

const TransactionHistory = () => {
  const [tabs, setTabs] = useState("all");
  const dispatch = useDispatch();
  const [windowstate, setWindow] = useState(window.innerWidth < 767);
  const [transactions, setTransactions] = useState([]);
  const { allTransactions } = useSelector((state) => state.transactionsReducer);
  let navigate = useNavigate();
  const { user } = useSelector((state) => state.authReducer);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        const ismobile = window.innerWidth < 767;
        if (ismobile !== windowstate) setWindow(ismobile);
      },
      false
    );
  }, [windowstate]);

  useEffect(() => {
    async function fetchTransactions() {
      let sendersResponse = await axios.get(
        `${API_BASE_URL}/api/v1/nft_histories/sender_list`
      );
      let receiverResponse = await axios.get(
        `${API_BASE_URL}/api/v1/nft_histories/receiver_list`
      );

      let receives = receiverResponse?.data?.data?.map(
        (el) => (el = { ...el, transaction: "received" })
      );
      let sent = sendersResponse.data?.data?.map(
        (el) => (el = { ...el, transaction: "sent" })
      );

      setTransactions([...receives, ...sent]);
      dispatch({ type: "fetch_transactions", payload: [...receives, ...sent] });
    }

    fetchTransactions();
  }, []);

  useEffect(() => {
    setTransactions(allTransactions);
  }, [allTransactions]);

  const alltransactions2 = [
    {
      transaction_id: "X7yQyklU4t8w968jD3SJ3",
      sender_id: "K7yQyklU4t8w968jD3SJ5",
      recipient_id: ["X24OyklU4t8w968jD3SP1", "X24OyklU4t8w968jD3SP1"],
      transaction_item_id: "T24OyklU4t8w968jD903N",
      transaction_value: "10 USD",
      type: "regular",
      status: "completed",
      sender: true,
      counterparty: {
        wallet_id: "mark.near",
        full_name: "Mark Henry",
        email: "moisesmarques.ti@hotmail.com",
        phone: "19024039201",
      },
      created: 1641355923848,
      updated: 1641355923848,
      formattedtime: "3 mins ago",
    },
    {
      transaction_id: "X7yQyklU4t8w968jD3SJ3",
      sender_id: "K7yQyklU4t8w968jD3SJ5",
      recipient_id: ["X24OyklU4t8w968jD3SP1", "X24OyklU4t8w968jD3SP1"],
      transaction_item_id: "T24OyklU4t8w968jD903N",
      transaction_value: "10 USD",
      type: "regular",
      status: "completed",
      sender: false,
      counterparty: {
        wallet_id: "mark.near",
        full_name: "Mark Henry",
        email: "moisesmarques.ti@hotmail.com",
        phone: "19024039201",
      },
      created: 1641355923848,
      updated: 1641355923848,
      formattedtime: "3 mins ago",
    },
  ];

  const handleTabClick = (e) => {
    setTabs(e.target.value);
  };
  const SendNft = () => {
    dispatch({ type: "sendnft__open" });
  };

  const openClaim = (data) => {
    // navigate("/nft/claim");
    dispatch({ type: "nft__detail", payload: data });
    navigate("/nft/detail/claim");
  };
  return (
    <>
      <div className={styles.transaction__wrapper}>
        <div className={styles.transaction__header}>
          <h5>History</h5>
          {!windowstate && (
            <div className={styles.transaction__tab} onClick={handleTabClick}>
              <button
                className={tabs === "all" ? styles.active : ""}
                value="all"
              >
                All
              </button>
              <button
                className={tabs === "sent" ? styles.active : ""}
                value="sent"
              >
                Sent
              </button>
              <button
                className={tabs === "received" ? styles.active : ""}
                value="received"
              >
                Received
              </button>
            </div>
          )}
          <div>
            {tabs !== "received" ? (
              <button
                className={styles.send__nft__mobile__button}
                onClick={SendNft}
              >
                <span>
                  <BsArrowUpRight />
                </span>
                Send NFT
              </button>
            ) : (
              <span> </span>
            )}
          </div>
        </div>
        {windowstate && (
          <div className={styles.small__screen__transaction__wrapper}>
            <div
              className={styles.small__screen__transaction}
              onClick={handleTabClick}
            >
              <button
                className={tabs === "all" ? styles.active : ""}
                value="all"
              >
                All
              </button>
              <button
                className={tabs === "sent" ? styles.active : ""}
                value="sent"
              >
                Sent
              </button>
              <button
                className={tabs === "received" ? styles.active : ""}
                value="received"
              >
                Received
              </button>
            </div>
          </div>
        )}
        <div className={styles.transaction__list__wrapper}>
          {alltransactions2
            .filter((data) =>
              tabs === "sent"
                ? !!data.sender
                : tabs === "received"
                ? !data.sender
                : data
            )
            .map((data) => {
              return (
                <Fragment key={nanoid()}>
                  <div
                    className={styles.transaction__list}
                    style={{
                      cursor: !!data.sender ? "pointer" : null,
                    }}
                    onClick={() => !data.sender && openClaim(data)}
                  >
                    <div className={styles.transaction__action}>
                      <div className={styles.icon__wrapper}>
                        {data.sender ? <BsArrowUpRight /> : <BsArrowDownLeft />}
                      </div>
                      <h6>
                        <span>{user.wallet_id}</span> <br />
                        {data.sender ? "Sent to" : "Received from"}{" "}
                        {/* <a
                          href="https://explorer.near.org/"
                          target="_blank"
                          rel="noreferrer"
                          className={styles.transaction__name}
                        >
                          {data.receiver.email}
                        </a> */}
                        <span
                          //   href="https://explorer.near.org/"
                          //   target="_blank"
                          //   rel="noreferrer"
                          className={styles.transaction__name}
                        >
                          {data.counterparty.email}
                        </span>
                      </h6>
                    </div>
                    <div className={styles.transaction__time}>
                      {/* <p>{data.time}</p> */}
                      <p>
                        {moment
                          .utc(data.created)
                          .local()
                          .startOf("seconds")
                          .fromNow()}
                      </p>
                    </div>
                  </div>
                </Fragment>
              );
            })}
        </div>
      </div>
    </>
  );
};
export default memo(TransactionHistory);
