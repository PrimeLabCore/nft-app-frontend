import React, { Fragment, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { nanoid } from "nanoid";
import { Modal } from "react-bootstrap";
import { AiOutlineCheck } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import Carousel from "react-multi-carousel";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ContactPopup from "../../../common/components/ContactPopup";
import { getFileExtension } from "../../../Utils/utils";
import AppLoader from "../../Generic/AppLoader";
import { LoaderIconBlue } from "../../Generic/icons";
import ImportContactsDialog from "../../ImportContactsDialog/ImportContactsDialog";
import styles from "./sendNft.module.scss";
import { actionAppStateSetDynamic } from "../../../Store/AppState/actions";
import { actionNFTFetchList } from "../../../Store/NFT/actions";
import { getNFTListByOwnerId } from "../../../api/nft";
import { createTransactionRequest } from "../../../api/transactions";

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

const getValidUnsendNFTs = (sentIds, nfts) => nfts?.filter(
  item => !sentIds.includes(item?.nft_id)
)

function SendNft() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.authReducer.user);
  const nft = useSelector(state => state.authReducer.nft);
  const googleContactData = useSelector(state => state.appState.googleContactData);

  const [filteredData, setFilteredData] = useState([]);

  const [openPreview, setOpenPreview] = useState(false);
  const [openGift, setOpenGift] = useState(false);
  const [selected, setSelected] = useState(nft || "");

  const [isLoading, setIsloading] = useState(false);

  const sendNFTPopupIsOpen = useSelector((state) => state.appState.sendNFTPopupIsOpen);
  const nftList = useSelector((state) => state.nft.nftList);
  const [importContactDialog, setimportContactDialog] = useState(false);
  const [displayNfts, setDisplayNfts] = useState(nftList);
  const firstImport = localStorage.getItem("firstImport");

  // get all the unique NFT id that is being send to someone.
  const allClaimedNftIds = useSelector(
    (state) => [...new Set(state.transactionsReducer.allTransactions
      .filter(item => item.type !== 'unclaimed')
      .map(item => item.transaction_item_id))]
  );

  const closeSendNft = () => {
    dispatch(actionAppStateSetDynamic("sendNFTPopupIsOpen", false));
    setOpenPreview(false);
  };
  const [, setCheckedState] = useState(
    checkAllContacts(googleContactData)
  );

  useEffect(() => {
    setSelected(nft);
  }, [nft]);

  const closeGiftNft = () => {
    if (isEmpty(nftList)) {
      setOpenGift(false);
      dispatch(actionAppStateSetDynamic("createNFTPopupIsOpen", true));
    } else {
      setOpenGift(false);
    }
  };
  useEffect(() => {
    setDisplayNfts(getValidUnsendNFTs(allClaimedNftIds, nftList.reverse()));
  }, [nftList]);

  useEffect(() => {
    if (googleContactData.length) {
      setFilteredData(googleContactData);
    }
  }, [googleContactData]);

  // fetch all the nftList of the user - in future use pagination
  useEffect(() => {
    setIsloading(true);

    getNFTListByOwnerId(user?.user_id)
      .then(response => {
        dispatch(actionNFTFetchList(Array.isArray(response.data?.data) ? response.data?.data : []));
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
      const displayNFTsArray = [...nftList];
      const index = nftList.findIndex(x => x.nft_id === nft.nftid);

      if (index > 0) {
        if (nft?.id !== selected?.id) setSelected(displayNFTsArray[index]);
        displayNFTsArray.splice(index, 1);
        displayNFTsArray.unshift(nftList[index]);
      }
      // console.log(nft, selected);
      setDisplayNfts(getValidUnsendNFTs(allClaimedNftIds, displayNFTsArray))
    }
  }, [nft, nftList]);

  const handleNftGift = () => {
    dispatch(actionAppStateSetDynamic("sendNFTPopupIsOpen", false));

    setOpenPreview(false);
    if (localStorage.getItem("contactImport") === "true") {
      setimportContactDialog(true);
    } else {
      setOpenGift(true);
    }
  };

  const handleNftPreview = selectedContacts => {
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
      setIsloading(true)

      createTransactionRequest(nftDetail)
        .then(response => {
          // console.log(response.data);
          toast.success(response.data.message);

          dispatch(actionAppStateSetDynamic("sendNFTPopupIsOpen", false));
          dispatch(actionAppStateSetDynamic("giftNFTPopupIsOpen", false));
          setOpenGift(false);
          setOpenPreview(true);
        })
        .catch((error) => {
          if (error.response.data) {
            toast.error(error.response.data.message);
          }
        })
        .finally(() => {
          setIsloading(false)
        });
    } else {
      toast.error("Please select some contact!");
    }
  };

  const openInitialSendNft = () => {
    dispatch(actionAppStateSetDynamic("sendNFTPopupIsOpen", true));
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
    dispatch(actionAppStateSetDynamic("giftNFTPopupIsOpen", false));
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

  const handleClickContactPopupButton = (selectedContacts) => {
    if (firstImport) {
      dispatch(actionAppStateSetDynamic("createNFTPopupIsOpen", true));
      setOpenGift(false);
    } else {
      handleNftPreview(selectedContacts);
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

  // { return x.nft_id === selected.nft_id ?
  // -1 : y.nft_id === selected.nft_id ? 1 : 0; }))
  return (
    <>
      {/* NFT Selection Modal */}
      <Modal
        className={`${styles.initial__nft__modal} initial__modal`}
        show={sendNFTPopupIsOpen}
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

                          {selected?.nft_id === data?.nft_id || selected?.nftid === data?.nft_id
                            ? (
                              <div
                                className={
                                  styles.selected__mynft__box__description__wrapper
                                }
                              >
                                <div className={styles.mynft__box__description}>
                                  <h2>{data?.title}</h2>
                                  <span className={styles.mynft__box__description__text}>
                                    {data?.nft_id}
                                  </span>
                                </div>
                                <div className={styles.checked}>
                                  <AiOutlineCheck />
                                </div>
                              </div>
                            )
                            : (
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
      {/* {openGift && <GiftAnNft dashboard={true} closeButton={true}
      sendGiftButton={handleNftPreview} />} */}

      <ImportContactsDialog
        onImport={importContact}
        status={importContactDialog}
        callback={contactImportCallback}
      />

      {isLoading ? (
        <AppLoader />
      ) : (
        <ContactPopup
          displayImportContact={false}
          show={openGift}
          onClose={closeGiftNft}
          onBack={openInitialSendNft}
          title="Send NFT"
          btnText={firstImport ? "Gift NFT" : "Send Gift"}
          handleBtnClick={handleClickContactPopupButton}
        />
      )}

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
                    src={selected?.file_url || selected?.image}
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
                  <img src={selected?.file_url || selected?.image} alt={selected.title} />
                )}
              </div>
              <h1>
                {selected.title}
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
