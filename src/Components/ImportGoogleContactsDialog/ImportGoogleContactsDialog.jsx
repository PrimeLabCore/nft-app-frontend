import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
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
  return (
    <div onClick={onImport}>
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
        <div className={classes.mainContainer}>
          <AiFillGoogleCircle className={classes.googleicon} />
          <p> Import Google Contacts</p>
          <IoIosArrowForward className={classes.googleicon} />
        </div>
      </Dialog>
    </div>
  );
};

export default React.memo(ImportGoogleContactsDialog);
