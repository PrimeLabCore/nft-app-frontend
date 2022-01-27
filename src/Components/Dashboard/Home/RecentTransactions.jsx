import React, {
  memo,
  useEffect,
  useState,
} from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import { sortBy } from 'lodash';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { API_BASE_URL } from '../../../Utils/config';
import Transaction from '../Transactions/Transaction';
import styles from './Home.module.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const dispatch = useDispatch();
  const { allTransactions } = useSelector((state) => state.transactionsReducer);
  const { user } = useSelector((state) => state.authReducer);

  useEffect(() => {
    async function fetchTransactions() {
      const response = await axios.get(
        `${API_BASE_URL}/transactions/list/${user?.user_id}`,
      );

      const fetchedTransactions = response.data?.data;

      if (fetchedTransactions) {
        dispatch({
          type: 'fetch_transactions',
          payload: fetchedTransactions,
        });
      }
    }

    fetchTransactions();
  }, [user]);

  useEffect(() => {
    setTransactions(
      sortBy(allTransactions, (item) => item.created)
        .reverse()
        .filter(t => ['create_wallet', 'mine_nft', 'unclaimed', 'transfer_nft'].includes(t.type))
    );
    // setTransactions(sortBy(allTransactions, (item) => item.date));
  }, [allTransactions]);

  return (
    <div className={styles.transaction__wrapper}>
      <div className={styles.transaction__header}>
        <h5>Recent Activities</h5>
        <Link to="/transactions">See All</Link>
      </div>
      {(transactions?.length > 0) && (
        <div className={styles.transaction__list__wrapper}>
          {transactions.map((data) => (
            <Transaction key={nanoid()} data={data} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};
export default memo(Transactions);
