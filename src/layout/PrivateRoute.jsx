import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import CreateNftPopup from "../Components/Dashboard/CreateNFT/createNft";
import SendNft from "../Components/Dashboard/SendNFT/sendNft";
import Menu from "../Components/Dashboard/Widgets/Menu";
import { actionSuccessfulLogin } from "../Store/Auth/actions";
import { actionAppStateSetDynamic } from "../Store/AppState/actions";

const PrivateLayout = (props) => {
  const { children, transactionId } = props;

  const dispatch = useDispatch();
  const menuTooltipIsOpen = useSelector(state => state.appState.menuTooltipIsOpen);
  // Defined in reducer function
  const createNFTPopupIsOpen = useSelector(state => state.appState.createNFTPopupIsOpen);

  // Defined in reducer function
  const sendNFTPopupIsOpen = useSelector(state => state.appState.sendNFTPopupIsOpen);

  // Defined in reducer function
  const giftNFTPopupIsOpen = useSelector(state => state.appState.giftNFTPopupIsOpen);

  const closeMenu = () => {
    if (menuTooltipIsOpen) {
      dispatch(actionAppStateSetDynamic("menuTooltipIsOpen", false));
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
              menuTooltipIsOpen
              || createNFTPopupIsOpen
              || sendNFTPopupIsOpen
              || giftNFTPopupIsOpen
                ? "0.5"
                : "1"
            }`,
            pointerEvents: `${menuTooltipIsOpen ? "none" : "all"}`,
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
  const dispatch = useDispatch();

  // @ToDo
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!user;

  if (isAuthenticated) {
    // save user details in redux state
    dispatch(actionSuccessfulLogin(user.user_info));

    // adding JWT Authorization token to axios requests
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${user.jwt_access_token}`;
      return config;
    });
  }

  return (
    <PrivateLayout {...props}>
      {isAuthenticated ? <Outlet /> : <Navigate replace to="/home" />}
    </PrivateLayout>
  );
};
export default PrivateRoute;
