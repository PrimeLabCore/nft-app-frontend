import React from "react"
import {Container} from "react-bootstrap"

import MyNft from "../Components/Dashboard/Home/MyNft"
import HomeHeader from "../Components/Dashboard/Home/HomeHeader"
const AllNft = () => {
    return(
        <>
        <Container>
            <HomeHeader/>
            <MyNft isLink={false}/>
        </Container>
        </>
    )
}
export default AllNft;