import { sortBy } from 'lodash';
import React, {
  memo, useState, useEffect
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid";
import { BsArrowUpRight } from "react-icons/bs";
import axios from "axios";
import Transaction from './Transaction';
import styles from "./transactions.module.css";
import { API_BASE_URL } from "../../../Utils/config";

function TransactionHistory() {
  const [tabs, setTabs] = useState("all");
  const dispatch = useDispatch();
  const [windowstate, setWindow] = useState(window.innerWidth < 767);
  const [transactions, setTransactions] = useState([]);
  const { allTransactions } = useSelector((state) => state.transactionsReducer);
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
      const response = await axios.get(
        `${API_BASE_URL}/transactions/list/${user?.user_id}`
      );

      const fetchedTransactions = response.data?.data;

      if (fetchedTransactions) {
        dispatch({
          type: "fetch_transactions",
          payload: fetchedTransactions,
        });
      }
    }

    fetchTransactions();
  }, [user]);

  useEffect(() => {
    setTransactions(sortBy(allTransactions, (item) => item.updated).reverse());
  }, [allTransactions]);

  const handleTabClick = (e) => {
    setTabs(e.target.value);
  };
  const SendNft = () => {
    dispatch({ type: "sendnft__open" });
  };

  const displayTransaction = transactions
    .filter((data) => (tabs === "sent"
      ? !!data.sender
      : tabs === "received"
        ? !data.sender
        : data));
  return (
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
            <div style={{ width: '128px' }}> </div>
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
      {displayTransaction?.length ? (
        <div className={styles.transaction__list__wrapper}>
          {displayTransaction.map((data) => (
            <Transaction key={nanoid()} data={data} user={user} />
          ))}
        </div>
      )
        : <div align="center">Transactions not available</div>}
    </div>
  );
}
export default memo(TransactionHistory);
