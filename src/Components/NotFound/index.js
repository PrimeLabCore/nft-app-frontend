import React from "react"
import styles from "./notfound.module.css"
import {useNavigate} from "react-router-dom"
import {IoIosArrowBack} from "react-icons/io"

import create_nft_left from "../../Assets/Images/create-nft-left.png"
import create_nft_right from "../../Assets/Images/create-nft-right.png"
import {Container} from "react-bootstrap"
const NotFound = () =>{
    let navigate = useNavigate();
    return(
        <>
        <Container>
            <div className={styles.notfound__wrapper}>
                <div className={styles.notfound__content}>
                    <div>
                        <h1>Looks like you are lost</h1>
                        <div className={styles.btn__wrapper}>
                            <button onClick={() => navigate(-1)}>Go Back? <span><IoIosArrowBack/></span></button>
                        </div>
                    </div>
                </div>
                <img src={create_nft_left} className={styles.create_nft_left} alt="Create NFT"/>
                <img src={create_nft_right} alt="Create NFT" className={styles.create_nft_right}/>
            </div>
        </Container>
        
        </>
    )
}
export default NotFound