import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import { nanoid } from "nanoid";
import React, { useEffect, useState, useRef } from "react";
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
import { isValidPhoneNumber, isValidateEmail } from "../../Utils/utils";
import ManualContactPopup from "./ManualContactPopup";
import InfiniteScroll from "react-infinite-scroll-component";

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
  const dispatch = useDispatch();

  const [selectedContacts, setSelectedContacts] = useState([]);

  const { user, contacts } = useSelector((state) => state.authReducer);

  const [isLoading, setIsloading] = useState(false);
  const [manualContactOpen, setManualContactOpen] = useState(false);

  const [inputField, setInputField] = useState({ email: "", phone: "" });
  const [filteredData, setFilteredData] = useState(contacts);

  const firstImport = localStorage.getItem("firstImport");

  const [searchText, setSearchText] = useState("");

  const [items, setItems] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setFilteredData(contacts);
    checkAllContacts(contacts);
    setShortContactsList(contacts);
  }, [contacts, isLoading]);

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
        const {
          data: { data: contacts = [] },
        } = response;
        const uniqueEmails = [];
        console.log(`Got ${contacts.length} contacts from server`);
        const uniqueContacts = contacts.filter((contactObj) => {
          if (contactObj.email && contactObj.email.length) {
            let emailExists = false;
            for (let i = 0; i < contactObj.email.length; i++) {
              const emailObj = { ...contactObj.email[i] };
              if (
                emailObj &&
                emailObj.address &&
                uniqueEmails.indexOf(emailObj.address) !== -1
              ) {
                emailExists = true;
                break;
              } else {
                uniqueEmails.push(emailObj.address);
              }
            }
            if (emailExists) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
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
  }, [show]);

  const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
  };

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
    return !!selectedContacts.find(
      (contact) => contact.contact_id === contact_id
    );
  };

  const HandleClick = (contact_id) => {
    if (selectedContacts.includes(contact_id)) {
      setSelectedContacts(selectedContacts.filter((cId) => cId !== contact_id));
    } else {
      setSelectedContacts([...selectedContacts, contact_id]);
    }
  };

  const checkAllContacts = (data) => {
    //selecting all the contacts
    setSelectedContacts(data);
  };

  const [importContactDialog, setimportContactDialog] =
    useState(displayImportContact);

  const fetchMoreData = () => {
    if (!isLoading && filteredData.length && !shortContactsList.length) {
      setHasMore(false);
      return;
    }
    
    const newData = [...shortContactsList]
    newData.slice(0.10)
    const newItems = newData.splice(10)
    setItems(items.concat(newData))
    setShortContactsList(newItems)
  };

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
      const copyData = [...data]
      checkAllContacts(data);
      setimportContactDialog(false);
      setFilteredData(data);
      const getFirst = copyData.slice(0, 10)
      setItems(getFirst);
      setHasMore(copyData.length > 10 ? true : false)
      const remaining = data.splice(10)
      setShortContactsList(remaining)
    }
  };

  const contactImportCallback = (error, source) => {
    setimportContactDialog(false);

    getContactList();

    if (error) {
      if (source === "backdropClick") {
        toast.error(`Please select a contact provider to import contacts`);
        return;
      }
      toast.error(`Something Went Wrong Fetching Contacts From ${source}`);
      return;
    } else {
      toast.success(`Your contacts were successfully imported from ${source}`);
      return;
    }
  };

  const getSearchResult = (text) => {
    let result = [];
    result = contacts.filter((data) => {
      return (
        getFulllName(data).toLowerCase().search(text) !== -1 ||
        getPrimaryEmail(data).toLowerCase().search(text) !== -1 ||
        getPrimaryPhone(data).toLowerCase().search(text) !== -1
      );
    });
    return result;
  };

  const handleSearch = (event, addNew) => {
    let value = event.target.value.toLowerCase();
    setSearchText(value);
    let result = getSearchResult(value);
    setFilteredData(result);
    const copyData = [...result]
    const getFirst = copyData.slice(0, 10)
    setItems(getFirst);
    setHasMore(copyData.length > 10 ? true : false)
    const remaining = result.splice(10)
    setShortContactsList(remaining)
  };

  const addManualContact = (event) => {
    let value = event.target.value.toLowerCase();
    let result = getSearchResult(value);
    
    if (result.length === 0) {
      if (isValidateEmail(value)) {
        setManualContactOpen(true);
        setInputField({ email: value });
        setSearchText("");
      } else if (isValidPhoneNumber(value)) {
        setManualContactOpen(true);
        setInputField({ phone: value });
        setSearchText("");
      }
    }
  };

  // Fucntions for Infinite Scrolling
  const [currentSet, setCurrentSet] = useState(0);
  const numberOfBatchElements = 10;
  const loadMoreOn = 10;
  const [shortContactsList, setShortContactsList] = useState([]);
  const getContactList = () => {
    let temporaryConatcts = [];
    if ((currentSet + 1) * numberOfBatchElements < filteredData.length) {
      temporaryConatcts = filteredData.slice(
        currentSet * numberOfBatchElements,
        (currentSet + 1) * numberOfBatchElements
      )
      setCurrentSet(currentSet + 1);
    } else {
      if (!runJustOnce) {
        temporaryConatcts = filteredData.slice(
          currentSet * numberOfBatchElements
        )
        setRunJustOnce(!runJustOnce);
      }
    }
    setShortContactsList([...shortContactsList, ...temporaryConatcts]);
  }

  const [runJustOnce, setRunJustOnce] = useState(true);
  useEffect(() => {
    if (filteredData.length > 1 && runJustOnce)
      setRunJustOnce(false);
    setIsloading(false);
    getContactList();
  }, [filteredData]);

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
                    onKeyPress={(event) => {
                      if (event.which === 13) {
                        addManualContact(event);
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

              {/* {filteredData.map((contact, index) => ( */}
                <InfiniteScroll
                  dataLength={items.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={<h4>Loading...</h4>}
                  height={400}
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>Yay! You have seen it all</b>
                    </p>
                  }
                >
                  {items.map((contact, index) => (
                    <div
                      className={styles.data_row_container}
                      id="last_contact_element"
                      key={nanoid()}
                    >
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
                </InfiniteScroll>
            </div>
          </div>
          <div className={styles.multiple__btn__wrapper}>
            <button
              disabled={
                firstImport
                  ? false
                  : selectedContacts.length === 0
                  ? true
                  : false
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

      {manualContactOpen && (
        <ManualContactPopup
          show={manualContactOpen}
          title={"Create New Contact"}
          btnText="Submit"
          inputField={inputField}
          onClose={() => setManualContactOpen(false)}
          onBack={() => setManualContactOpen(false)}
          setIsloading={setIsloading}
          user={user}
          contacts={contacts}
          setManualContactOpen={setManualContactOpen}
        />
      )}
    </>
  );
};
export default ContactPopup;
