import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";
// Routes
import TagManager from "react-gtm-module";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import {
  Route, Routes, useLocation, useNavigate
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Assets/Styles/filepond.css";
import "./Assets/Styles/modal.css";
import Settings from "./Components/Dashboard/Settings";
import GiftAnNftDialog from "./Components/GiftAnNftDialog/GiftAnNft";
import HomePage from "./Components/Home/index";
import SignIn from "./Components/SignIn/SignIn";
import CreateAnAccount from "./Components/SignUp/CreateAnAccount/CreateAnAccount";
import Verification from "./Components/SignUp/Verification";
import "./Components/SignUp/Verification/verificationCode.css";
import DetailRoute from "./layout/DetailRoute";
import PrivateRoute from "./layout/PrivateRoute";
import PublicRoute from "./layout/PublicRoute";
import AllNft from "./Pages/AllNft";
import Dashboard from "./Pages/Dashboard";
import NFTClaim from "./Pages/NftClaim";
// import GiftAnNft from "./Components/GiftAnNft/GiftAnNft";
import NFTDetail from "./Pages/NftDetail";
import Notfound from "./Pages/NotFound";
// Pages
import SignUp from "./Pages/SignUp";
import Transactions from "./Pages/Transactions";
import { API_BASE_URL } from "./Utils/config";

const tagManagerArgs = {
  gtmId: "GTM-TJSWG5R",
};
TagManager.initialize(tagManagerArgs);

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const loading = false;

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
  // For some reason, the <PrivateRoute> was not re-rendering with the
  // updated value from the local state for transactionId so this is a workaround
  const [transactionId, setTransactionId] = useState(urlParams.transaction_id);

  useEffect(() => {
    // The splash/home page will redirect, clearing the transaction_id
    // Make sure to grab the value and hold onto it in local state,
    // so it can be used in the NFT Creation flow
    const { transaction_id } = urlParams;

    if (transaction_id) {
      dispatch({ type: 'nft/set-tracker', payload: urlParams })

      setTransactionId(transaction_id);
    }
  }, [urlParams]);

  useEffect(() => {
    const fetchDetail = async () => {
      axios.interceptors.request.use((config) => {
        // const token = store.getState().session.token;
        config.headers.Authorization = urlParams?.token;

        return config;
      });

      const response = await axios.get(`${API_BASE_URL}/users/details`);
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
  // const nft__detail = useSelector((state) => state.nft__detail); // Single Nft Data

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
        This website uses cookies to enhance the user experience.
        {" "}
      </CookieConsent>

      <ToastContainer hideProgressBar theme="dark" closeButton={false} />

      {/* <Banners /> */}

      <Routes>
        <Route path="/">
          <Route path="home" element={<HomePage />} />
          <Route path="about-us" element={<HomePage pageName="about-us" />} />
          <Route
            path="contact-us"
            element={<HomePage pageName="contact-us" />}
          />
        </Route>

        <Route
          path="/"
          element={<PrivateRoute transactionId={transactionId} />}
        >
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="all-nft" element={<AllNft />} />
        </Route>

        <Route path="/settings" element={<PrivateRoute />}>
          <Route index element={<Settings />} />
        </Route>

        <Route
          path="/signup"
          element={<PublicRoute transactionId={transactionId} />}
        >
          <Route index element={<SignUp />} />
          <Route path="create-account" element={<CreateAnAccount />} />
          <Route path="create-account/:accId" element={<CreateAnAccount />} />
          <Route
            path="gift-nft"
            element={
              <GiftAnNftDialog closebutton sendGiftButton={giftSent} />
            }
          />
        </Route>

        <Route path="/signin" element={<PublicRoute />}>
          {/* <Route path="/signin" element={<SignIn />} /> */}
          <Route index element={<SignIn />} />
          <Route path="authentication/:accountId" element={<Verification />} />
          {/* <Route path="/signin" element={<SignUp />} /> */}
        </Route>

        <Route path="/nft" render element={<DetailRoute />}>
          <Route
            path=":nftId"
            element={
              <NFTDetail />
              // nft__detail.image ? <NFTDetail /> : <Navigate replace to="/" />
            }
          />
          <Route
            path="detail/claim/:nftId"
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
