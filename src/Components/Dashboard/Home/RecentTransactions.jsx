import React, { memo } from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import useTransactionRequest from "../../../hooks/useTransactionRequest";
import TransactionItem from "./components/TransactionItem";
import styles from "./Home.module.scss";

const RecentTransactions = memo(() => {
  const user = useSelector(state => state.authReducer.user);
  const transactions = useTransactionRequest(user?.user_id);

  return (
    <div className={styles.transaction__wrapper}>
      <div className={styles.transaction__header}>
        <h5>Recent Transactions</h5>
        <Link to="/transactions">See All</Link>
      </div>

      {!!transactions?.length && (
        <div>
          {transactions.map(data => (
            <TransactionItem
              key={data.transaction_id}
              data={data}
              walletId={user?.wallet_id}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default RecentTransactions;
