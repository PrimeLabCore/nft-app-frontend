import React from "react";
import { Link, Outlet } from "react-router-dom";
import styles from "./PublicRoute.module.css";
import Img from "../Assets/Images/bg-img.png";
import Logo from "../Assets/Images/prime-lab-logo.png";

const Layout = ({ children }) => (
  <div className={styles.background}>
    <img src={Img} alt="Vector Graphics" className={styles.vector} />
    <Link to="/">
      <img src={Logo} alt="Brand Logo" className={styles.logo} />
    </Link>
    {children}
  </div>
);
const LayoutRoute = (props) => (
  <Layout {...props}>
    <Outlet />
  </Layout>
);
export default LayoutRoute;
