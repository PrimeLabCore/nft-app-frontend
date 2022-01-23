import React, { useEffect, useState } from "react";
import { IoIosArrowForward, IoIosLogOut } from "react-icons/io";
import { AiOutlineCheck } from "react-icons/ai";
import {
  Container, Row, Col, Modal
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import styles from "./settings.module.css";
import SettingsHeader from "./SettingsHeader";
import user_icon from "../../../Assets/Images/user-icon.png";
import TextFieldComponent from "../../../Assets/FrequentlUsedComponents/TextFieldComponent";
import CustomPhoneInput from "../../../common/components/CustomPhoneInput/CustomPhoneInput";
import { API_BASE_URL } from "../../../Utils/config";
import AppLoader from "../../Generic/AppLoader";
import { isValidFullName } from "../../../Utils/utils";

const labels = {
  email: "Email Address",
  phone: "Phone Number",
  full_name: "Full Name",
}

function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [connectedModal, setConnectedModal] = useState(false);
  const [changeInfo, setChangeInfo] = useState(false);
  const [details, setDetails] = useState("");
  const [checked, setChecked] = useState(0);
  // const [enable2fa, setEnable2fa] = useState(false);
  const [info, setinfo] = useState("");
  const { user } = useSelector((state) => state.authReducer);
  const [isLoading, setIsloading] = useState(false);

  const [inputFields, setinputFields] = useState({
    email: user.email,
    phone: user.phone,
    full_name: user.full_name,
  });

  useEffect(() => 0, [info]);

  const closeChangeInfo = () => {
    setChangeInfo(false);
  };
  const openChangeInfo = (infovalue) => {
    setChangeInfo(true);
    setDetails(infovalue);
  };

  const validateEmail = (email) => String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  const validatePhone = (phone) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
    phone
  );

  const getPersonalInfo = () => {
    // Ajax Request to update user
    axios
      .get(`${API_BASE_URL}/users/${user?.user_id}`)
      .then((response) => {
        // update user details in localstorage and redux state
        const temp = JSON.parse(localStorage.getItem("user"));
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

  const validatePersonalInfo = () => {
    let isValidForm = true;
    switch (details) {
      case "full_name":
        if (!inputFields.full_name) {
          toast.error("Name can't be empty");
          isValidForm = false;
        } else if (inputFields.full_name && !isValidFullName(inputFields.full_name)) {
          toast.error("Invalid Name");
          isValidForm = false;
        } else if (inputFields.full_name && inputFields.full_name.length > 70) {
          toast.error("Name must less than 70 characters");
          isValidForm = false;
        }
        break;
      case "email":
        if (!validateEmail(inputFields.email)) {
          toast.error("Email is not valid");
          isValidForm = false;
        }
        if (inputFields.email && inputFields.email.length > 64) {
          toast.error("Name must less than 64 characters");
          isValidForm = false;
        }
        break;

      case "phone":
        if (!validatePhone(inputFields.phone)) {
          toast.error("Phone number is not valid");
          isValidForm = false;
        }
        break;

      default:
        break;
    }
    return isValidForm;
  };

  const savePersonalInfo = () => {
    if (!validatePersonalInfo()) {
      return;
    }
    setChangeInfo(false);
    setIsloading(true);
    const payload = {};
    payload[`${details}`] = inputFields[`${details}`];
    // Ajax Request to update user

    axios
      .put(`${API_BASE_URL}/users/${user?.user_id}`, payload)
      .then((response) => {
        toast.success("Settings Saved");
        getPersonalInfo();
        // update user details in localstorage and redux state
        const temp = JSON.parse(localStorage.getItem("user"));
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
  }

  const closeConnectedModal = () => {
    setConnectedModal(false);
  };

  const openConnectedModal = () => {
    setConnectedModal(true);
  };
  const addNewWallet = () => {
    navigate("/signup/create-account", {
      state: { user }
    });
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

  const HandleInputChange = (field) => e => {
    if (details === "email" && e.target.value.length > 64) {
      return false;
    }
    if (details === "full_name" && e.target.value.length > 70) {
      return false;
    }
    if (details === "phone" && e.target.value.length > 20) {
      return false;
    }
    setinputFields({ ...inputFields, [field]: e.target.value });
    return 0;
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
                          <h6 title={user?.full_name}>{user?.full_name}</h6>
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
                          <h6 title={user?.email}>{user?.email}</h6>
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
                          <h6 title={user?.phone}>{user?.phone}</h6>
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
                  <h2>
                    Change
                    {" "}
                    {labels[details]}
                  </h2>
                </div>
              </Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.input__body__wrapper}>
              {details !== "phone" ? (
                <TextFieldComponent
                  variant="outlined"
                  placeholder={labels[details]}
                  type={details === "email" ? "email" : "text"}
                  InputValue={inputFields[`${details}`]}
                  HandleInputChange={HandleInputChange(details)}
                  onFocus={() => HandleFocus("name")}
                />
              ) : (
                <CustomPhoneInput
                  value={inputFields.phone}
                  onFocus={() => HandleFocus("name")}
                  placeholder="Phone Number"
                  onChange={HandleInputChange("phone")}
                />
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
}
export default Settings;
