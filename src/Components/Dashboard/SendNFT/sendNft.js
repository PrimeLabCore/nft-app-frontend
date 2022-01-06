import React, { Fragment, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import styles from "./sendNft.module.css";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import { IoIosArrowForward } from "react-icons/io";
import GiftAnNft from "../../GiftAnNftDialog/GiftAnNft";
import { useSelector, useDispatch } from "react-redux";
import dummy__img from "../../../Assets/Images/dummy-card1.png";
import { AiOutlineCheck } from "react-icons/ai";
import SearchIcon from "@material-ui/icons/Search";
import { BsCheckCircleFill } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go";
import ImportContactsDialog from "../../ImportContactsDialog/ImportContactsDialog";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL, googleAccess } from "../../../Utils/config";
import { toast } from "react-toastify";
import ContactPopup from "../../../common/components/ContactPopup";
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
  const dispatch = useDispatch();
  const { nft } = useSelector((state) => state.authReducer);
  const giftNFT__contactData = useSelector(
    (state) => state.giftNFT__contactData
  );

  // const [data, setdata] = useState(dummyContacts)
  const [filteredData, setFilteredData] = useState(
    giftNFT__contactData ? giftNFT__contactData : []
  );

  const [openPreview, setOpenPreview] = useState(false);
  const [openGift, setOpenGift] = useState(false);
  const [selected, setSelected] = useState(nft ? nft : "");
  const [sendGiftEmail, setSendGiftEmail] = useState("");
  // const [selected,setSelected] = useState({
  //     value:false,
  //     id:""
  // })
  // const [data,setdata] = useState(useSelector((state) => state.home__allnft))
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
    console.log(`nft`, nft);
    nft && setSelected(nft);
  }, [nft]);

  const handleNftGift = () => {
    dispatch({ type: "sendnft__close" });
    if (filteredData.length === 0) {
      setimportContactDialog(true);
    } else {
      setOpenGift(true);
    }
    setOpenPreview(false);
  };

  const handleNftPreview = async () => {
    const fd = new FormData();
    const email_array = filteredData
      .filter((item) => findIfChecked(item.email, checkedState))
      .map((item) => item.email);
    // fd.append("email", [sendGiftEmail].toString());

    let final = sendGiftEmail?.length > 5 ? sendGiftEmail : email_array;
    const resp = await axios.post(
      `${API_BASE_URL}/api/v1/user_images/send_image?uuid=${
        selected.uuid
      }&emails=${[final].toString()}`,
      fd
    );

    console.log(`resp`, resp);

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

  console.log(`selected`, selected);

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
                            <img src={data.image} alt={data.title} />
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
        show={openGift}
        onClose={closegiftNft}
        onBack={openInitialSendNft}
        title={"Send NFT"}
        // handleSearch={handleSearch}
        // HandleDialogOpen={HandleDialogOpen}
        btnText={"Send Gift"}
        handleBtnClick={handleNftPreview}
        // findIfChecked={findIfChecked}
        // HandleClick={HandleClick}
        // checkedState={checkedState}
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
                <img src={selected.image} alt="NFT Vecotry Illustartion" />
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
