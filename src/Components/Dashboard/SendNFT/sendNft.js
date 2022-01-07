import axios from "axios";
import { nanoid } from "nanoid";
import React, { Fragment, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { AiOutlineCheck } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import Carousel from "react-multi-carousel";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ContactPopup from "../../../common/components/ContactPopup";
import ImportContactsDialog from "../../ImportContactsDialog/ImportContactsDialog";
import styles from "./sendNft.module.css";
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1.5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1.5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1.5,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1.5,
  },
};

const checkAllContacts = (data) =>
  data.map((item) => ({ checked: true, email: item.primary_email }));

const findIfChecked = (email, array) => {
  const foundItem = array.find((item) => item.email === email);
  if (foundItem) return foundItem.checked;
  else return false;
};

const SendNft = () => {
  let navigate = useNavigate();
  const { user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const { nft } = useSelector((state) => state.authReducer);
  const giftNFT__contactData = useSelector(
    (state) => state.giftNFT__contactData
  );

  const [filteredData, setFilteredData] = useState(
    giftNFT__contactData ? giftNFT__contactData : []
  );

  const [openPreview, setOpenPreview] = useState(false);
  const [openGift, setOpenGift] = useState(false);
  const [selected, setSelected] = useState(nft ? nft : "");
  const [sendGiftEmail, setSendGiftEmail] = useState("");

  const sendnft__popup = useSelector((state) => state.sendnft__popup); //Defined in reducer function
  const home__allnft = useSelector((state) => state.home__allnft); //Defined in reducer function
  // let updatedNFT = useSelector((state) => state.home__allnft); //Defined in reducer function

  const closeSendNft = () => {
    dispatch({ type: "sendnft__close" });
    setOpenPreview(false);
  };
  const [checkedState, setCheckedState] = useState(
    checkAllContacts(giftNFT__contactData || [])
  );

  // for checked and unchecked items
  const HandleClick = (email) => {
    // const find_index_of_clicked_item = (data.findIndex(value => Number(value.id) === Number(id)))
    // data[find_index_of_clicked_item] = { ...data[find_index_of_clicked_item], checked: !data[find_index_of_clicked_item].checked }
    // setdata([...data])
    const updatedCheckedState = checkedState.map((item) =>
      item.email === email
        ? { ...item, checked: !item.checked }
        : { ...item, checked: item.checked }
    );
    setCheckedState(updatedCheckedState);
  };

  const closegiftNft = () => {
    setOpenGift(false);
  };

  useEffect(() => {
    if (giftNFT__contactData) {
      setFilteredData(giftNFT__contactData);
    } else {
      console.log("empty dataaa.................");
    }
  }, [giftNFT__contactData]);

  useEffect(() => {
    nft && setSelected(nft);
  }, [nft]);

  const handleNftGift = () => {
    dispatch({ type: "sendnft__close" });

    setOpenPreview(false);
    setOpenGift(true);
  };

  const handleNftPreview = async () => {
    const fd = new FormData();
    const email_array = filteredData
      .filter((item) => findIfChecked(item.email, checkedState))
      .map((item) => item.email);
    let final = sendGiftEmail?.length > 5 ? sendGiftEmail : email_array;
    fd.append("recipient_id", [final].toString());
    fd.append("transaction_item_id", selected.uuid);
    fd.append("type", "gift");
    fd.append("sender_id", user.user_id);
    const resp = await axios.post(`/transactions`, fd);

    dispatch({ type: "sendnft__close" });
    dispatch({ type: "close_dialog_gift_nft" });
    setOpenGift(false);
    setOpenPreview(true);
  };

  const openInitialSendNft = () => {
    dispatch({ type: "sendnft__open" });
    setOpenGift(false);
    setOpenPreview(false);
  };

  const openHistory = () => {
    closeSendNft();
    navigate("/transactions");
  };

  const nftClicked = (e, i) => {
    if (selected === i) {
      setSelected("");
    } else {
      setSelected(e);
    }
  };

  useEffect(() => {
    dispatch({ type: "close_dialog_gift_nft" });
  }, []);

  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = giftNFT__contactData.filter((data) => {
      return data.primary_email.toLowerCase().search(value) !== -1;
    });
    setFilteredData(result);
    setSendGiftEmail(event.target.value.toLowerCase());
  };

  const [importContactDialog, setimportContactDialog] = useState(false);
  const HandleDialogClose = () => {
    setimportContactDialog(false);
  };

  const importContact = (data) => {
    if (data) {
      dispatch({
        type: "getGoogleContactData",
        payload: data,
      });
      setCheckedState(checkAllContacts(data));
      setimportContactDialog(false);
      setFilteredData(data);
    }
  };

  const contactImportCallback = (error, source) => {
    HandleDialogClose();

    if (error) {
      if (source === "backdropClick") {
        toast.error(`Please select a contact provider to import contacts`);
        return;
      }
      toast.error(`Something Went Wrong Fetching Contacts From ${source}`);
      return;
    } else {
      toast.success(`Your Contacts Were Successfully Imported From ${source}`);
      setOpenGift(true);
      return;
    }
  };

  const HandleDialogOpen = () => {
    setimportContactDialog(true);
  };

  const urlArray = selected?.image?.split(".");
  const fileType = urlArray?.length ? urlArray[urlArray.length - 1] : "";
  return (
    <>
      {/* NFT Selection Modal */}
      <Modal
        className={`${styles.initial__nft__modal} initial__modal`}
        show={sendnft__popup}
        onHide={closeSendNft}
        backdrop="static"
        // size="lg"
        centered
        keyboard={false}
      >
        <Modal.Header className={styles.modal__header__wrapper} closeButton>
          <div className="modal__title__wrapper">
            <Modal.Title>
              <div className={styles.modal__header}>
                <h2>Send NFT</h2>
              </div>
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.modal__body__wrapper}>
            <h6>Select NFT you want to send</h6>
            <div className={styles.mynft__box__wrapper}>
              <Carousel
                removeArrowOnDeviceType={[
                  "tablet",
                  "mobile",
                  "desktop",
                  "superLargeDesktop",
                ]}
                responsive={responsive}
                autoPlay={false}
                infinite={false}
                swipeable={true}
                draggable={true}
              >
                {home__allnft.map((data, i) => {
                  const urlArray = data?.file?.split(".");
                  const fileType = urlArray.length
                    ? urlArray[urlArray.length - 1]
                    : "";

                  return (
                    <Fragment key={nanoid()}>
                      <div
                        className={`${styles.mynft__box} ${
                          selected.uuid === data.uuid
                            ? styles.selected__nft
                            : ""
                        }`}
                        onClick={(e) => nftClicked(data, i)}
                      >
                        <div className={styles.mynft__box__image__wrapper}>
                          <div className={styles.mynft__box__image}>
                            {fileType.toLowerCase() === "mp4" ? (
                              <video
                                style={{ width: "100%", borderRadius: "8px" }}
                                src={data?.image}
                              />
                            ) : fileType.toLowerCase() === "mp3" ? (
                              <div style={{ width: "100%", padding: "0 2px" }}>
                                <audio
                                  style={{
                                    width: "inherit",
                                    marginTop: "60px",
                                  }}
                                  controls
                                >
                                  <source src={data?.image} />
                                </audio>
                              </div>
                            ) : (
                              <img src={data?.image} alt={data.name} />
                            )}
                          </div>
                          <div className={styles.mynft__box__cat}>
                            <h6>{data.cat}</h6>
                          </div>
                        </div>

                        {selected.uuid === data.uuid ? (
                          <>
                            <div
                              className={
                                styles.selected__mynft__box__description__wrapper
                              }
                            >
                              <div className={styles.mynft__box__description}>
                                <h2>{data.title}</h2>
                                <p>{data.id}</p>
                              </div>
                              <div className={styles.checked}>
                                <AiOutlineCheck />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              className={
                                styles.mynft__box__description__wrapper
                              }
                            >
                              <h2>{data.title}</h2>
                              <p>{data.id}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </Fragment>
                  );
                })}
              </Carousel>
            </div>
          </div>

          <div className={styles.multiple__btn__wrapper}>
            <button
              onClick={handleNftGift}
              disabled={!selected}
              className={styles.next__btn}
            >
              {" "}
              {/*handleNftGift*/}
              Next
              <span>
                <IoIosArrowForward />
              </span>
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* NFT Sender Modal */}
      {/* {openGift && <GiftAnNft dashboard={true} closebutton={true} sendGiftButton={handleNftPreview}/>} */}

      <ImportContactsDialog
        onImport={importContact}
        status={importContactDialog}
        callback={contactImportCallback}
      />

      <ContactPopup
        data={filteredData}
        displayImportContact={false}
        //show={openGift}
        show={true}
        onClose={closegiftNft}
        onBack={openInitialSendNft}
        title={"Send NFT"}
        btnText={"Send Gift"}
        handleBtnClick={handleNftPreview}
      />

      {/* NFT Preview Modal */}
      <Modal
        className={`${styles.initial__nft__modal} nft__final__mobile__modal initial__modal`}
        show={openPreview}
        onHide={closeSendNft}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header
          className={styles.modal__header__wrapper}
          closeButton
        ></Modal.Header>
        <Modal.Body>
          <div className={styles.modal__body__wrapper}>
            <div className={styles.mint__info__wrapper}>
              <div className={styles.mint__image}>
                {fileType.toLowerCase() === "mp4" ? (
                  <video
                    style={{ width: "100%", borderRadius: "8px" }}
                    src={selected?.image}
                  />
                ) : fileType.toLowerCase() === "mp3" ? (
                  <div style={{ width: "100%", padding: "0 2px" }}>
                    <audio
                      style={{ width: "inherit", marginTop: "60px" }}
                      controls
                    >
                      <source src={selected?.image} />
                    </audio>
                  </div>
                ) : (
                  <img src={selected?.image} alt={selected.name} />
                )}
              </div>
              <h1>
                {selected.name} <br /> sent successfully to
              </h1>
              <h6>
                {sendGiftEmail?.length > 5
                  ? sendGiftEmail.split(",").length
                  : filteredData.filter((item) =>
                      findIfChecked(item.primary_email, checkedState)
                    ).length}{" "}
                contacts
              </h6>
            </div>
          </div>
          <div
            className={`${styles.multiple__btn__wrapper} ${styles.last__modal__btn}`}
          >
            <button onClick={openHistory} className={styles.next__btn}>
              Open History
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default SendNft;
