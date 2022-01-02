import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-multi-carousel/lib/styles.css";
import "./Assets/Styles/modal.css";
import "./Assets/Styles/filepond.css";
import "./Components/SignUp/Verification/verificationCode.css";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CookieConsent from "react-cookie-consent";
import { useSelector, useDispatch } from "react-redux";

//Routes
import DetailRoute from "./layout/DetailRoute";
import PublicRoute from "./layout/PublicRoute";
import PrivateRoute from "./layout/PrivateRoute";
import SettingsRoute from "./layout/SettingsRoute";
//Pages
import SignUp from "./Pages/SignUp";
import Verification from "./Components/SignUp/Verification";
import Dashboard from "./Pages/Dashboard";
import Notfound from "./Pages/NotFound";
import Transactions from "./Pages/Transactions";
import AllNft from "./Pages/AllNft";
import CreateAnAccount from "./Components/SignUp/CreateAnAccount/CreateAnAccount";
// import GiftAnNft from "./Components/GiftAnNft/GiftAnNft";
import NFTDetail from "./Pages/NftDetail";
import NFTClaim from "./Pages/NftClaim";
import GiftAnNftDialog from "./Components/GiftAnNftDialog/GiftAnNft";
import SignIn from "./Components/SignIn/SignIn";
import Settings from "./Components/Dashboard/Settings";
import HomePage from './Components/Home/index'
import TagManager from "react-gtm-module";
import axios from "axios";
import { API_BASE_URL } from "./Utils/config";

import { PersistGate } from 'redux-persist/integration/react'

const tagManagerArgs = {
  gtmId: "GTM-TJSWG5R",
};
TagManager.initialize(tagManagerArgs);

function App() {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { search } = useLocation();

  const parseParams = (querystring) => {
    // parse query string
    const params = new URLSearchParams(querystring);

    const obj = {};

    // iterate over all keys
    for (const key of params.keys()) {
      if (params.getAll(key).length > 1) {
        obj[key] = params.getAll(key);
      } else {
        obj[key] = params.get(key);
      }
    }

    return obj;
  };

  const urlParams = parseParams(search);

  // TODO: This seems suspicious to define the local state property so low...
  // However, it ensures the local state property picks up the URL param
  // For some reason, the <PrivateRoute> was not re-rendering with the updated value from the local state for transactionId so this is a workaround
  const [transactionId, setTransactionId] = useState(urlParams.transaction_id);

  useEffect(() => {
    // The splash/home page will redirect, clearing the transaction_id
    // Make sure to grab the value and hold onto it in local state, so it can be used in the NFT Creation flow
    const { transaction_id } = urlParams;

    if (transaction_id) { 
      setTransactionId(transaction_id);
    }
  }, [urlParams]);

  useEffect(() => {
    const fetchDetail = async () => {
      axios.interceptors.request.use(function (config) {
        // const token = store.getState().session.token;
        config.headers.Authorization = urlParams?.token;

        return config;
      });

      const response = await axios.get(`${API_BASE_URL}/api/v1/users/details`);
      const { success, data } = response.data;
      if (success) {
        dispatch({
          type: "login_Successfully",
          payload: { ...data, token: urlParams?.token },
        });
        navigate("/");
      } else {
        navigate("/signup");
      }
    };
    if (urlParams?.token) {
      fetchDetail();
    }

    // let data = JSON.parse(localStorage.getItem("user"));
    // console.log(`data`, data);
    // if (data) {
    //   axios.interceptors.request.use(function (config) {
    //     // const token = store.getState().session.token;
    //     config.headers.Authorization = data.token;

    //     return config;
    //   });
    //   dispatch({
    //     type: "login_Successfully",
    //     payload: data,
    //   });
    //   setLoading(false);
    //   // navigate("/");
    // } else setLoading(false);
  }, []);

  useEffect(() => {}, []);

  window.dataLayer.push({
    event: "pageview",
  });

  const giftSent = () => {
    dispatch({ type: "createnft__open" });
    navigate("/");
  };
  const nft__detail = useSelector((state) => state.nft__detail); //Single Nft Data

  if (loading) {
    return "Loading...";
  }

  return (
    <>
      {/* COOKIE CONSENT */}
      <CookieConsent
        location="bottom"
        buttonText="Got it"
        cookieName="myAwesomeCookieName2"
        style={{ background: "#2F80ED", color: "white", fontFamily: "Inter" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={150}
      >
        This website uses cookies to enhance the user experience.{" "}
      </CookieConsent>

      <ToastContainer />
      <Routes>

        <Route path="/" >
          <Route path="home" element={<HomePage />} />
          <Route path="about-us" element={<HomePage pageName="about-us" />} />
          <Route path="contact-us" element={<HomePage pageName="contact-us" />} />
        </Route>


        <Route path="/" element={<PrivateRoute transactionId={transactionId} />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="all-nft" element={<AllNft />} />
        </Route>

        <Route path="/settings" element={<SettingsRoute />}>
          <Route index element={<Settings />} />
        </Route>

        <Route path="/signup" element={<PublicRoute transactionId={transactionId} />}>
          <Route index element={<SignUp />} />
          <Route path="verification" element={<Verification />} />
          <Route path="create-account" element={<CreateAnAccount />} />
          <Route path="create-account/:accId" element={<CreateAnAccount />} />
          <Route
            path="gift-nft"
            element={
              <GiftAnNftDialog closebutton={true} sendGiftButton={giftSent} />
            }
          />
        </Route>

        <Route path="/signin" element={<PublicRoute />}>
          {/* <Route path="/signin" element={<SignIn />} /> */}
          <Route index element={<SignIn />} />
          {/* <Route path="/signin" element={<SignUp />} /> */}
        </Route>

        <Route path="/nft" render element={<DetailRoute />}>
          <Route
            path=":nftid"
            element={
              <NFTDetail />
              // nft__detail.image ? <NFTDetail /> : <Navigate replace to="/" />
            }
          />
          <Route
            path="detail/claim"
            element={
              <NFTClaim />
              // nft__detail.image ? <NFTClaim /> : <Navigate replace to="/" />
            }
          />
          <Route
            path="detail/claim/:invoiceId"
            element={
              <NFTClaim />
              // nft__detail.image ? <NFTClaim /> : <Navigate replace to="/" />
            }
            // render={props => <NFTClaim {...props} />}
          />
          {/* Checking if nft detail image exists if not the detail page will redirect */}
        </Route>
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;
