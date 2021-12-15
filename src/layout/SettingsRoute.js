import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const Layout = ({ children }) => {

  return (
    <>
      <main>{children}</main>
    </>
  );
};
const LayoutRoute = () => {
  // let navigate = useNavigate()
  // let isAuth = Cookies.get(cookieAuth) || false // => 'value'
  let isAuth = true // => 'value'


  return (
    <>
      <Layout>
        {isAuth ? <Outlet /> : <Navigate replace to="/signup" />}
      </Layout>
    </>
  );
};
export default LayoutRoute;
