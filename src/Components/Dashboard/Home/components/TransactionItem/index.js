import React from "react";
import PropTypes from "prop-types";
import { BsArrowDownLeft, BsArrowUpRight } from "react-icons/bs";
import styles from "./index.module.scss";

const TransactionItem = ({
  walletId,
  data,
  className,
  onClick
}) => (
  <div className={`${styles.transaction__list} ${className}`}>
    <div className={styles.transaction__action} onClick={onClick}>
      <div>
        {data.sender ? <BsArrowUpRight /> : <BsArrowDownLeft />}
      </div>
      <h6>
        <span>{walletId}</span>
        <br />
        {data.sender ? "Sent to" : "Received from"}
        {" "}
        <a
          href="https://explorer.near.org/"
          rel="noreferrer"
          target="_blank"
          className={styles.transaction__name}
        >
          {data.counterparty?.email}
        </a>
      </h6>
    </div>
    <div className={styles.transaction__time}>
      <p>{data.formattedtime}</p>
    </div>
  </div>
);

TransactionItem.defaultProps = {
  walletId: "",
  className: "",
  onClick: () => {}
};

TransactionItem.propTypes = {
  walletId: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func
}

export default TransactionItem;
