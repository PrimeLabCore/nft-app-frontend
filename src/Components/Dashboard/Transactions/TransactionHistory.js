import React, {
  memo,
  useState,
  useEffect
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsArrowUpRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { actionAppStateSetDynamic } from "../../../Store/AppState/actions";
import { actionNFTSetCurrent } from "../../../Store/NFT/actions";
import { mapNftDetails } from "../../../Utils/utils";
import useTransactionRequest from "../../../hooks/useTransactionRequest";
import styles from "./transactions.module.scss";
import TransactionItem from "../Home/components/TransactionItem";

const Tab = ({ isActive, value, label }) => (
  <button
    className={isActive ? styles.active : ""}
    value={value}
  >
    {label}
  </button>
)

const TransactionHistory = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState("all");
  const [windowstate, setWindow] = useState(window.innerWidth < 767);
  const user = useSelector((state) => state.authReducer.user);
  const transactions = useTransactionRequest(user?.user_id)

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

  const handleTabClick = (e) => {
    setTabs(e.target.value);
  };
  const SendNft = () => {
    dispatch(actionAppStateSetDynamic("sendNFTPopupIsOpen", true));
  };

  const openClaim = (data) => {
    dispatch(actionNFTSetCurrent(mapNftDetails(data)));
    navigate("/nft/detail/claim");
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
            <Tab value="all" label="All" isActive={tabs === "all"} />
            <Tab value="sent" label="Sent" isActive={tabs === "sent"} />
            <Tab value="received" label="Received" isActive={tabs === "received"} />
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
            <div style={{ width: 128 }} />
          )}
        </div>
      </div>
      {windowstate && (
        <div className={styles.small__screen__transaction__wrapper}>
          <div
            className={styles.small__screen__transaction}
            onClick={handleTabClick}
          >
            <Tab value="all" label="All" isActive={tabs === "all"} />
            <Tab value="sent" label="Sent" isActive={tabs === "sent"} />
            <Tab value="received" label="Received" isActive={tabs === "received"} />
          </div>
        </div>
      )}
      {displayTransaction?.length
        ? (
          <div className={styles.transaction__list__wrapper}>
            {displayTransaction.map(data => (
              <TransactionItem
                key={data.transaction_id}
                data={data}
                walletId={user?.wallet_id}
                className={data.sender ? styles.clickable : ""}
                onClick={() => !data.sender && openClaim(data)}
              />
            ))}
          </div>
        ) : (
          <div align="center">Transactions not available</div>
        )}
    </div>
  );
});

export default TransactionHistory;
