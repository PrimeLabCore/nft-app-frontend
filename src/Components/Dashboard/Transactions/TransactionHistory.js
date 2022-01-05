import React, {memo, Fragment, useState, useEffect} from "react";
import styles from "./transactions.module.css";
// import {Link} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux";
import {nanoid} from "nanoid";
import {BsArrowUpRight, BsArrowDownLeft} from "react-icons/bs";
import axios from "axios";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {API_BASE_URL} from "../../../Utils/config";

const TransactionHistory = () => {
    const [tabs, setTabs] = useState("all");
    const dispatch = useDispatch();
    const [windowstate, setWindow] = useState(window.innerWidth < 767);
    const [transactions, setTransactions] = useState([]);
    const {allTransactions} = useSelector((state) => state.transactionsReducer);
    let navigate = useNavigate();

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
                (el) => (el = {...el, transaction: "received"})
            );
            let sent = sendersResponse.data?.data?.map(
                (el) => (el = {...el, transaction: "sent"})
            );
            console.log(`transactions`, [...receives, ...sent]);

            setTransactions([...receives, ...sent]);
            dispatch({type: "fetch_transactions", payload: [...receives, ...sent]});
        }

        fetchTransactions();
    }, []);

    useEffect(() => {
        setTransactions(allTransactions);
    }, [allTransactions]);

    const alltransactions2 = [
        {
            transaction: "sent",
            id: "#17372",
            sender: {email: "aaa@aa.cc"},
            receiver: {email: "aaa@aa.cc"},
            name: "michael.near",
            time: "3 days ago",
        },
        {
            transaction: "received",
            id: "#8982",
            sender: {email: "aaa@aa.cc"},
            receiver: {email: "aaa@aa.cc"},
            name: "0x748....4d849",
            time: "3 days ago",
        },
        {
            transaction: "sent",
            id: "#17372",
            sender: {email: "aaa@aa.cc"},
            receiver: {email: "aaa@aa.cc"},
            name: "jordan.near",
            time: "3 days ago",
        },
        {
            transaction: "received",
            id: "#8982",
            sender: {email: "aaa@aa.cc"},
            receiver: {email: "aaa@aa.cc"},
            name: "0x748....4d849",
            time: "3 days ago",
        },
        {
            transaction: "sent",
            id: "#17372",
            sender: {email: "aaa@aa.cc"},
            receiver: {email: "aaa@aa.cc"},
            name: "michael.near",
            time: "3 days ago",
        },
    ];

    const handleTabClick = (e) => {
        setTabs(e.target.value);
    };
    const SendNft = () => {
        dispatch({type: "sendnft__open"});
    };

    const openClaim = (data) => {
        // navigate("/nft/claim");
        dispatch({type: "nft__detail", payload: data});
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
                            <button className={styles.send__nft__mobile__button} onClick={SendNft}>
              <span>
                <BsArrowUpRight/>
              </span>
                                Send NFT
                            </button>
                        ) : (
                            <span>{" "}</span>
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
                                ? data.transaction === "sent"
                                : tabs === "received"
                                ? data.transaction === "received"
                                : data
                        )
                        .map((data) => {
                            return (
                                <Fragment key={nanoid()}>
                                    <div
                                        className={styles.transaction__list}
                                        style={{
                                            cursor:
                                                data.transaction === "received" ? "pointer" : null,
                                        }}
                                        onClick={() =>
                                            data.transaction === "received" && openClaim(data)
                                        }
                                    >
                                        <div className={styles.transaction__action}>
                                            <div className={styles.icon__wrapper}>
                                                {data.transaction === "sent" ? (
                                                    <BsArrowUpRight/>
                                                ) : (
                                                    <BsArrowDownLeft/>
                                                )}
                                            </div>
                                            <h6>
                                                <span>{data.sender.email}</span>{" "}<br/>
                                                {data.transaction === "sent"
                                                    ? "Sent to"
                                                    : "Received from"}{" "}
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
                          {data.receiver.email}
                        </span>
                                            </h6>
                                        </div>
                                        <div className={styles.transaction__time}>
                                            {/* <p>{data.time}</p> */}
                                            <p>
                                                {moment
                                                    .utc(data.created_at)
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