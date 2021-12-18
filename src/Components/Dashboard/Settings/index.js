import React, { useState } from "react";
import styles from "./settings.module.css";
import SettingsHeader from "./SettingsHeader";
import { IoIosArrowForward } from "react-icons/io";
import { AiOutlineCheck } from "react-icons/ai";
import user_icon from "../../../Assets/Images/user-icon.png";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TextFieldComponent from "../../../Assets/FrequentlUsedComponents/TextFieldComponent";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Settings = () => {
  const navigate = useNavigate();
  const [connectedModal, setConnectedModal] = useState(false);
  const [changeInfo, setChangeInfo] = useState(false);
  const [details, setDetails] = useState("");
  const [checked, setChecked] = useState(0);
  const [enable2fa, setEnable2fa] = useState(false);
  const [info, setinfo] = useState("");
  const { user } = useSelector((state) => state.authReducer);
  const closeChangeInfo = () => {
    setChangeInfo(false);
  };
  const openChangeInfo = (infovalue) => {
    setChangeInfo(true);
    setDetails(infovalue);
  };
  const savePersonalInfo = () => {
    setChangeInfo(false);
    toast.success("Settings Saved");
  };
  const closeConnectedModal = () => {
    setConnectedModal(false);
  };
  const Authentication = (isEnable) => {
    if (isEnable) {
      toast.success("2FA Enabled");
      window.dataLayer.push({
        event: "event",
        eventProps: {
          category: "Settings",
          action: "2FA Enabled",
          label: "Settings",
          value: "Settings",
        },
      });
    } else {
      toast.success("2FA Disabled");
    }
  };
  const openConnectedModal = () => {
    setConnectedModal(true);
  };
  const addNewWallet = () => {
    navigate("/signup/create-account");
  };
  const check = (i) => {
    if (checked !== i) {
      setChecked(i);
      setConnectedModal(false);
    }
  };
  // HandleFocus for input
  const HandleFocus = (ClickedInput) => {
    setinfo(ClickedInput);
  };
  return (
    <>
      <SettingsHeader />

      <div className={styles.settings__wrapper}>
        <Container>
          <div className={styles.settings__acc__wrapper}>
            <Row>
              {/* Acc#01 */}
              <Col md={{ span: 8, offset: 2 }}>
                <div className={styles.settings__acc__inner}>
                  <h5>Connected Wallet</h5>
                  <div
                    className={styles.settings__acc}
                    onClick={openConnectedModal}
                  >
                    <div className={styles.settings__name__info}>
                      <img src={user_icon} alt="User Name" />
                      {/* <h6>{user?.email?.split("@")[0] + ".near"}</h6> */}
                      {user?.account_id}
                    </div>
                    <button>
                      <IoIosArrowForward />
                    </button>
                  </div>
                </div>
              </Col>
              {/* Acc#02 */}
              <Col md={{ span: 8, offset: 2 }}>
                <div className={styles.settings__acc__inner}>
                  <h5>Profile Settings</h5>
                  <div className={styles.settings__acc}>
                    <div style={{ width: "100%" }}>
                      <div
                        className={styles.settings__acc__content}
                        onClick={() => openChangeInfo("Name")}
                      >
                        <div className={styles.personal__settings}>
                          <p>Name</p>
                          {/* <h6>{user.email.split("@")[0]}</h6> */}
                          <h6>{user?.full_name}</h6>
                        </div>
                        <button>
                          <IoIosArrowForward />
                        </button>
                      </div>
                      <div
                        className={styles.settings__acc__content}
                        onClick={() => openChangeInfo("Email")}
                      >
                        <div className={styles.personal__settings}>
                          <p>Email Address</p>
                          <h6>{user?.email}</h6>
                        </div>
                        <button>
                          <IoIosArrowForward />
                        </button>
                      </div>
                      <div
                        className={styles.settings__acc__content}
                        onClick={() => openChangeInfo("Number")}
                      >
                        <div className={styles.personal__settings}>
                          <p>Phone number</p>
                          <h6>{user?.phone_no}</h6>
                        </div>
                        <button>
                          <IoIosArrowForward />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              {/* Acc#03 */}

              {
                /* Hidden until 2FA actually works 
                  <Col md={{ span: 8, offset: 2 }}>
                    <div
                      className={styles.settings__acc__inner}
                      onClick={() => Authentication(true)}
                    >
                      <h5>Security</h5>
                      <div className={styles.settings__acc}>
                        <div className={styles.settings__name__info}>
                          <h6>Add 2FA authentication</h6>
                        </div>
                        <button>
                          <IoIosArrowForward />
                        </button>
                      </div>
                    </div>
                  </Col>
                */
              }
              
            </Row>
          </div>
        </Container>

        <Modal
          className={`${styles.connection__modal} initial__modal`}
          show={connectedModal}
          onHide={closeConnectedModal}
          backdrop="static"
          centered
          keyboard={false}
        >
          <Modal.Header
            className={`${styles.modal__header__wrapper} modal__settings__wrapper`}
            closeButton
          >
            <div className="modal__title__wrapper ">
              <Modal.Title>
                <div className={styles.modal__header}>
                  <h2>Select connected wallet</h2>
                </div>
              </Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.modal__body__wrapper}>
              <div className={styles.name__wrapper} onClick={() => check(0)}>
                {/* <h6>{user?.email?.split("@")[0] + ".near"}</h6> */}
                <h6>{user?.account_id}</h6>
                {checked === 0 && (
                  <div className={styles.checked}>
                    <AiOutlineCheck />
                  </div>
                )}
              </div>
              {/* <div className={styles.name__wrapper} onClick={() => check(1)}>
                <h6>demo.near</h6>
                {checked === 1 && (
                  <div className={styles.checked}>
                    <AiOutlineCheck />
                  </div>
                )}
              </div> */}
            </div>
            <div className={styles.btn__wrapper}>
              <button onClick={addNewWallet} className={styles.next__btn}>
                Add New Wallet
              </button>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          className={`${styles.connection__modal} initial__modal`}
          show={changeInfo}
          onHide={closeChangeInfo}
          backdrop="static"
          centered
          keyboard={false}
        >
          <Modal.Header
            className={`${styles.modal__header__wrapper} modal__settings__wrapper`}
            closeButton
          >
            <div className="modal__title__wrapper">
              <Modal.Title>
                <div className={styles.modal__header}>
                  <h2>Change {details}</h2>
                </div>
              </Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.input__body__wrapper}>
              <TextFieldComponent
                variant="outlined"
                placeholder={`${
                  details === "Name"
                    ? "Name"
                    : details === "Email"
                    ? "Email"
                    : details === "Number"
                    ? "Phone Number"
                    : ""
                }`}
                type="text"
                HandleFocus={() => HandleFocus("name")}
              />
            </div>
            <div className={styles.btn__wrapper}>
              <button onClick={savePersonalInfo} className={styles.next__btn}>
                Add New Wallet
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};
export default Settings;
