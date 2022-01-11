import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { BsCheckCircleFill } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go";
import { IoIosArrowForward } from "react-icons/io";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import styles from "../../Components/Dashboard/SendNFT/sendNft.module.css";
import { LoaderIconBlue } from "../../Components/Generic/icons";
import ImportContactsDialog from "../../Components/ImportContactsDialog/ImportContactsDialog";
import { API_BASE_URL } from "../../Utils/config";
import { isValidPhoneNumber, isValidateEmail, mapEmailContact, mapPhoneContact } from "../../Utils/utils";

const ContactPopup = ({
  show,
  onClose,
  onBack,
  title,
  btnText,
  handleBtnClick,
  displayImportContact,
  // firstImport
}) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedContacts, setSelectedContacts] = useState([]);

  const { user, contacts } = useSelector((state) => state.authReducer);

  const [isLoading, setIsloading] = useState(false);
  

  const [filteredData, setFilteredData] = useState(contacts);

  const firstImport=localStorage.getItem("firstImport");

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setFilteredData(contacts);
    checkAllContacts(contacts);
  }, [contacts,isLoading]);

  //get contacts
  useEffect(() => {
    if (!show) return;
    setIsloading(true);

    //Ajax Request to create user
    axios
      .get(`${API_BASE_URL}/contacts/list/${user.user_id}`)
      .then((response) => {
        //save user details
        // before saving contacts to the reducer make all the emails unique
        const uniqueEmails = []
        let tempContacts = response.data.data.filter((contactObj) =>
          uniqueEmails.includes(contactObj.email[0].address)
            ? false
            : uniqueEmails.push(contactObj.email[0].address) && true
        );
        setIsloading(true)
        dispatch({ type: "update_contacts", payload: tempContacts });
      })
      .catch((error) => {
        if (error?.response?.data) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => {
        setIsloading(false);
      });
  }, [show]);

  const getPrimaryEmail = (contact) => {
    if (contact.email.length > 0) {
      return contact.email[0].address;
    } else {
      return "";
    }
  };

  const getPrimaryPhone = (contact) => {
    if (contact.phone.length > 0) {
      return contact.phone[0].number;
    } else {
      return "";
    }
  };

  const getFulllName = (contact) => {
    return contact.first_name + " " + contact.last_name;
  };

  const findIfChecked = (contact_id) => {
    return selectedContacts.includes(contact_id);
  };

  const checkAllContacts = (data) => {
    //selecting all the contacts
    setSelectedContacts(data.map((contact) => contact.contact_id));
  };

  const [importContactDialog, setimportContactDialog] =
    useState(displayImportContact);

  const HandleClick = (contact_id) => {
    if (selectedContacts.includes(contact_id)) {
      setSelectedContacts(selectedContacts.filter((cId) => cId !== contact_id));
    } else {
      setSelectedContacts([...selectedContacts, contact_id]);
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

  const getSearchResult = (text) =>{
    let result = [];
    result = contacts.filter((data) => {
      return (
        getFulllName(data).toLowerCase().search(text) !== -1 ||
        getPrimaryEmail(data).toLowerCase().search(text) !== -1 ||
        getPrimaryPhone(data).toLowerCase().search(text) !== -1
      );
    });
    return result;
  }

  const handleSearch = (event, addNew) => {
    let value = event.target.value.toLowerCase();
    setSearchText(value);
    let result = getSearchResult(value);
    setFilteredData(result);
  };
  

  const addManualContact = (event) =>{
    let value = event.target.value.toLowerCase();
    let result = getSearchResult(value);
    if(result.length ===0){
      if(isValidateEmail(value)){
        storeManualContact(mapEmailContact(value));
      }else if(isValidPhoneNumber(value)){
        storeManualContact(mapPhoneContact(value));
      }
    }
  }


  const storeManualContact = (newContact) =>{
    newContact = {
      ...newContact,
      owner_id: user.user_id,
      app_id: "NFT Maker App",
    }
    setIsloading(true);
    axios
      .post(`${API_BASE_URL}/contacts`, newContact)
      .then((response) => {
        setIsloading(false)
        setSearchText("")
        dispatch({ type: "update_contacts", payload: [...contacts, {
          ...newContact, 
          contact_id: response.data.data.contact_id
        }]
      });
        toast.success(response.data.message);
      })
      .catch((error) => {
        if (error?.response?.data) {
          toast.error(error.response.data.message);
        }
      })
  }

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
                    placeholder="Search Current Contacts"
                    onChange={handleSearch}
                    onKeyPress={(event)=>{
                      if (event.which === 13 ) {
                        addManualContact(event)
                      }
                    }}
                    value={searchText}
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
              <div>{isLoading && <LoaderIconBlue />}</div>

              {filteredData.map((contact, index) => (
                <div className={styles.data_row_container} key={nanoid()}>
                  {/* TEXT */}
                  <div className={styles.textContainer}>
                    <h6>{getFulllName(contact)}</h6>
                    <p>{getPrimaryEmail(contact)}</p>
                  </div>
                  {/* ICONS */}
                  <div
                    className={styles.icon}
                    onClick={() => HandleClick(contact.contact_id)}
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
              disabled={firstImport ? false : selectedContacts.length === 0 ? true : false
              }
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
        />
      ) : null}
    </>
  );
};
export default ContactPopup;
