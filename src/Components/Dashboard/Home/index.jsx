import React, {memo, useEffect, useState} from "react";
import styles from "./Home.module.css";
import {Container, Modal} from "react-bootstrap";
import {IoIosArrowForward} from "react-icons/io";

import {BsCheckCircleFill} from "react-icons/bs";
import {GoPrimitiveDot} from "react-icons/go";
import create_nft_left from "../../../Assets/Images/create-nft-left.png";
import create_nft_right from "../../../Assets/Images/create-nft-right.png";

import MyNFT from "./MyNft";
import Transactions from "./RecentTransactions";
import HomeHeader from "./HomeHeader";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import ImportContactsDialog from "../../ImportContactsDialog/ImportContactsDialog";
import {useNavigate} from "react-router-dom";
import SearchIcon from "@material-ui/core/SvgIcon/SvgIcon";
import {nanoid} from "nanoid";

const checkAllContacts = (data) =>
    data.map((item) => ({checked: false, email: item.primary_email}));

const findIfChecked = (email, array) => {
    const foundItem = array.find((item) => item.email === email);
    if (foundItem) return foundItem.checked;
    else return false;
};

const Home = () => {
    const dispatch = useDispatch();
    const [importContactDialog, setimportContactDialog] = useState(false);
    const [openGift, setOpenGift] = useState(false);
    const giftNFT__contactData = useSelector(
        (state) => state.giftNFT__contactData
    );
    const [filteredData, setFilteredData] = useState(
        giftNFT__contactData ? giftNFT__contactData : []
    );

    const [sendGiftEmail, setSendGiftEmail] = useState("");
    const [checkedState, setCheckedState] = useState(
        checkAllContacts(giftNFT__contactData || [])
    );

    useEffect(() => {
        if (localStorage.getItem("welcome") === "true") {
            localStorage.removeItem("welcome");
            HandleDialogOpen();
        }
    }, []);
    let navigate = useNavigate();


    const HandleDialogOpen = () => {
        setimportContactDialog(true);
    };

    const HandleDialogClose = () => {
        setimportContactDialog(false);
    };

    const HandleClick = (email) => {
        const updatedCheckedState = checkedState.map((item) =>
            item.email === email
                ? {...item, checked: !item.checked}
                : {...item, checked: item.checked}
        );
        setCheckedState(updatedCheckedState);
    };

    const importContact = (data) => {
        if (data) {
            dispatch({
                type: "getGoogleContactData",
                payload: data,
            });
            setimportContactDialog(false);
            setCheckedState(checkAllContacts(data));
            setOpenGift(true);
            setFilteredData(data);
        }
    };
    const HandleSendGift = () => {
        dispatch({type: "createnft__open"})
        setOpenGift(false)
    };

    const contactImportCallback = (error, source) => {
        HandleDialogClose();

        if (error) {
            toast.error(`Something Went Wrong Fetching Contacts From ${source}`);
            return;
        } else {

            toast.success(`Your Contacts Were Successfully Imported From ${source}`);
            return;
        }
    };
    const handleSearch = (event) => {
        let value = event.target.value.toLowerCase();
        let result = [];
        result = giftNFT__contactData.filter((data) => {
            return data.title.toLowerCase().search(value) !== -1;
        });
        setFilteredData(result);
        setSendGiftEmail(event.target.value.toLowerCase());
    };
    return (
        <>
            <div className={styles.home__main__wrapper}>
                <Container>
                    {/* Home Header  */}
                    <HomeHeader/>

                    <ImportContactsDialog
                        onImport={importContact}
                        status={importContactDialog}
                        callback={contactImportCallback}
                    />

                    <Modal
                        className={`${styles.initial__nft__modal} send__nft__mobile__modal initial__modal`}
                        show={openGift}
                        onHide={() => setOpenGift(false)}
                        backdrop="static"
                        size="lg"
                        centered
                        keyboard={false}
                    >
                        <Modal.Header className={styles.modal__header__wrapper} closeButton>
                            <div className="modal__multiple__wrapper">
                                <Modal.Title>
                                    <div className={styles.modal__header}>
                                        <h2>Gift an NFT</h2>
                                    </div>
                                </Modal.Title>
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <div className={styles.modal__body__wrapper}>
                                <div className={styles.search__wrapper}>
                                    <div className={styles.search__inner__wrapper}>
                                        <div className={styles.search__input}>
                                            <div className={styles.searchIcon}>
                                                <SearchIcon/>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search People"
                                                onChange={handleSearch}
                                            />
                                        </div>
                                    </div>
                                    <button onClick={HandleDialogOpen}>Import</button>
                                </div>
                                <div className={styles.data__wrapper}>
                                    {filteredData.map((value, index) => (
                                        <div className={styles.data_row_container} key={nanoid()}>
                                            {/* AVATAR */}
                                            {/* <div className={styles.avatar}>
                    <img
                      src={value.photos[0].url}
                      alt={value.names[0].displayName}
                    />
                  </div> */}
                                            {/* TEXT */}
                                            <div className={styles.textContainer}>
                                                <h6>{value.fullname}</h6>
                                                <p>{value.primary_email}</p>
                                            </div>
                                            {/* ICONS */}
                                            <div
                                                className={styles.icon}
                                                onClick={() => HandleClick(value.primary_email)}
                                            >
                                                {findIfChecked(value.primary_email, checkedState) ? (
                                                    <BsCheckCircleFill className={styles.checked}/>
                                                ) : (
                                                    <GoPrimitiveDot className={styles.unchecked}/>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.multiple__btn__wrapper}>
                                <button onClick={HandleSendGift} className={styles.next__btn}>
                                    Send Gift
                                    <span>
                <IoIosArrowForward/>
              </span>
                                </button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/* Home Create NFT Container */}
                    <div className={styles.create__nft__container}>
                        <div className={styles.create__nft__content}>
                            <div>
                                <h1>
                                    Start Creating Your <strong>NFTs</strong> Today
                                </h1>
                                <div className={styles.btn__wrapper}>
                                    <button onClick={() => dispatch({type: "createnft__open"})}>
                                        Create NFT{" "}
                                        <span>
                      <IoIosArrowForward/>
                    </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <img
                            src={create_nft_left}
                            className={styles.create_nft_left}
                            alt="Create NFT"
                        />
                        <img
                            src={create_nft_right}
                            alt="Create NFT"
                            className={styles.create_nft_right}
                        />
                    </div>

                    <MyNFT isLink={true}/>
                    <Transactions/>
                </Container>
            </div>
        </>
    );
};
export default memo(Home);
