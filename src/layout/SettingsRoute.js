import React from "react";
import { Outlet, Navigate } from "react-router-dom";

function Layout({ children }) {
  return (
    <main>{children}</main>
  );
}
function LayoutRoute() {
  // let navigate = useNavigate()
  // let isAuth = Cookies.get(cookieAuth) || false // => 'value'
  const isAuth = true // => 'value'

  return (
    <Layout>
      {isAuth ? <Outlet /> : <Navigate replace to="/signup" />}
    </Layout>
  );
}
export default LayoutRoute;
