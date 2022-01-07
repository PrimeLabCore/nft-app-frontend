import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./GiftAnNft.module.css";
import { GoPrimitiveDot } from "react-icons/go";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { FaRegShareSquare } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
import ImportContactsDialog from "../ImportContactsDialog/ImportContactsDialog";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import {
  googleClientId,
  googleClientSecret,
  googleRedirectUrl,
  googleAccess,
  googleRefresh,
} from "../../Utils/config";
import { nanoid } from "nanoid";

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });

export default function GiftAnNft({ closebutton, sendGiftButton, dashboard }) {
  const search = useLocation().search;
  const oauth__code = new URLSearchParams(search).get("code");
  const [token, setToken] = useState({
    access: "",
    refresh: "",
  });
  // const [selected,setSelected] = useState()
  const [contactsData, setContactsData] = useState([]);
  const [filteredContactData, setFilteredContactsData] = useState([]);
  useEffect(() => {
    localStorage.setItem("oauth", oauth__code);
  }, []);
  const getGoogleToken = () => {
    axios
      .post(
        `https://accounts.google.com/o/oauth2/token?grant_type=authorization_code&code=${oauth__code}&client_id=${googleClientId}&client_secret=${googleClientSecret}&redirect_uri=${googleRedirectUrl}`
      )
      .then((response) => {
        if (response.status === 200) {
          Cookies.set(googleAccess, response.data.access_token);
          Cookies.set(googleRefresh, response.data.refresh_token);
          setToken({
            access: response.data.access_token,
            refresh: response.data.refresh_token,
          });
        }
      })
      .catch(() => {
        navigate("/signup");
      });
  };
  const useStyles = makeStyles((theme) => ({
    mainContainer: {
      margin: "30px auto",
      padding: "25px 30px",
      height: `${dashboard ? "80vh" : "100%"}`,
      maxWidth: "600px",
      position: "relative",
      background: "#FFFFFF",
      borderRadius: "20px",
      [theme.breakpoints.down("md")]: {
        // position: 'absolute',
        // top: '5vh',
        // maxWidth: '100%',
        // minHeight: '95vh',
        // marginLeft: '0',
        // right: '0',
        // left: '0',
        // bottom: '0',
        // borderRadius: '0px',
        // borderTopRightRadius: '30px',
        // borderTopLeftRadius: '30px',
      },

      // overflow:'hidden',
      "& h4": {
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "21px",
        textAlign: "center",
        marginBottom: "20px",
      },
    },
    childContainer: {
      display: "flex",
      "& p": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "20.4px",
        letterSpacing: "-0.4896px",
        color: "#2F80ED",
        marginRight: "10px",
        marginLeft: "20px",
        marginTop: "5px",
        cursor: "pointer",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      top: "85px",
      justifyContent: "center",
      color: "#818C99",
      zIndex: 20,
    },
    inputInput: {
      padding: "15px",
      background: "#EBEDF0",
      borderRadius: "12px",
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      maxWidth: "400px",
      zIndex: 1,
    },
  }));
  let navigate = useNavigate();
  const classes = useStyles();
  // const [filteredData,setFilteredData] = useState(dummyContacts)

  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];

    result = contactsData.filter((data) => {
      return data.names[0].displayName.toLowerCase().search(value) !== -1;
    });
    setFilteredContactsData(result);
  };
  const [importContactDialog, setimportContactDialog] = useState(true);
  const dialogStatus = useSelector((state) => state.GiftNFT_Dialog_Box);
  const dispatch = useDispatch();

  // for checked and unchecked items
  const [checkedState, setCheckedState] = useState(
    new Array(filteredContactData.length).fill(true)
  );
  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  // this is for main dialog box
  const handleClose = () => {
    dispatch({ type: "close_dialog_gift_nft" });
    navigate(`/`);
  };

  // this dialog is for import google contacts
  const HandleDialogClose = () => {
    setimportContactDialog(false);
  };

  const contactImportCallback = (error, source) => {
    HandleDialogClose();

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

  const importContact = (data) => {
    if (data) {
      dispatch({
        type: "getGoogleContactData",
        payload: data,
      });
      setimportContactDialog(false);
      setContactsData(data);
      setFilteredContactsData(data);
      setCheckedState(new Array(data.length).fill(true));
    }
    //old code
    /*  axios
      .get(
        `https://content-people.googleapis.com/v1/people/me/connections?personFields=names,photos`,
        {
          headers: {
            Authorization: "Bearer " + token.access, //the token is a variable which holds the token
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setContactsData(response.data.connections);
          setFilteredContactsData(response.data.connections);
          dispatch({
            type: "getGoogleContactData",
            payload: response.data.connections,
          });
          setCheckedState(
            new Array(response.data.connections.length).fill(true)
          );
          setimportContactDialog(false);
          window.dataLayer.push({
            event: "event",
            eventProps: {
              category: "Google Contacts",
              action: "Successfully imported google contacts",
              value: response.data.connections,
            },
          });
        }
      }); */
  };
  const HandleDialogOpen = () => {
    setimportContactDialog(true);
  };

  useEffect(() => {
    getGoogleToken();
    dispatch({ type: "open_dialog_gift_nft" });
  }, []);

  return (
    <>
      <div className={classes.mainContainer}>
        <div>
          <div>
            {closebutton ? (
              <AiFillCloseCircle
                className={styles.cross}
                onClick={handleClose}
              />
            ) : null}
            <h4>Gift an NFT</h4>
          </div>

          {/* SEARCH BAR */}
          <div className={classes.childContainer}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search People"
              fullWidth
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onChange={handleSearch}
              inputProps={{ "aria-label": "search" }}
            />
            <p onClick={HandleDialogOpen}>Import</p>
          </div>

          {/* DATA */}
          <div
          style={{backgroundColor: "red"}}
            className={`${
              dashboard ? styles.dashboardContainer : styles.dataContainer
            }`}
          >
            {filteredContactData.map((value, index) => (
              <div className={styles.data_row_container} key={nanoid()}>
                {/* AVATAR */}
                <div className={styles.avatar}>
                  {/* {value.avatar} */}
                  <img
                    src={value.photos[0].url}
                    alt={value.names[0].displayName}
                  />
                </div>
                {/* TEXT */}
                <div className={styles.textContainer}>
                  <h6>{value.names[0].displayName}</h6>
                  <p>@{value.names[0].givenName}</p>
                </div>
                {/* ICONS */}
                <div
                  className={styles.icon}
                  onClick={() => handleOnChange(index)}
                >
                  {checkedState[index] ? (
                    <BsCheckCircleFill className={styles.checked} />
                  ) : (
                    <GoPrimitiveDot className={styles.unchecked} />
                  )}
                  {/* <input
                                            className={styles.customCheck}
                                            name="checkbox"
                                            type="checkbox"
                                            checked
                                        /> */}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.footer}>
            <button className={styles.primary_button} onClick={sendGiftButton}>
              Send Gift
              {
                <span>
                  <IoIosArrowForward />
                </span>
              }
            </button>
            {!dashboard && (
              <p>
                Share App{" "}
                <span>
                  <FaRegShareSquare />
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* this dialog will open when import button is clicked */}
      {!dashboard && (
        <ImportContactsDialog
          onImport={importContact}
          status={importContactDialog}
          callback={contactImportCallback}
        />
      )}
    </>
  );
}

GiftAnNft.propTypes = {
  sendGiftButton: PropTypes.func.isRequired,
};
