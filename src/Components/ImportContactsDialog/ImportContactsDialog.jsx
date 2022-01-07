import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple, IoLogoMicrosoft } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { API_BASE_URL } from "../../../Utils/config";
import axios from "axios";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    minHeight: "80px",
    background: "#fff",
    borderRadius: "10px",
    border: "none",
    display: "flex",
    //justifyContent: "space-evenly",
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
}));

const ImportContactsDialog = ({ status, callback, onImport }) => {
  const classes = useStyles();
  const { user } = useSelector((state) => state.authReducer);

  const PostContactToBackend = (contacts) => {
    //validate account id

    //signup body

    //Ajax Request to create user
    axios
      .post(`${API_BASE_URL}/user/create`, user)
      .then((response) => {
        //save user details
        //disable contact import dialog on signup
        localStorage.removeItem("welcome");
      })
      .catch((error) => {
        if (error.response.data) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => {});
  };

  useEffect(() => {
    LoadCloudSponge(() => {
      if (window.cloudsponge) {
        window.cloudsponge.init({
          skipContactsDisplay: true,
          skipSourceMenu: true,
          rootNodeSelector: "#cloudsponge-widget-container",
          beforeDisplayContacts: function (contacts, source, owner) {
            //post contact to backend to persist in database

            //send this normalized contact back to UI
            onImport(contactsNormalized);

            var all = document.getElementsByClassName("initial__modal");
            for (var i = 0; i < all.length; i++) {
              all[i].style.display = "block";
            }

            return false;
          },
          beforeLaunch: function () {
            var all = document.getElementsByClassName("initial__modal");
            for (var i = 0; i < all.length; i++) {
              all[i].style.display = "none";
            }

            document.getElementById("contactDialogBack").style.visibility =
              "hidden";
          },
          beforeClosing: function () {
            var all = document.getElementsByClassName("initial__modal");
            for (var i = 0; i < all.length; i++) {
              all[i].style.display = "block";
            }

            document.getElementById("contactDialogBack").style.visibility =
              "inherit";
          },
          afterImport: function (source, success) {
            let source_title =
              source === "office365"
                ? "Microsoft 365"
                : source === "icloud"
                ? "Apple Contacts (iCloud)"
                : "Google";
            callback(!success, source_title);
          },
        });
      }
    });
  }, [status]);

  const LoadCloudSponge = (callback) => {
    const existingScript = document.getElementById("cloudSponge");
    if (existingScript) document.getElementById("cloudSponge").remove();

    const script = document.createElement("script");

    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      //for localhost testing
      script.src = "https://api.cloudsponge.com/widget/localhost-only.js";
    } else {
      //for production
      script.src =
        "https://api.cloudsponge.com/widget/l8UL7ckxBgjk0bLDQv5gzA.js";
    }

    script.id = "cloudSponge";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };

    if (existingScript && callback) callback();
  };

  return (
    <div>
      <div id="cloudsponge-widget-container"></div>
      <Dialog
        open={status}
        TransitionComponent={Transition}
        keepMounted
        fullWidth={true}
        maxWidth={"xs"}
        PaperProps={{
          style: { borderRadius: 20, cursor: "pointer", padding: 20 },
        }}
        onClose={callback}
        id="contactDialogBack"
      >
        <button
          className={classes.mainContainer + " " + "cloudsponge-launch"}
          data-cloudsponge-source="gmail"
        >
          <FcGoogle className={classes.googleicon} />
          <p> Connect Gooogle Contacts</p>
        </button>

        <button
          className={classes.mainContainer + " " + "cloudsponge-launch"}
          data-cloudsponge-source="icloud"
        >
          <IoLogoApple className={classes.appleicon} />
          <p> Connect Apple Contacts (iCloud)</p>
        </button>

        <button
          className={classes.mainContainer + " " + "cloudsponge-launch"}
          data-cloudsponge-source="office365"
        >
          <IoLogoMicrosoft className={classes.microsofticon} />
          <p> Connect Microsoft 365 Contacts</p>
        </button>
      </Dialog>
    </div>
  );
};

export default React.memo(ImportContactsDialog);
