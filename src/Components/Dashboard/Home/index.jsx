import React, { memo, useEffect, useState } from "react";
import styles from "./Home.module.css";
import { Container } from "react-bootstrap";
import { IoIosArrowForward } from "react-icons/io";

import create_nft_left from "../../../Assets/Images/create-nft-left.png";
import create_nft_right from "../../../Assets/Images/create-nft-right.png";
import { useDispatch, useSelector } from "react-redux";

import MyNFT from "./MyNft";
import Transactions from "./RecentTransactions";
import HomeHeader from "./HomeHeader";
import { toast } from "react-toastify";
import ImportContactsDialog from "../../ImportContactsDialog/ImportContactsDialog";
import { useNavigate } from "react-router-dom";
import ContactPopup from "../../../common/components/ContactPopup";

const Home = () => {
  const dispatch = useDispatch();
  const [importContactDialog, setImportContactDialog] = useState(false);
  const [showContactListPopup, setShowContactListPopup] = useState(false);
  const [allContacts, setAllContacts] = useState([]);

  const firstImport=localStorage.getItem("firstImport")


  useEffect(() => {
    if (localStorage.getItem("welcome") === "true") {
      HandleDialogOpen();
    }
  }, []);

  let navigate = useNavigate();

  const HandleDialogOpen = () => {
    setImportContactDialog(true);
  };

  const HandleDialogClose = () => {
    setImportContactDialog(false);
  };

  const importContact = (data) => {
    if (data) {
      setAllContacts(data);
      console.log("data", data);
      dispatch({
        type: "getGoogleContactData",
        payload: data,
      });
    }
  };

  const contactImportCallback = (error, source) => {
    setImportContactDialog(false);

    // Handling clicks outside the import dialog box
    if (source == "backdropClick") {
      dispatch({ type: "createnft__open" });
      return;
    }

    if (error) {
      if (source !== "backdropClick") {
        toast.error(`Something Went Wrong Fetching Contacts From ${source}`);
      }
      dispatch({ type: "createnft__open" });
      return;
    } else {
      toast.success(`Your Contacts Were Successfully Imported From ${source}`);
      HandleDialogClose();
      // setShowContactListPopup(true);
      openCreateNFTPopup();
      return;
    }
  };

  const openCreateNFTPopup = () => {
    setShowContactListPopup(false);
    dispatch({ type: "createnft__open" });
  };


  return (
    <>
      <div className={styles.home__main__wrapper}>
        <Container>
          {/* Home Header  */}
          <HomeHeader />

          <ImportContactsDialog
            onImport={importContact}
            status={importContactDialog}
            callback={contactImportCallback}
          />

          <ContactPopup
            data={allContacts}
            displayImportContact={false}
            show={showContactListPopup}
            onClose={() => {
              openCreateNFTPopup();
            }}
            onBack={() => {
              openCreateNFTPopup();
            }}
            title={"Gift an NFT"}
            btnText={firstImport ? "Gift NFT":"Send NFT"}
            handleBtnClick={() => {
              openCreateNFTPopup();
            }}
            firstImport={firstImport}
          />

          {/* Home Create NFT Container */}
          <div className={styles.create__nft__container}>
            <div className={styles.create__nft__content}>
              <div>
                <h1>
                  Start Creating Your <strong>NFTs</strong> Today
                </h1>
                <div className={styles.btn__wrapper}>
                  <button onClick={() => {
                    dispatch({ type: "createnft__open" })
                    localStorage.removeItem("firstImport")}}>
                    Create NFT{" "}
                    <span>
                      <IoIosArrowForward />
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <img
              src={create_nft_left}
              className={styles.create_nft_left}
              alt="Create NFT"
            />
            <img
              src={create_nft_right}
              alt="Create NFT"
              className={styles.create_nft_right}
            />
          </div>

          <MyNFT isLink={true} />
          <Transactions />
        </Container>
      </div>
    </>
  );
};
export default memo(Home);
