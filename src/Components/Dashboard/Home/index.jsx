import React, { memo, useEffect, useState } from "react";
import styles from "./Home.module.css";
import { Container } from "react-bootstrap";
import { IoIosArrowForward } from "react-icons/io";

import create_nft_left from "../../../Assets/Images/create-nft-left.png";
import create_nft_right from "../../../Assets/Images/create-nft-right.png";

import MyNFT from "./MyNft";
import Transactions from "./RecentTransactions";
import HomeHeader from "./HomeHeader";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ImportContactsDialog from "../../ImportContactsDialog/ImportContactsDialog";

const Home = () => {
  const dispatch = useDispatch();
  const [importContactDialog, setimportContactDialog] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("welcome") === "true") {
      localStorage.removeItem("welcome");
      HandleDialogOpen();
    }
  }, []);

  const HandleDialogOpen = () => {
    setimportContactDialog(true);
  };

  const HandleDialogClose = () => {
    setimportContactDialog(false);
  };

  const importContact = (data) => {
    if (data) {
      dispatch({
        type: "getGoogleContactData",
        payload: data,
      });
      setimportContactDialog(false);
    }
  };

  const contactImportCallback = (error, source) => {
    HandleDialogClose();

    if (error) {
      toast.error(`Something Went Wrong Fetching Contacts From ${source}`);
      return;
    } else {
      toast.success(`Your Contacts Were Successfully Imported From ${source}`);
      return;
    }
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

          {/* Home Create NFT Container */}
          <div className={styles.create__nft__container}>
            <div className={styles.create__nft__content}>
              <div>
                <h1>
                  Start Creating Your <strong>NFTs</strong> Today
                </h1>
                <div className={styles.btn__wrapper}>
                  <button onClick={() => dispatch({ type: "createnft__open" })}>
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
