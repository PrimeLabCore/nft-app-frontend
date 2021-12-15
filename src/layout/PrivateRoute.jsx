import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Menu from "../Components/Dashboard/Widgets/Menu";
import {useSelector,useDispatch} from "react-redux"
// import Cookies from 'js-cookie'
// import {cookieAuth} from "../Utils/config"
import CreateNftPopup from "../Components/Dashboard/CreateNFT/createNft";
import SendNft from "../Components/Dashboard/SendNFT/sendNft";

const Layout = ({ children }) => {
  let dispatch = useDispatch()
  const tooltip_show = useSelector((state)=> state.menu__tooltip) //Defined in reducer function
  const createnft__popup = useSelector((state)=> state.createnft__popup) //Defined in reducer function
  const sendnft__popup = useSelector((state)=> state.sendnft__popup) //Defined in reducer function
  const GiftNFT_Dialog_Box = useSelector((state)=> state.GiftNFT_Dialog_Box) //Defined in reducer function

  const closeMenu = () => {
    if(tooltip_show){
      dispatch({type:"handleTooltipClick__close"})
    }
    
  }
  return (
    <>
    <CreateNftPopup/>
    <SendNft/>
    <div onClick={closeMenu}>
      <main style={{opacity:`${tooltip_show || createnft__popup || sendnft__popup || GiftNFT_Dialog_Box ? "0.5" : "1"}`,pointerEvents:`${tooltip_show ? "none" : "all"}`}}>{children}</main>
      <Menu/>
    </div>
    
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
