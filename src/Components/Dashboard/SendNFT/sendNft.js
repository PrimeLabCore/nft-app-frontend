import axios from "axios";
import { isEmpty } from "lodash";
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
import { API_BASE_URL } from "../../../Utils/config";
import { getFileExtension } from "../../../Utils/utils";
import { LoaderIconBlue } from "../../Generic/icons";
import ImportContactsDialog from "../../ImportContactsDialog/ImportContactsDialog";
import styles from "./sendNft.module.css";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1.5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1.5
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1.5
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1.5
  }
};

const checkAllContacts = (data) =>
  data?.map((item) => ({
    checked: true,
    email: item.primary_email
  }));

// const findIfChecked = (email, array) => {
//   const foundItem = array.find((item) => item.email === email);
//   if (foundItem) return foundItem.checked;
//   return false;
// };

function SendNft() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const { nft } = useSelector((state) => state.authReducer);
  const giftNFT__contactData = useSelector(
    (state) => state.giftNFT__contactData
  );

  const [filteredData, setFilteredData] = useState([]);

  const [openPreview, setOpenPreview] = useState(false);
  const [openGift, setOpenGift] = useState(false);
  const [selected, setSelected] = useState(nft || "");
  const { onlyOneContactShare } = useSelector((state) => state.home__allnft);

  // const [sendGiftEmail, setSendGiftEmail] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const sendnft__popup = useSelector((state) => state.sendnft__popup);
  const { nfts } = useSelector((state) => state.home__allnft);
  const [importContactDialog, setimportContactDialog] = useState(false);
  const [displayNfts, setDisplayNfts] = useState(nfts);
  const firstImport = localStorage.getItem("firstImport");
  const closeSendNft = () => {
    dispatch({ type: "sendnft__close" });
    setOpenPreview(false);
  };
  const [checkedState, setCheckedState] = useState(
    checkAllContacts(giftNFT__contactData || [])
  );

  // for checked and unchecked items
  // const HandleClick = (email) => {
  //   const updatedCheckedState = checkedState.map((item) =>
  //     item.email === email
  //       ? { ...item, checked: !item.checked }
  //       : { ...item, checked: item.checked }
  //   );
  //   setCheckedState(updatedCheckedState);
  // };

  useEffect(() => {
    setSelected(nft);
  }, [nft]);

  useEffect(() => 0, [checkedState]);

  const closegiftNft = () => {
    if (isEmpty(nfts)) {
      setOpenGift(false);
      dispatch({ type: "createnft__open" });
    } else {
      setOpenGift(false);
    }
  };
  useEffect(() => {
    setDisplayNfts(nfts.reverse());
    if (nfts?.length && nfts?.length > 1 && !onlyOneContactShare) dispatch({ type: "onlyOneContactShare" });
  }, [nfts]);
  useEffect(() => {
    if (giftNFT__contactData) {
      setFilteredData(giftNFT__contactData);
    } else {
      // console.log("empty dataaa.................");
    }
  }, [giftNFT__contactData]);

  // fetch all the nfts of the user - in future use pagination
  useEffect(() => {
    setIsloading(true);

    axios
      .get(`${API_BASE_URL}/nfts/list?owner_id=${user?.user_id}`)
      .then((response) => {
        const tempNfts = response.data?.data;
        dispatch({ type: "update_nfts", payload: tempNfts });
      })
      .catch((error) => {
        if (error?.response?.data) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => {
        setIsloading(false);
      });
  }, []);

  useEffect(() => {
    if (nft) {
      const displayNFTsArray = [...nfts];
      const index = nfts.findIndex(x => x.nft_id === nft.nftid);

      if (index > 0) {
        if (nft?.id !== selected?.id) setSelected(displayNFTsArray[index]);
        displayNFTsArray.splice(index, 1);
        displayNFTsArray.unshift(nfts[index]);
      }
      // console.log(nft, selected);
      setDisplayNfts(displayNFTsArray)
    }
  }, [nft, nfts]);

  const handleNftGift = () => {
    dispatch({ type: "sendnft__close" });

    setOpenPreview(false);
    if (localStorage.getItem("contactImport") === "true") {
      setimportContactDialog(true);
    } else {
      setOpenGift(true);
    }
  };
  const handleNftPreview = async (selectedContacts) => {
    if (selectedContacts && selectedContacts.length > 0) {
      setFilteredData(selectedContacts.map((contact) => contact.contact_id));
      const nftDetail = {
        sender_id: user?.user_id,
        recipient_id: selectedContacts.map(
          (contact) => contact.contact_user_id || contact.contact_id
        ),
        transaction_item_id: selected.nft_id || selected.nftid,
        transaction_value: "NA",
        type: "gift"
      };

      axios
        .post(`${API_BASE_URL}/transactions`, nftDetail)
        .then((response) => {
          // console.log(response.data);
          toast.success(response.data.message);

          dispatch({ type: "sendnft__close" });
          dispatch({ type: "close_dialog_gift_nft" });
          setOpenGift(false);
          setOpenPreview(true);
        })
        .catch((error) => {
          if (error.response.data) {
            toast.error(error.response.data.message);
          }
        })
        .finally(() => { });
    } else {
      toast.error("Please select some contact!");
    }
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

  const nftClicked = (data) => {
    setSelected(data);
  };

  useEffect(() => {
    dispatch({ type: "close_dialog_gift_nft" });
  }, []);

  const HandleDialogClose = () => {
    setimportContactDialog(false);
  };

  const importContact = (data) => {
    if (data) {
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
    } else {
      toast.success(`Your contacts were successfully imported from ${source}`);
      setOpenGift(true);
    }
  };

  // const HandleDialogOpen = () => {
  //   setimportContactDialog(true);
  // };

  const urlArray = (selected?.file_url || selected?.image)?.split(".");
  const fileType = urlArray?.length ? urlArray[urlArray.length - 1] : "";

  useEffect(() => {
    if (localStorage.getItem("sendNftId")) {
      setSelected(JSON.parse(localStorage.getItem("sendNftId")));
      localStorage.removeItem("sendNftId");
    } else {
      setSelected("");
    }
  }, []);

  // console.log(nfts.sort(function(x,y)
  // { return x.nft_id === selected.nft_id ?
  // -1 : y.nft_id === selected.nft_id ? 1 : 0; }))
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
              {isLoading ? (
                <LoaderIconBlue />
              ) : (
                <Carousel
                  removeArrowOnDeviceType={[
                    "tablet",
                    "mobile",
                    "desktop",
                    "superLargeDesktop"
                  ]}
                  responsive={responsive}
                  autoPlay={false}
                  infinite={false}
                  swipeable
                  draggable
                >
                  {displayNfts.map((data, i) => {
                    const fileType = getFileExtension(data?.file_url);
                    return (
                      <Fragment key={nanoid()}>
                        <div
                          className={`${styles.mynft__box} ${(selected?.nft_id === data?.nft_id
                            || selected?.nftid === data?.nft_id)
                            ? styles.selected__nft
                            : ""
                          }`}
                          onClick={() => nftClicked(data, i)}
                        >
                          <div className={styles.mynft__box__image__wrapper}>
                            <div className={styles.mynft__box__image}>
                              {fileType.toLowerCase() === "mp4" ? (
                                <video
                                  style={{ width: "100%", borderRadius: "8px" }}
                                  src={data?.file_url}
                                />
                              ) : fileType.toLowerCase() === "mp3" ? (
                                <div
                                  style={{ width: "100%", padding: "0 2px" }}
                                >
                                  <audio
                                    style={{
                                      width: "inherit",
                                      marginTop: "60px"
                                    }}
                                    controls
                                  >
                                    <source src={data?.file_url} />
                                  </audio>
                                </div>
                              ) : (
                                <img src={data?.file_url} alt={data?.title} />
                              )}
                            </div>
                            <div className={styles.mynft__box__cat}>
                              <h6>{data?.category}</h6>
                            </div>
                          </div>

                          {selected?.nft_id === data?.nft_id
                            || selected?.nftid === data?.nft_id ? (
                              <div
                                className={
                                  styles.selected__mynft__box__description__wrapper
                                }
                              >
                                <div className={styles.mynft__box__description}>
                                  <h2>{data?.title}</h2>
                                  <span
                                    className={
                                      styles.mynft__box__description__text
                                    }
                                  >
                                    {data?.nft_id}
                                  </span>
                                </div>
                                <div className={styles.checked}>
                                  <AiOutlineCheck />
                                </div>
                              </div>
                            ) : (
                              <div
                                className={
                                  styles.mynft__box__description__wrapper
                                }
                              >
                                <h2>{data?.title}</h2>
                                <p>{data?.nft_id}</p>
                              </div>
                            )}
                        </div>
                      </Fragment>
                    );
                  })}
                </Carousel>
              )}
            </div>
          </div>

          <div className={styles.multiple__btn__wrapper}>
            <button
              onClick={handleNftGift}
              disabled={!selected}
              className={styles.next__btn}
            >
              {" "}
              {/* handleNftGift */}
              Next
              <span>
                <IoIosArrowForward />
              </span>
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* NFT Sender Modal */}
      {/* {openGift && <GiftAnNft dashboard={true} closebutton={true}
      sendGiftButton={handleNftPreview}/>} */}

      <ImportContactsDialog
        onImport={importContact}
        status={importContactDialog}
        callback={contactImportCallback}
      />

      <ContactPopup
        displayImportContact={false}
        show={openGift}
        onClose={closegiftNft}
        onBack={openInitialSendNft}
        title="Send NFT"
        btnText={firstImport ? "Gift NFT" : "Send Gift"}
        handleBtnClick={(selectedContacts) =>
          firstImport
            ? (dispatch({ type: "createnft__open" }), setOpenGift(false))
            : handleNftPreview(selectedContacts)}
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
        <Modal.Header className={styles.modal__header__wrapper} closeButton />
        <Modal.Body>
          <div className={styles.modal__body__wrapper}>
            <div className={styles.mint__info__wrapper}>
              <div className={styles.mint__image}>
                {fileType.toLowerCase() === "mp4" ? (
                  <video
                    style={{ width: "100%", borderRadius: "8px" }}
                    src={selected?.file_url}
                  />
                ) : fileType.toLowerCase() === "mp3" ? (
                  <div style={{ width: "100%", padding: "0 2px" }}>
                    <audio
                      style={{ width: "inherit", marginTop: "60px" }}
                      controls
                    >
                      <source src={selected?.file_url} />
                    </audio>
                  </div>
                ) : (
                  <img src={selected?.file_url || selected?.image} alt={selected?.title} />
                )}
              </div>
              <h1>
                {selected?.title}
                <br />
                &nbsp;sent successfully to
              </h1>
              <h6>
                {filteredData.length}
                &nbsp;contacts
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
}
export default SendNft;
