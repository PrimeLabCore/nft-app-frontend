import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
// import Cookies from 'js-cookie'
// import {cookieAuth} from "../Utils/config"
import CreateNftPopup from "../Components/Dashboard/CreateNFT/createNft";
import SendNft from "../Components/Dashboard/SendNFT/sendNft";
import Menu from "../Components/Dashboard/Widgets/Menu";
import axios from "axios";

const PrivateLayout = (props) => {
  const { children, transactionId } = props;

  let dispatch = useDispatch();
  const tooltip_show = useSelector((state) => state.menu__tooltip); //Defined in reducer function
  const createnft__popup = useSelector((state) => state.createnft__popup); //Defined in reducer function
  const sendnft__popup = useSelector((state) => state.sendnft__popup); //Defined in reducer function
  const GiftNFT_Dialog_Box = useSelector((state) => state.GiftNFT_Dialog_Box); //Defined in reducer function

  const closeMenu = () => {
    if (tooltip_show) {
      dispatch({ type: "handleTooltipClick__close" });
    }
  };
  return (
    <>
      <CreateNftPopup transactionId={transactionId} />
      <SendNft />
      <div onClick={closeMenu}>
        <main
          style={{
            opacity: `${
              tooltip_show ||
              createnft__popup ||
              sendnft__popup ||
              GiftNFT_Dialog_Box
                ? "0.5"
                : "1"
            }`,
            pointerEvents: `${tooltip_show ? "none" : "all"}`,
          }}
        >
          {children}
        </main>
        <Menu />
      </div>
    </>
  );
};

const PrivateRoute = (props) => {
  let dispatch = useDispatch();

  // @ToDo
  const user = JSON.parse(localStorage.getItem("user"));
  let isAuthenticated = user ? true : false;

  if (isAuthenticated) {
    //save user details in redux state
    dispatch({ type: "login_Successfully", payload: user.user_info });

    //adding JWT Authorization token to axios requests
    axios.interceptors.request.use(function (config) {
      config.headers.Authorization = `Bearer ${user.jwt_access_token}`;
      return config;
    });
  }

  return (
    <>
      <PrivateLayout {...props}>
        {isAuthenticated ? <Outlet /> : <Navigate replace to="/home" />}
      </PrivateLayout>
    </>
  );
};
export default PrivateRoute;
