import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import SearchIcon from "@material-ui/icons/Search";
import { Modal } from "react-bootstrap";
import { nanoid } from "nanoid";
import { BsCheckCircleFill } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go";
import { IoIosArrowForward } from "react-icons/io";
import styles from "../../Components/Dashboard/SendNFT/sendNft.module.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import ImportContactsDialog from "../../Components/ImportContactsDialog/ImportContactsDialog";
import { toast } from "react-toastify";

const checkAllContacts = (data) =>
  data.map((item) => ({ checked: true, email: item.primary_email }));

const findIfChecked = (email, array) => {
  const foundItem = array.find((item) => item.email === email);
  if (foundItem) return foundItem.checked;
  else return false;
};

const ContactPopup = ({
  show,
  onClose,
  onBack,
  title,
  btnText,
  handleBtnClick,
  data,
}) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const giftNFT__contactData = useSelector(
    (state) => state.giftNFT__contactData
  );

  const [filteredData, setFilteredData] = useState(
    data ? data : giftNFT__contactData ? giftNFT__contactData : []
  );

  const [checkedState, setCheckedState] = useState(
    checkAllContacts(data ? data : giftNFT__contactData || [])
  );

  const [importContactDialog, setimportContactDialog] = useState(false);

  const [sendGiftEmail, setSendGiftEmail] = useState("");

  const HandleClick = (email) => {
    const updatedCheckedState = checkedState.map((item) =>
      item.email === email
        ? { ...item, checked: !item.checked }
        : { ...item, checked: item.checked }
    );
    setCheckedState(updatedCheckedState);
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

  useEffect(() => {
    setFilteredData(data);
    setCheckedState(checkAllContacts(data));
  }, [data]);

  const contactImportCallback = (error, source) => {
    setimportContactDialog(false);

    if (error) {
      if (source === "backdropClick") {
        toast.error(`Please select a contact provider to import contacts`);
        return;
      }
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
      return data.primary_email.toLowerCase().search(value) !== -1;
    });
    setFilteredData(result);
    setSendGiftEmail(event.target.value.toLowerCase());
  };

  return (
    <>
      <Modal
        className={`${styles.initial__nft__modal} send__nft__mobile__modal initial__modal`}
        show={show}
        onHide={onClose}
        backdrop="static"
        size="lg"
        centered
        keyboard={false}
      >
        <Modal.Header className={styles.modal__header__wrapper} closeButton>
          <div className="modal__multiple__wrapper">
            <button onClick={onBack} className="back__btn">
              Back
            </button>
            <Modal.Title>
              <div className={styles.modal__header}>
                <h2>{title}</h2>
              </div>
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div
            className={`${styles.modal__body__wrapper} ${styles.modal__contact__list}`}
          >
            <div className={styles.search__wrapper}>
              <div className={styles.search__inner__wrapper}>
                <div className={styles.search__input}>
                  <div className={styles.searchIcon}>
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Search People"
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setimportContactDialog(true);
                }}
              >
                Import
              </button>
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
                      <BsCheckCircleFill className={styles.checked} />
                    ) : (
                      <GoPrimitiveDot className={styles.unchecked} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.multiple__btn__wrapper}>
            <button onClick={handleBtnClick} className={styles.next__btn}>
              {btnText}
              <span>
                <IoIosArrowForward />
              </span>
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <ImportContactsDialog
        onImport={importContact}
        status={importContactDialog}
        callback={contactImportCallback}
      />
    </>
  );
};
export default ContactPopup;
