import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import { isEmpty } from "lodash";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { BsCheckCircleFill, BsCloudUpload, BsPlusLg } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go";
import { IoIosArrowForward } from "react-icons/io";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "../../Components/Dashboard/SendNFT/sendNft.module.css";
import { LoaderIconBlue } from "../../Components/Generic/icons";
import ImportContactsDialog from "../../Components/ImportContactsDialog/ImportContactsDialog";
import { API_BASE_URL } from "../../Utils/config";
import {
  isOnlyNumber,
  isValidateEmail,
  isValidFullName,
  isValidPhoneNumber
} from "../../Utils/utils";
import ManualContactPopup from "./ManualContactPopup";

const contactFormFields = {
  email: "",
  phone: "",
  first_name: "",
  last_name: ""
};

function ContactPopup({
  show,
  onClose,
  onBack,
  title,
  btnText,
  handleBtnClick,
  displayImportContact
  // firstImport
}) {
  const dispatch = useDispatch();

  const [selectedContacts, setSelectedContacts] = useState([]);

  const { user, contacts } = useSelector((state) => state.authReducer);

  const [isLoading, setIsloading] = useState(false);
  const [manualContactOpen, setManualContactOpen] = useState(false);

  const [inputField, setInputField] = useState({ ...contactFormFields });
  const [filteredData, setFilteredData] = useState(contacts);

  const firstImport = localStorage.getItem("firstImport");

  const [searchText, setSearchText] = useState("");

  const checkAllContacts = (data) => {
    // selecting all the contacts
    setSelectedContacts(data);
  };

  useEffect(() => {
    setFilteredData(contacts);
    checkAllContacts(contacts);
  }, [contacts, isLoading]);

  // get contacts
  useEffect(() => {
    if (!show) return;
    setTimeout(() => {
      if (!contacts?.length) setIsloading(true);
      axios
        .get(`${API_BASE_URL}/contacts/list/${user?.user_id}`)
        .then((response) => {
          // save user details
          // before saving contacts to the reducer make all the emails unique
          const {
            data: { data: contacts = [] }
          } = response;
          const uniqueEmails = [];
          // console.log(`Got ${contacts.length} contacts from server`);
          const uniqueContacts = contacts.filter((contactObj) => {
            if (contactObj.email && contactObj.email.length) {
              let emailExists = false;
              for (let i = 0; i < contactObj.email.length; i++) {
                const emailObj = { ...contactObj.email[i] };
                if (
                  emailObj && emailObj.address && uniqueEmails.indexOf(emailObj.address) !== -1
                ) {
                  emailExists = true;
                  break;
                } else {
                  uniqueEmails.push(emailObj.address);
                }
              }
              if (emailExists) {
                return false;
              }
              return true;
            }
            return true;
          });
          setIsloading(true);
          dispatch({ type: "update_contacts", payload: uniqueContacts });
        })
        .catch((error) => {
          if (error?.response?.data) {
            toast.error(error.response.data.message);
          }
        })
        .finally(() => {
          setIsloading(false);
        });
    }, 1500)
  }, [show]);

  const getPrimaryEmail = (contact) => {
    if (contact.email.length > 0) {
      return contact.email[0].address;
    }
    return "";
  };

  const getPrimaryPhone = (contact) => {
    if (contact.phone.length > 0) {
      return contact.phone[0].number;
    }
    return "";
  };

  const getFulllName = (contact) => `${contact.first_name} ${contact.last_name}`;

  const findIfChecked = (contact_id) =>
    !!selectedContacts.find((contact) => contact.contact_id === contact_id);

  const [importContactDialog, setimportContactDialog] = useState(displayImportContact);

  const handleToggleContactSelection = (targetContact) => {
    const wasSelected = !!selectedContacts.find(
      (contact) => contact.contact_id === targetContact.contact_id
    );

    if (wasSelected) {
      setSelectedContacts(
        selectedContacts.filter(
          (contact) => contact.contact_id !== targetContact.contact_id
        )
      );
    } else {
      setSelectedContacts([...selectedContacts, targetContact]);
    }
  };

  const importContact = (data) => {
    if (data) {
      checkAllContacts(data);
      setimportContactDialog(false);
      setFilteredData(data);
    }
  };

  const contactImportCallback = (error, source) => {
    setimportContactDialog(false);
    if (error) {
      if (source === "backdropClick") {
        setimportContactDialog(false);
        const all = document.getElementsByClassName("contactDialogBack");
        for (let i = 0; i < all.length; i++) {
          all[i].style.visibility = "hidden";
        }
        toast.error(`Please select a contact provider to import contacts`);
        return;
      }
      setimportContactDialog(false);
      toast.error(`Something Went Wrong Fetching Contacts From ${source}`);
    } else {
      setimportContactDialog(false);
      toast.success(`Your contacts were successfully imported from ${source}`);
    }
  };

  const getSearchResult = (text) => {
    let result = [];
    result = contacts.filter(
      (data) => getFulllName(data).toLowerCase().search(text) !== -1
      || getPrimaryEmail(data).toLowerCase().search(text) !== -1
      || getPrimaryPhone(data).toLowerCase().search(text) !== -1
    );
    return result;
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
    const result = getSearchResult(value);
    setFilteredData(result);
  };

  const addManualContact = (event) => {
    const value = event?.target?.value
      ? event?.target?.value.toLowerCase()
      : event.toLowerCase();
    const result = getSearchResult(value);
    if (result.length === 0) {
      if (isValidateEmail(value)) {
        setInputField({ email: value });
      } else if (isValidPhoneNumber(value)) {
        setInputField({ phone: value });
      } else if (isValidFullName(value)) {
        setInputField({
          first_name: value.split(" ")[0] || "",
          last_name: value.split(" ")[1] || ""
        });
      } else if (isOnlyNumber(value)) {
        setInputField({ phone: value });
      }
      setManualContactOpen(true);
    }
  };

  const handlePlusIcon = () => {
    setManualContactOpen(true);
  };

  const handleManualContactClose = () => {
    setManualContactOpen(false);
    setSearchText("");
    setInputField({ ...contactFormFields });
    const result = getSearchResult("");
    setFilteredData(result);
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
                    placeholder="Search Existing & Add New Contacts"
                    onChange={handleSearch}
                    onKeyPress={(event) => {
                      if (event.which === 13) {
                        addManualContact(event);
                      }
                    }}
                    value={searchText}
                  />
                  <div className={styles.send_nft__plus___icon}>
                    <BsPlusLg
                      onClick={() => {
                        searchText === ""
                          ? handlePlusIcon()
                          : addManualContact(searchText);
                      }}
                    />
                  </div>
                </div>
              </div>
              <button
                className={styles.import__button}
                onClick={() => {
                  setimportContactDialog(true);
                }}
              >
                <span className={styles.cloud__icon}>
                  <BsCloudUpload />
                </span>
                Import
              </button>
            </div>
            <div className={styles.data__wrapper}>
              <div>{isLoading && <LoaderIconBlue />}</div>

              {filteredData.map((contact) => (
                <div className={styles.data_row_container} key={nanoid()}>
                  {/* TEXT */}
                  <div className={styles.textContainer}>
                    <h6>{getFulllName(contact)}</h6>
                    <p>
                      {!isEmpty(getPrimaryEmail(contact))
                        ? getPrimaryEmail(contact)
                        : getPrimaryPhone(contact)}
                    </p>
                  </div>
                  {/* ICONS */}
                  <div
                    className={styles.icon}
                    onClick={() => handleToggleContactSelection(contact)}
                  >
                    {findIfChecked(contact.contact_id) ? (
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
            <button
              disabled={firstImport ? false : selectedContacts.length === 0}
              onClick={() => {
                handleBtnClick(selectedContacts);
              }}
              className={styles.next__btn}
            >
              {btnText}
              <span>
                <IoIosArrowForward />
              </span>
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {importContactDialog ? (
        <ImportContactsDialog
          onImport={importContact}
          status={importContactDialog}
          callback={contactImportCallback}
          setStatus={setimportContactDialog}
        />
      ) : null}

      {manualContactOpen && (
        <ManualContactPopup
          show={manualContactOpen}
          title="Create New Contact"
          btnText="Submit"
          inputField={inputField}
          onClose={() => handleManualContactClose}
          onBack={() => handleManualContactClose}
          setIsloading={setIsloading}
          user={user}
          contacts={contacts}
          setManualContactOpen={handleManualContactClose}
        />
      )}
    </>
  );
}
export default ContactPopup;
