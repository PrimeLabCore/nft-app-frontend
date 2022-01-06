import React, { Fragment, memo, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import { AiOutlinePlus } from "react-icons/ai";
import { Row, Col } from "react-bootstrap";
import Carousel from "react-multi-carousel";

import { useDispatch } from "react-redux";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../Utils/config";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1.5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1.5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 400 },
    items: 1.5,
  },
  mobile: {
    breakpoint: { max: 400, min: 0 },
    items: 1,
  },
};

const MyNft = ({ isLink }) => {
  const [alldata, setAlldata] = useState([]);
  let navigate = useNavigate();
  let dispatch = useDispatch(); //Direct assigning right now
  const [windowstate, setWindow] = useState(window.innerWidth < 767);
  const allNft = useSelector((state) => state.home__allnft);

  const getAllImages = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/user_images`);
    console.log(`response.data`, response.data);
    const { success, data } = response.data;

    // open the create NFT by default if no nft images found
    // if(response.data.data.length === 0) {
    //   dispatch({ type: "createnft__open" });
    // }

    if (success) {
      setAlldata(data);
      dispatch({ type: "getNft", payload: data });
    }
  };

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        const ismobile = window.innerWidth < 767;
        if (ismobile !== windowstate) setWindow(ismobile);
      },
      false
    );
    getAllImages();
  }, [windowstate]);

  //   let mynft = [
  //     {
  //       image: image1,
  //       cat: "Digital Art",
  //       title: "Vecotry Illustration ",
  //       selected: false,
  //       id: "#17372",
  //       nftid: nanoid(),
  //       description:
  //         "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //     },
  //     {
  //       image: image2,
  //       cat: "Digital Art",
  //       title: "Nature Illustration ",
  //       selected: false,
  //       id: "#3783",
  //       nftid: nanoid(),
  //       description:
  //         "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //     },
  //   ];

  useEffect(() => {
    // mynft = [];
    // dispatch({ type: "getNft", payload: mynft });
    setAlldata(allNft);
  }, [allNft]);

  const handleChange = () => {
    dispatch({ type: "createnft__open" });
  };
  //   const detailPage = (id, index) => {
  //     // dispatch({ type: "nft__detail", payload: mynft[index] });
  //     navigate(`/nft/${id}`);
  //   };

  const detailPage = (data, index) => {
    console.log(`data`, data);
    dispatch({ type: "nft__detail", payload: data });
    navigate(`/nft/${data.uuid}`);
  };

  // const nft__data = useSelector((state)=> state.home__allnft) //Defined in reducer function
  console.log(`alldata`, alldata);
  return (
    <>
      <div
        className={`${styles.mynft__wrapper} ${
          !isLink ? styles.mynft__page__wrapper : ""
        }`}
      >
        <div className={styles.mynft__header}>
          <h5>My NFTs</h5>
          {isLink ? (
            <Link to="all-nft">See All</Link>
          ) : (
            <button onClick={handleChange}>
              <span>
                <AiOutlinePlus />
              </span>
              Create More
            </button>
          )}
        </div>
        <div className={styles.mynft__box__wrapper}>
          {windowstate && isLink ? (
            <>
              <Carousel
                removeArrowOnDeviceType={[
                  "tablet",
                  // "mobile",
                  "desktop",
                  "superLargeDesktop",
                ]}
                responsive={responsive}
                autoPlay={false}
                infinite={false}
                swipeable={true}
                draggable={true}
              >
                {alldata.map((data, i) => {
                  return (
                    <Fragment key={nanoid()}>
                      <div
                        className={`${styles.mynft__box} ${styles.mynft__small__screen}`}
                        // onClick={() => detailPage(data.nftid, i)}
                        onClick={() => detailPage(data, i)}
                      >
                        <div className={styles.mynft__box__image__wrapper}>
                          <div className={styles.mynft__box__image}>
                            <img src={data.image} alt={data.title} />
                          </div>
                          <div className={styles.mynft__box__cat}>
                            <h6>{data?.category}</h6>
                          </div>
                        </div>
                        <div
                          className={styles.mynft__box__description__wrapper}
                        >
                          <h2>{data?.name}</h2>
                          <p>{data?.nft_id}</p>
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
              </Carousel>
            </>
          ) : (
            <>
              <Row>
                {alldata.map((data, i) => {
                  return (
                    <Fragment key={nanoid()}>
                      <Col
                        lg={3}
                        md={4}
                        sm={6}
                        xs={12}
                        style={{ marginBottom: "15px" }}
                      >
                        <div
                          className={styles.mynft__box}
                          // onClick={() => detailPage(data.nftid, i)}
                          onClick={() => detailPage(data, i)}
                        >
                          <div className={styles.mynft__box__image__wrapper}>
                            <div className={styles.mynft__box__image}>
                              <img src={data.image} alt={data.title} />
                            </div>
                            <div className={styles.mynft__box__cat}>
                              <h6>{data?.category}</h6>
                            </div>
                          </div>
                          <div
                            className={styles.mynft__box__description__wrapper}
                          >
                            <h2>{data?.name}</h2>
                            <p>{data?.nft_id}</p>
                          </div>
                        </div>
                      </Col>
                    </Fragment>
                  );
                })}
              </Row>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default memo(MyNft);

MyNft.propTypes = {
  isLink: PropTypes.bool.isRequired,
};
