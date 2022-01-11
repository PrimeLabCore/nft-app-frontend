import { Modal } from "react-bootstrap";
import styles from "../../Components/Dashboard/SendNFT/sendNft.module.css";
import React, { useEffect, useState } from 'react'
import CustomPhoneInput from "./CustomPhoneInput/CustomPhoneInput";
import { IoIosArrowForward } from "react-icons/io";
import TextFieldComponent from "../../Assets/FrequentlUsedComponents/TextFieldComponent";
import { mapContact } from "../../Utils/utils";
import { API_BASE_URL } from "../../Utils/config";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

const ManualContactPopup=({show,
    onClose,
    onBack,
    title,
    btnText,
    inputField,
    setIsloading,
    user,
    contacts,
    setManualContactOpen
    })=>{
        const dispatch=useDispatch()
        const [info, setinfo] = useState("");
        const [inputFields, setinputFields] = useState({
            email: "",
            phone: "",
            first_name: "",
            last_name: "",
          });



          const HandleInputChange = (field) => (e) => {
            setinputFields({ ...inputFields, [field]: e.target.value });
          };
        
          // HandleFocus for input
          const HandleFocus = (ClickedInput) => {
            setinfo(ClickedInput);
          };

          const handleBtnClick=()=>{
            storeManualContact(mapContact(inputFields));
            setManualContactOpen(false)
          }

          
        //   console.log("new contaact",contacts)

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
        // setSearchText("")
        dispatch({ type: "update_contacts", payload: [...contacts, {
          ...newContact, 
          contact_id: response.data.data.contact_id
        }]
      });
      console.log("data",[...contacts, {
        ...newContact, 
        contact_id: response.data.data.contact_id
      }])
        toast.success(response.data.message);
      })
      .catch((error) => {
        if (error?.response?.data) {
          toast.error(error.response.data.message);
        }
      })
  }

          useEffect(()=>{
              if(inputField?.email){
                  setinputFields({email:inputField?.email})
              }else if(inputField?.phone){
                setinputFields({phone:inputField?.phone})
              }
          },[inputField])

        console.log("value",inputFields)

    return(
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
        <>
        <TextFieldComponent
                  variant="outlined"
                  placeholder={`First Name`}
                  type={"name"}
                  InputValue={inputFields.first_name}
                  HandleInputChange={HandleInputChange("first_name")}
                  onFocus={() => HandleFocus("first_name")}
                  HandelKeyPress={(event)=>{
                    if (event.which === 13 ) {
                        handleBtnClick()
                    }}}
                />
                 <TextFieldComponent
                  variant="outlined"
                  placeholder={`Last Name`}
                  type={"name"}
                  InputValue={inputFields.last_name}
                  HandleInputChange={HandleInputChange("last_name")}
                  onFocus={() => HandleFocus("last_name")}
                  HandelKeyPress={(event)=>{
                    if (event.which === 13 ) {
                        handleBtnClick()
                    }}}
                />
                <TextFieldComponent
                  variant="outlined"
                  placeholder={`Email`}
                  type={"email"}
                  InputValue={inputFields.email}
                  HandleInputChange={HandleInputChange("email")}
                  onFocus={() => HandleFocus("email")}
                  HandelKeyPress={(event)=>{
                    if (event.which === 13 ) {
                        handleBtnClick()
                    }}}
                />
                  <CustomPhoneInput
                    value={inputFields.phone}
                    onFocus={() => HandleFocus("name")}
                    placeholder={"Phone Number"}
                    onChange={HandleInputChange("phone")}
                    HandelKeyPress={(event)=>{
                        if (event.which === 13 ) {
                            handleBtnClick()
                        }}}
                  />
                </>
                <div className={styles.multiple__btn__wrapper}>
            <button
              
              onClick={() => {
                  handleBtnClick();
                
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
        </>
    )
}

export default ManualContactPopup