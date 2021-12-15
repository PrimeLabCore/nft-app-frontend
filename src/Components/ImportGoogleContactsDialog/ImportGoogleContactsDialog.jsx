import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import GoogleContacts from "react-google-contacts";
import { AiFillGoogleCircle } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    minHeight: "80px",
    background: "#FFFFFF",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    "& p": {
      marginTop: "12px",
      fontStyle: "normal",
      fontWeight: "500",
      fontSize: "20px",
      lineHeight: "19px",
      color: "#0072CE",
      [theme.breakpoints.down("md")]: {
        fontSize: "15px",
      },
    },
  },
  googleicon: {
    color: "#0072CE",
    fontSize: "35px",
  },
}));

const ImportGoogleContactsDialog = ({ status, callback, onImport }) => {
  const classes = useStyles();
  const responseCallback = (response) => {
    console.log(response);
    onImport(response);
  };

  const errorCallback = (error) => {
    console.log(error);
    onImport(null, error);
  };
  return (
    <div>
      <Dialog
        open={status}
        TransitionComponent={Transition}
        keepMounted
        fullWidth={true}
        maxWidth={"xs"}
        PaperProps={{
          style: { borderRadius: 20, cursor: "pointer" },
        }}
        onClose={callback}
      >
        <GoogleContacts
          clientId="186127410269-2ctc6ce3u984u025dmgnnq8etitupnu6.apps.googleusercontent.com"
          onSuccess={responseCallback}
          onFailure={errorCallback}
          render={(renderProps) => (
            <button onClick={renderProps.onClick}>
              <div className={classes.mainContainer}>
                <AiFillGoogleCircle className={classes.googleicon} />
                <p> Import Gooogle Contacts</p>
                <IoIosArrowForward className={classes.googleicon} />
              </div>
            </button>
          )}
        />
      </Dialog>
    </div>
  );
};

export default React.memo(ImportGoogleContactsDialog);
