import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
// import { IoLogoApple, IoLogoMicrosoft } from "react-icons/io5";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { IconButton } from '@mui/material';
import { blur, removeBlur } from '../../Utils/utils';
import { API_BASE_URL } from "../../Utils/config";

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    minHeight: "80px",
    background: "#fff",
    borderRadius: "10px",
    border: "none",
    display: "flex",
    // justifyContent: "space-evenly",
    alignItems: "center",
    padding: "20px",
    marginBottom: "10px",
    "& p": {
      marginTop: "12px",
      fontStyle: "normal",
      fontWeight: "500",
      fontSize: "18px",
      lineHeight: "19px",
      color: "#0072CE",
      marginLeft: "30px",
      [theme.breakpoints.down("md")]: {
        fontSize: "15px",
      },
    },
    "&:hover": {
      background: "#f1f1f1",
    },
  },
  googleicon: {
    color: "#0072CE",
    fontSize: "30px",
  },
  appleicon: {
    color: "#000",
    fontSize: "35px",
  },
  microsofticon: {
    color: "#dc3e15",
    fontSize: "30px",
  },
  note: {
    cursor: "default"
  }
}));

const ImportContactsDialog = ({
  status, callback, onImport, setStatus, setImportContactDialog, setShowSignoutModal
}) => {
  const classes = useStyles();
  const { user, contacts } = useSelector((state) => state.authReducer);

  const handleDialogueClose = () => {
    if (setImportContactDialog) setImportContactDialog(false);
    if (setStatus) setStatus(false);
    if (setShowSignoutModal) setShowSignoutModal(true);
  }

  const PostContactToBackend = async (contacts, source) => {
    // add owner infor to contacts

    const newcontacts = contacts.map((c) => ({
      ...c,
      owner_id: user?.user_id,
      app_id: "NFT Maker App",
      dob: "",
      source,
    }));

    // Ajax Request to create user
    axios
      .post(`${API_BASE_URL}/contacts/import`, newcontacts)
      .then(() => {
        // disable contact import dialog on login/signup
        localStorage.removeItem("welcome");
        removeBlur();
      })
      .catch((error) => {
        if (error.response.data) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => { });
  };

  const LoadCloudSponge = (callback) => {
    const existingScript = document.getElementById("cloudSponge");
    if (existingScript) document.getElementById("cloudSponge").remove();

    const script = document.createElement("script");

    if (
      window.location.hostname === "localhost"
      || window.location.hostname === "127.0.0.1"
    ) {
      // for localhost testing
      script.src = "https://api.cloudsponge.com/widget/localhost-only.js";
    } else {
      // for production
      script.src = "https://api.cloudsponge.com/widget/l8UL7ckxBgjk0bLDQv5gzA.js";
    }

    script.id = "cloudSponge";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };

    if (existingScript && callback) callback();
  };

  useEffect(() => {
    LoadCloudSponge(() => {
      if (window.cloudsponge) {
        window.cloudsponge.init({
          skipContactsDisplay: true,
          skipSourceMenu: true,
          browserContactCacheMin: false,
          rootNodeSelector: "#cloudsponge-widget-container",
          beforeDisplayContacts(contacts, source) {
            const source_title = source === "office365"
              ? "Microsoft"
              : source === "icloud"
                ? "Apple"
                : "Google";

            const all = document.getElementsByClassName("initial__modal");
            for (let i = 0; i < all.length; i++) {
              all[i].style.display = "block";
            }

            // post contact to backend to persist in database
            PostContactToBackend(contacts, source_title);

            // call callback functions
            onImport(contacts);
            if (setStatus) setStatus(false);

            return false;
          },
          beforeLaunch() {
            const all = document.getElementsByClassName("contactDialogBack");
            for (let i = 0; i < all.length; i++) {
              all[i].style.visibility = "hidden";
            }
            const all1 = document.getElementsByClassName("initial__modal");
            for (let i = 0; i < all1.length; i++) {
              all1[i].style.display = "none";
            }
          },
          beforeClosing() {
            const all = document.getElementsByClassName("contactDialogBack");
            for (let i = 0; i < all.length; i++) {
              all[i].style.visibility = "inherit";
            }
            const all1 = document.getElementsByClassName("initial__modal");
            for (let i = 0; i < all1.length; i++) {
              all1[i].style.display = "block";
            }
          },
          afterImport(source, success) {
            localStorage.removeItem("contactImport")
            const source_title = source === "office365"
              ? "Microsoft 365"
              : source === "icloud"
                ? "Apple Contacts (iCloud)"
                : "Google";
            callback(!success, source_title);
          },
          afterClosing() {
            const all = document.getElementsByClassName("contactDialogBack");
            for (let i = 0; i < all.length; i++) {
              all[i].style.visibility = "hidden";
            }
          }
        });
      }
    });
  }, [status]);

  useEffect(() => {
    if (localStorage.getItem("welcome") === "true") {
      blur("10px");
    }
  }, []);
  return (
    <div>
      <div id="cloudsponge-widget-container" />
      <Dialog
        open={status}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        maxWidth={"xs"}
        PaperProps={{
          style: { borderRadius: 20, cursor: "pointer", padding: 20 },
        }}
        className="contactDialogBack"
        onClose={contacts.length > 0 ? callback : null}
      >
        <div style={{ paddingBottom: "1rem" }}>
          <IconButton
            aria-label="close"
            onClick={() => {
              handleDialogueClose();
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CancelRoundedIcon />
          </IconButton>
        </div>

        <Typography variant="h6" className={`text-center mb-3 ${classes.note}`}>
          Import your contacts to generate & share your free NFT
        </Typography>

        <button
          className={`${classes.mainContainer} cloudsponge-launch`}
          data-cloudsponge-source="gmail"
        >
          <FcGoogle className={classes.googleicon} />
          <p> Sign in with Google</p>
        </button>

        {/* <button
          className={`${classes.mainContainer} cloudsponge-launch`}
          data-cloudsponge-source="icloud"
        >
          <IoLogoApple className={classes.appleicon} />
          <p> Connect Apple Contacts (iCloud)</p>
        </button>

        <button
          className={`${classes.mainContainer} cloudsponge-launch`}
          data-cloudsponge-source="office365"
        >
          <IoLogoMicrosoft className={classes.microsofticon} />
          <p> Connect Microsoft 365 Contacts</p>
        </button> */}
      </Dialog>
    </div>
  );
};

export default React.memo(ImportContactsDialog);
