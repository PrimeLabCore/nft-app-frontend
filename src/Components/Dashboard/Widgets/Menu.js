import React, { useRef } from "react";
import styles from "./menu.module.css";
import "./tooltip.css";
import { NavLink } from "react-router-dom";
import { Overlay, Tooltip } from "react-bootstrap";

// import {BiHomeAlt} from "react-icons/bi"
import { AiFillPlusCircle } from "react-icons/ai";
// import {BsArrowUpRight} from "react-icons/bs"
// import {IoIosAdd} from "react-icons/io"
import { useSelector, useDispatch } from "react-redux";
import home__icon from "../../../Assets/Images/icons/home.png";
import transaction__icon from "../../../Assets/Images/icons/transaction.png";
import create__icon from "../../../Assets/Images/icons/create.png";
import send__icon from "../../../Assets/Images/icons/send.png";

const Menu = () => {
  const dispatch = useDispatch();
  const tooltip_show = useSelector((state) => state.menu__tooltip); //Defined in reducer function

  const target = useRef(null);

  const createNftModal = () => {
    dispatch({ type: "createnft__open" });
    dispatch({ type: "handleTooltipClick__close" });
    window.dataLayer.push({
      event: "event",
      eventProps: {
        category: "Menu",
        action: "Create NFT Modal Opened",
        label: "Menu",
        value: "Menu",
      },
    });
  };
  const sendNftModal = () => {
    dispatch({ type: "sendnft__open" });
    dispatch({ type: "handleTooltipClick__close" });
    window.dataLayer.push({
      event: "event",
      eventProps: {
        category: "Menu",
        action: "Send NFT Modal Opened",
        label: "Menu",
        value: "Menu",
      },
    });
  };
  return (
    <>
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
            className={`${tooltip_show ? styles.active : ""}`}
            onClick={() => dispatch({ type: "toggle" })}
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

        <Overlay target={target.current} show={tooltip_show} placement="top">
          {(props) => (
            <Tooltip
              id="tooltip-top"
              className={`${styles.menu__nft__overlay}`}
              {...props}
            >
              <button onClick={createNftModal}>
                <span>
                  <img src={create__icon} alt="Create NFT" />
                </span>{" "}
                Create NFT
              </button>
              <button onClick={sendNftModal}>
                <span>
                  <img src={send__icon} alt="Send NFT" />
                </span>{" "}
                Send NFT
              </button>
            </Tooltip>
          )}
        </Overlay>
      </div>
    </>
  );
};
export default Menu;
