import React, { memo, Fragment } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";

import { BsArrowUpRight, BsArrowDownLeft } from "react-icons/bs";
import { useSelector } from "react-redux";

const Transactions = () => {
  const { allTransactions } = useSelector((state) => state.transactionsReducer);

  // const transaction = [
  //   {
  //     transaction: "sent",
  //     id: "#17372",
  //     name: "michael.near",
  //     time: "3 days ago",
  //   },
  // ];

  return (
    <>
      <div className={styles.transaction__wrapper}>
        <div className={styles.transaction__header}>
          <h5>Recent Transactions</h5>
          <Link to="/transactions">See All</Link>
        </div>
        <div className={styles.transaction__list__wrapper}>
          {allTransactions.map((data) => {
            return (
              <Fragment key={nanoid()}>
                <div className={styles.transaction__list}>
                  <div className={styles.transaction__action}>
                    <div>
                      {data.transaction === "sent" ? (
                        <BsArrowUpRight />
                      ) : (
                        <BsArrowDownLeft />
                      )}
                    </div>
                    <h6>
                      {/* <span>{data.id}</span>{" "} */}
                      <span>{data.sender.email}</span>{" "}
                      {data.transaction === "sent"
                        ? "Sent to"
                        : "Received from"}{" "}
                      <a
                        href="https://explorer.near.org/"
                        rel="noreferrer"
                        target="_blank"
                        className={styles.transaction__name}
                      >
                        {/* {data.name} */}
                        {data.receiver.email}
                      </a>
                    </h6>
                  </div>
                  <div className={styles.transaction__time}>
                    <p>{data.time}</p>
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
