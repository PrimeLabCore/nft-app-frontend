import axios from "axios";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import TextFieldComponent from "../../Assets/FrequentlUsedComponents/TextFieldComponent";
import styles from "../../Components/Dashboard/SendNFT/sendNft.module.css";
import { API_BASE_URL } from "../../Utils/config";
import {
  isValidateEmail, isValidName, isValidPhoneNumber, mapContact
} from "../../Utils/utils";
import CustomPhoneInput from "./CustomPhoneInput/CustomPhoneInput";

const contactFormFields = {
  email: "",
  phone: "",
  first_name: "",
  last_name: "",
}
function ManualContactPopup({
  show,
  title,
  btnText,
  inputField,
  setIsloading,
  user,
  contacts,
  setManualContactOpen
}) {
  const dispatch = useDispatch()
  const [inputFields, setinputFields] = useState({ ...contactFormFields });

  useEffect(() => {
    const updatedContactForm = { ...contactFormFields };
    if (inputField?.email) {
      updatedContactForm.email = inputField.email;
    }
    if (inputField?.phone) {
      updatedContactForm.phone = inputField.phone;
    }
    if (inputField?.first_name) {
      updatedContactForm.first_name = inputField.first_name;
    }
    if (inputField?.last_name) {
      updatedContactForm.last_name = inputField.last_name;
    }
    setinputFields(updatedContactForm)
  }, [inputField])

  const HandleInputChange = (field) => (e) => {
    setinputFields({ ...inputFields, [field]: e.target.value });
  };

  const storeManualContact = (newContact) => {
    newContact = {
      ...newContact,
      owner_id: user?.user_id,
      app_id: "NFT Maker App",
    }
    setIsloading(true);
    axios
      .post(`${API_BASE_URL}/contacts`, newContact)
      .then((response) => {
        setIsloading(false)
        dispatch({
          type: "update_contacts",
          payload: [...contacts, {
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

  const validateAndSubmit = () => {
    if (!isEmpty(inputFields.first_name) && !isValidName(inputFields.first_name)) {
      toast.error("Please enter a valid first name");
    } else if (!isEmpty(inputFields.last_name) && !isValidName(inputFields.last_name)) {
      toast.error("Please enter a valid last name");
    } else if (isEmpty(inputFields.email) && isEmpty(inputFields.phone)) {
      toast.error(`Please enter either email or phone number`)
    } else if (!isEmpty(inputFields.email) && !isValidateEmail(inputFields.email)) {
      toast.error(`Please enter a valid email`)
    } else if (!isEmpty(inputFields.phone) && !isValidPhoneNumber(inputFields.phone)) {
      toast.error(`Please enter a valid phone number`)
    } else {
      storeManualContact(mapContact({ ...inputFields }));
      setManualContactOpen(false)
      setinputFields({
        ...contactFormFields
      })
    }
  }

  const onCloseContactPopup = () => {
    setinputFields({
      ...contactFormFields
    });
    setManualContactOpen()
  }

  return (
    <Modal
      className={`${styles.manual_contact__wrapper} send__nft__mobile__modal initial__modal`}
      show={show}
      onHide={onCloseContactPopup}
      backdrop="static"
      size="lg"
      centered
      keyboard={false}
    >
      <Modal.Header className={styles.modal__header__wrapper} closeButton>
        <div className="modal__multiple__wrapper">
          <button type="button" onClick={onCloseContactPopup} className="back__btn">
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
        <>
          <TextFieldComponent
            InputProps={{ maxLength: 46 }}
            autoFocus
            variant="outlined"
            placeholder="First Name"
            type="name"
            InputValue={inputFields.first_name}
            HandleInputChange={HandleInputChange("first_name")}
            HandelKeyPress={(event) => {
              if (event.which === 13) {
                validateAndSubmit();
              }
            }}
          />
          <TextFieldComponent
            InputProps={{ maxLength: 25 }}
            variant="outlined"
            placeholder="Last Name"
            type="name"
            InputValue={inputFields.last_name}
            HandleInputChange={HandleInputChange("last_name")}
            HandelKeyPress={(event) => {
              if (event.which === 13) {
                validateAndSubmit();
              }
            }}
          />
          <TextFieldComponent
            InputProps={{ maxLength: 64 }}
            variant="outlined"
            placeholder="Email"
            type="email"
            InputValue={inputFields.email}
            HandleInputChange={HandleInputChange("email")}
            HandelKeyPress={(event) => {
              if (event.which === 13) {
                validateAndSubmit();
              }
            }}
          />
          <CustomPhoneInput
            value={inputFields.phone}
            placeholder="Phone Number"
            onChange={HandleInputChange("phone")}
            HandelKeyPress={(event) => {
              if (event.which === 13) {
                validateAndSubmit();
              }
            }}
          />
        </>
        <div className={styles.multiple__btn__wrapper}>
          <button
            type="button"
            onClick={() => {
              validateAndSubmit();
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
  )
}

export default ManualContactPopup