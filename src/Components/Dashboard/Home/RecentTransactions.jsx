import React, { memo, Fragment, useEffect, useState } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import axios from "axios";

import { BsArrowUpRight, BsArrowDownLeft } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../../../Utils/config";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const dispatch = useDispatch();
  const { allTransactions } = useSelector((state) => state.transactionsReducer);
  const { user } = useSelector((state) => state.authReducer);

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

  return (
    <>
      <div className={styles.transaction__wrapper}>
        <div className={styles.transaction__header}>
          <h5>Recent Transactions</h5>
          <Link to="/transactions">See All</Link>
        </div>
        {transactions?.length && (
          <div className={styles.transaction__list__wrapper}>
            {transactions.map((data) => {
              return (
                <Fragment key={nanoid()}>
                  <div className={styles.transaction__list}>
                    <div className={styles.transaction__action}>
                      <div>
                        {data.sender ? <BsArrowUpRight /> : <BsArrowDownLeft />}
                      </div>
                      <h6>
                        {/* <span>{data.id}</span>{" "} */}
                        <span>{user.wallet_id}</span> <br />
                        {data.sender ? "Sent to" : "Received from"}{" "}
                        <a
                          href="https://explorer.near.org/"
                          rel="noreferrer"
                          target="_blank"
                          className={styles.transaction__name}
                        >
                          {/* {data.name} */}
                          {data.counterparty?.email}
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
        )}
      </div>
    </>
  );
};
export default memo(Transactions);
