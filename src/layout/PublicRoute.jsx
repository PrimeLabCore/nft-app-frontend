import React from "react";
import { Link, Outlet } from "react-router-dom";
import styles from "./PublicRoute.module.css";
import Img from "../Assets/Images/bg-img.png";
import Logo from "../Assets/Images/logo.png";

const Layout = ({ children }) => {
  return (
    <div className={styles.background}>
      <Link to="/">
        <img src={Logo} alt="Brand Logo" className={styles.logo} />
      </Link>
      <img src={Img} alt="Vector Graphics" className={styles.vector} />
      {children}
    </div>
  );
};
const LayoutRoute = (props) => {
  return (
    <>
      <Layout {...props}>
        <Outlet />
      </Layout>
    </>
  );
};
export default LayoutRoute;
