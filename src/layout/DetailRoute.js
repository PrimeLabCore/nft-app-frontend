import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import detail__1 from "../Assets/Images/nft__detail__1.png";
import detail__2 from "../Assets/Images/nft__detail__2.png";
import styles from "./detailRoute.module.css";

const Layout = ({ children }) => {
  const nft__detail = useSelector((state) => state.nft__detail);
  const [claim, setClaim] = useState(true);
  const [windowstate, setWindow] = useState(window.innerWidth < 767);
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        const ismobile = window.innerWidth < 767;
        if (ismobile !== windowstate) setWindow(ismobile);
      },
      false
    );
  }, [windowstate]);

  useEffect(() => {
    if (window.location.pathname.startsWith("/nft/detail/claim")) {
      setClaim(true);
    }
  }, []);

  const urlArray = nft__detail?.image?.split(".");
  const fileType = urlArray?.length ? urlArray[urlArray?.length - 1] : "";
  return (
    <>
      <div className={`${styles.background} ${claim ? styles.lightbg : ""}`}>
        {!windowstate && (
          <>
            <img src={detail__1} alt="Detail 1" className={styles.detail__1} />
            <img src={detail__2} alt="Detail 2" className={styles.detail__2} />
          </>
        )}

        {/* NFT Image */}
        <div className={styles.nft__image__outer__wrapper}>
          <div className={styles.nft__image__wrapper} style={{ width: "60%" }}>
            {fileType.toLowerCase() === "mp4" ? (
              <video
                style={{ width: "100%", borderRadius: "8px" }}
                src={nft__detail?.image}
              />
            ) : fileType.toLowerCase() === "mp3" ? (
              <div style={{ width: "100%", padding: "0 2px" }}>
                <audio style={{ width: "inherit", marginTop: "60px" }} controls>
                  <source src={nft__detail?.image} />
                </audio>
              </div>
            ) : (
              <img src={nft__detail?.image} alt={nft__detail?.name} />
            )}
          </div>
        </div>

        <main>{children}</main>
      </div>
    </>
  );
};
const LayoutRoute = () => {
  // let navigate = useNavigate()
  // let isAuth = Cookies.get(cookieAuth) || false // => 'value'
  let isAuth = true; // => 'value'

  const nft__detail = useSelector((state) => state.nft__detail);

  return (
    <>
      <Layout>{isAuth ? <Outlet /> : <Navigate replace to="/signup" />}</Layout>
    </>
  );
};
export default LayoutRoute;
