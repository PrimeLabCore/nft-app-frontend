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
      let response = await axios.get(
        `${API_BASE_URL}/transactions/list/${user.user_id}`
      );

      const fetchedTransactions = response.data?.data;

      if (fetchedTransactions) {
        setTransactions(fetchedTransactions);
        dispatch({
          type: "fetch_transactions",
          payload: fetchedTransactions,
        });
      }
    }

    fetchTransactions();
  }, [user]);

  useEffect(() => {
    setTransactions(allTransactions);
  }, [allTransactions]);

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
        {transactions?.length && (
          <div className={styles.transaction__list__wrapper}>
            {transactions
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
                          {data.sender ? (
                            <BsArrowUpRight />
                          ) : (
                            <BsArrowDownLeft />
                          )}
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
                            {data.counterparty?.email}
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
        )}
      </div>
    </>
  );
};
export default memo(TransactionHistory);
