import React, { memo, Fragment, useEffect, useState } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import axios from "axios";

import { BsArrowUpRight, BsArrowDownLeft } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const dispatch = useDispatch();
  const { allTransactions } = useSelector((state) => state.transactionsReducer);
  const { user } = useSelector((state) => state.authReducer);

  const testTransactions = [
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

  useEffect(() => {
    async function fetchTransactions() {
      // let response = await axios.get(`/transactions/list/${user.user_id}}`);
      // let fetchedTransactions = [...response.data];
      let fetchedTransactions = testTransactions;

      setTransactions(fetchedTransactions);
      dispatch({ type: "fetch_transactions", payload: [fetchedTransactions] });
    }

    fetchTransactions();
  }, []);

  useEffect(() => {
    // TODO: uncomment below line to switch out for actual transactions
    // setTransactions(allTransactions);
    setTransactions(testTransactions);
  }, [allTransactions]);

  return (
    <>
      <div className={styles.transaction__wrapper}>
        <div className={styles.transaction__header}>
          <h5>Recent Transactions</h5>
          <Link to="/transactions">See All</Link>
        </div>
        <div className={styles.transaction__list__wrapper}>
          {transactions.map((data) => {
            return (
              <Fragment key={nanoid()}>
                <div className={styles.transaction__list}>
                  <div className={styles.transaction__action}>
                    <div>
                      {data.sender === true ? (
                        <BsArrowUpRight />
                      ) : (
                        <BsArrowDownLeft />
                      )}
                    </div>
                    <h6>
                      {/* <span>{data.id}</span>{" "} */}
                      <span>{user.wallet_id}</span>{" "}
                      {data.sender === true ? "sent to" : "received from"}{" "}
                      <a
                        href="https://explorer.near.org/"
                        rel="noreferrer"
                        target="_blank"
                        className={styles.transaction__name}
                      >
                        {/* {data.name} */}
                        {data.counterparty.email}
                      </a>
                    </h6>
                  </div>
                  <div className={styles.transaction__time}>
                    <p>{data.formattedtime}</p>
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
export default memo(Transactions);
