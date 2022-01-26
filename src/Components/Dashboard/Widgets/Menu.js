import React, { useRef } from "react";
import { Overlay, Tooltip } from "react-bootstrap";
import { AiFillPlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Analytics from "../../../Utils/Analytics";
import create__icon from "../../../Assets/Images/icons/create.png";
import home__icon from "../../../Assets/Images/icons/home.png";
import send__icon from "../../../Assets/Images/icons/send.png";
import transaction__icon from "../../../Assets/Images/icons/transaction.png";
import styles from "./menu.module.scss";
import "./tooltip.scss";
import { actionAppStateSetDynamic } from "../../../Store/AppState/actions";

function Menu() {
  const dispatch = useDispatch();
  const menuTooltipIsOpen = useSelector((state) => state.appState.menuTooltipIsOpen);

  const target = useRef(null);

  const createNftModal = () => {
    dispatch(actionAppStateSetDynamic("createNFTPopupIsOpen", true));
    dispatch(actionAppStateSetDynamic("menuTooltipIsOpen", false));
    Analytics.pushEvent("event", {
      category: "Menu",
      action: "Create NFT Modal Opened",
      label: "Menu",
      value: "Menu",
    });
  };
  const sendNftModal = () => {
    dispatch(actionAppStateSetDynamic("sendNFTPopupIsOpen", true));
    dispatch(actionAppStateSetDynamic("menuTooltipIsOpen", false));
    Analytics.pushEvent("event", {
      category: "Menu",
      action: "Send NFT Modal Opened",
      label: "Menu",
      value: "Menu",
    });
  };
  return (
    <div className={styles.menu__wrapper}>
      <div className={styles.menu__button}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <img src={home__icon} alt="Home" />
        </NavLink>
        <button
          ref={target}
          className={`${menuTooltipIsOpen ? styles.active : ""}`}
          onClick={() => dispatch(actionAppStateSetDynamic("menuTooltipIsOpen", true))}
        >
          <AiFillPlusCircle />
        </button>
        <NavLink
          to="/transactions"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          <img src={transaction__icon} alt="transaction" />
        </NavLink>
      </div>

      <Overlay target={target.current} show={menuTooltipIsOpen} placement="top">
        {(props) => (
          <Tooltip
            id="tooltip-top"
            className={`${styles.menu__nft__overlay}`}
            {...props}
          >
            <button onClick={createNftModal}>
              <span>
                <img src={create__icon} alt="Create NFT" />
              </span>
              {" "}
              Create NFT
            </button>
            <button onClick={sendNftModal}>
              <span>
                <img src={send__icon} alt="Send NFT" />
              </span>
              {" "}
              Send NFT
            </button>
          </Tooltip>
        )}
      </Overlay>
    </div>
  );
}
export default Menu;
