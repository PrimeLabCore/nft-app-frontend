import React, { useState } from "react";
import styles from "./settings.module.css";
import SettingsHeader from "./SettingsHeader";
import { IoIosArrowForward, IoIosLogOut } from "react-icons/io";
import { AiOutlineCheck } from "react-icons/ai";
import user_icon from "../../../Assets/Images/user-icon.png";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TextFieldComponent from "../../../Assets/FrequentlUsedComponents/TextFieldComponent";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import CustomPhoneInput from "../../../common/components/CustomPhoneInput/CustomPhoneInput";
import { API_BASE_URL } from "../../../Utils/config";
import AppLoader from "../../Generic/AppLoader";
import axios from "axios";

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [connectedModal, setConnectedModal] = useState(false);
  const [changeInfo, setChangeInfo] = useState(false);
  const [details, setDetails] = useState("");
  const [checked, setChecked] = useState(0);
  const [enable2fa, setEnable2fa] = useState(false);
  const [info, setinfo] = useState("");
  const { user } = useSelector((state) => state.authReducer);
  const [isLoading, setIsloading] = useState(false);

  const [inputFields, setinputFields] = useState({
    email: user.email,
    phone: user.phone,
    full_name: user.full_name,
  });

  const closeChangeInfo = () => {
    setChangeInfo(false);
  };
  const openChangeInfo = (infovalue) => {
    setChangeInfo(true);
    setDetails(infovalue);
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validatePhone = (phone) => {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
      phone
    );
  };

  const getPersonalInfo = () => {
    //Ajax Request to update user
    axios
      .get(`${API_BASE_URL}/users/${user?.user_id}`)
      .then((response) => {
        //update user details in localstorage and redux state
        let temp = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem(
          "user",
          JSON.stringify({
            jwt_access_token: temp?.jwt_access_token,
            jwt_id_token: temp?.jwt_id_token,
            jwt_refresh_token: temp?.jwt_refresh_token,
            user_info: response?.data?.data,
          })
        );
        dispatch({
          type: "login_Successfully",
          payload: response?.data?.data,
        });
      })
      .catch((error) => {
        if (error.response.data) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => {
        // setIsloading(false);
      });
  };

  const savePersonalInfo = () => {
    setChangeInfo(false);

    switch (details) {
      case "full_name":
        if (!inputFields.full_name) {
          toast.error("Name can't be empty");
          return;
        }
        break;

      case "email":
        if (!validateEmail(inputFields.email)) {
          toast.error("Email is not valid");
          return;
        }
        break;

      case "phone":
        if (!validatePhone(inputFields.phone)) {
          toast.error("Phone number is not valid");
          return;
        }
        break;

      default:
        break;
    }

    setIsloading(true);

    let payload = {};

    payload[`${details}`] = inputFields[`${details}`];

    //Ajax Request to update user
    axios
      .put(`${API_BASE_URL}/users/${user?.user_id}`, payload)
      .then((response) => {
        toast.success("Settings Saved");
        getPersonalInfo();
        //update user details in localstorage and redux state
        let temp = JSON.parse(localStorage.getItem("user"));
        temp.user_info = response.data;

        // localStorage.getItem("user");
        // localStorage.setItem("user", JSON.stringify(temp));
        // dispatch({ type: "login_Successfully", payload: response.data });
      })
      .catch((error) => {
        if (error.response.data) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  const closeConnectedModal = () => {
    setConnectedModal(false);
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

  const SignOut = () => {
    dispatch({ type: "auth/logout" });
    localStorage.removeItem("user");
    localStorage.removeItem("welcome")
    localStorage.removeItem("firstImport")
    navigate("/");
  };

  const HandleInputChange = (field) => (e) => {
    setinputFields({ ...inputFields, [field]: e.target.value });
  };

  // HandleFocus for input
  const HandleFocus = (ClickedInput) => {
    setinfo(ClickedInput);
  };
  return (
    <>
      {isLoading && <AppLoader />}
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
                      {user?.wallet_id}
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
                        onClick={() => openChangeInfo("full_name")}
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
                        onClick={() => openChangeInfo("email")}
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
                        onClick={() => openChangeInfo("phone")}
                      >
                        <div className={styles.personal__settings}>
                          <p>Phone number</p>
                          <h6>{user?.phone}</h6>
                        </div>
                        <button>
                          <IoIosArrowForward />
                        </button>
                      </div>

                      <div
                        className={styles.settings__acc__content}
                        onClick={() => SignOut()}
                      >
                        <div className={styles.personal__settings}>
                          <p>Sign Out</p>
                        </div>
                        <button>
                          <IoIosLogOut />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              {/* Acc#03 */}
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
                <span>{user?.wallet_id}</span>
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
                  <h2>Change {details.replace(/_/g, " ")}</h2>
                </div>
              </Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.input__body__wrapper}>
              {details !== "phone" ? (
                <TextFieldComponent
                  variant="outlined"
                  placeholder={`${
                    details === "full_name"
                      ? "Name"
                      : details === "email"
                      ? "Email"
                      : ""
                  }`}
                  type={"email"}
                  InputValue={inputFields[`${details}`]}
                  HandleInputChange={HandleInputChange(details)}
                  onFocus={() => HandleFocus("name")}
                />
              ) : (
                <>
                  <CustomPhoneInput
                    value={inputFields.phone}
                    onFocus={() => HandleFocus("name")}
                    placeholder={"Phone Number"}
                    onChange={HandleInputChange("phone")}
                  />
                </>
              )}
            </div>
            <div className={styles.btn__wrapper}>
              <button onClick={savePersonalInfo} className={styles.next__btn}>
                Submit
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};
export default Settings;
