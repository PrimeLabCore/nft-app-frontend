import { Col, Row } from "react-bootstrap";
import React, {
  Fragment,
  memo,
  useEffect,
  useState
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { AiOutlinePlus } from "react-icons/ai";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import styles from "./Home.module.css";
import { mapNftDetails } from "../../../Utils/utils";
import { LoaderIconBlue } from "../../Generic/icons";
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
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Direct assigning right now
  const [windowstate, setWindow] = useState(window.innerWidth < 767);
  const nfts = useSelector((state) => state.home__allnft.nfts);
  const { user } = useSelector((state) => state.authReducer);
  const [alldata, setAlldata] = useState([]);

  const [isLoading, setIsloading] = useState(false);

  // effect for keeping track of nfts change
  useEffect(() => {
    setAlldata([...nfts])
  }, [nfts])

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        const ismobile = window.innerWidth < 767;
        if (ismobile !== windowstate) setWindow(ismobile);
      },
      false
    );
  }, [windowstate]);

  // fetch all the nfts of the user
  useEffect(() => {
    setIsloading(true);

    // Ajax Request to create user
    axios
      .get(`${API_BASE_URL}/nfts/list?owner_id=${user?.user_id}`)
      .then((response) => {
        // save user details
        const tempNfts = response.data.data;
        // console.log("data nfts", tempNfts);
        setAlldata(tempNfts);
        dispatch({ type: "update_nfts", payload: tempNfts });
      })
      .catch((error) => {
        if (error?.response?.data) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => {
        setIsloading(false);
      });
  }, []);

  const handleChange = () => {
    dispatch({ type: "createnft__open" });
  };

  const detailPage = (data) => {
    dispatch({ type: "nft__detail", payload: mapNftDetails(data) });
    navigate(`/nft/${data.nft_id}`);
  };

  const filterEmpty = data => {
    if (!data?.file_url || data?.file_url === "") return false;
    return !(data.status === "unclaimed_gift" && data.parent_id);
  };

  return (
    <div
      className={`${styles.mynft__wrapper} ${!isLink ? styles.mynft__page__wrapper : ""
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
      {isLoading ? <LoaderIconBlue /> : (
        <div className={styles.mynft__box__wrapper}>
          {windowstate && isLink ? (
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
              swipeable
              draggable
            >
              {alldata
                .filter(filterEmpty)
                .map(data => {
                const urlArray = data?.file_url?.split(".");
                const fileType = urlArray.length
                  ? urlArray[urlArray.length - 1]
                  : "";
                if (data.status === "unclaimed_gift" && data.parent_id) {
                  return;
                }
                return (
                  <Fragment key={nanoid()}>
                    <div
                      className={`${styles.mynft__box} ${styles.mynft__small__screen}`}
                        // onClick={() => detailPage(data.nftid, i)}
                      onClick={() => detailPage(data)}
                    >
                      <div className={styles.mynft__box__image__wrapper}>
                        <div className={styles.mynft__box__image}>
                          {fileType.toLowerCase() === "mp4" ? (
                            <video
                              style={{ width: "100%", borderRadius: "8px" }}
                              src={data?.file_url}
                            />
                          ) : fileType.toLowerCase() === "mp3" ? (
                            <div style={{ width: "100%", padding: "0 2px" }}>
                              <audio
                                style={{
                                  width: "inherit",
                                  marginTop: "60px",
                                }}
                                controls
                              >
                                <source src={data?.file_url} />
                              </audio>
                            </div>
                          ) : (
                            <img src={data?.file_url} alt={data.title} />
                          )}
                        </div>
                        <div className={styles.mynft__box__cat}>
                          <h6>{data?.category}</h6>
                        </div>
                      </div>
                      <div
                        className={styles.mynft__box__description__wrapper}
                      >
                        <h2>{data?.title}</h2>
                        <p>{data?.nft_id}</p>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </Carousel>
          ) : (
            <Row>
              {alldata
                .filter(filterEmpty)
                .map((data) => {
                const urlArray = data?.file_url?.split(".");
                const fileType = urlArray.length
                  ? urlArray[urlArray.length - 1]
                  : "";
                if (data.status === "unclaimed_gift" && data.parent_id) {
                  return;
                }
                return (
                  <Col
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ marginBottom: "15px" }}
                    key={nanoid()}
                  >
                    <div
                      className={styles.mynft__box}
                        // onClick={() => detailPage(data.nftid, i)}
                      onClick={() => detailPage(data)}
                    >
                      <div className={styles.mynft__box__image__wrapper}>
                        <div className={styles.mynft__box__image}>
                          {fileType.toLowerCase() === "mp4" ? (
                            <video
                              style={{ width: "100%", borderRadius: "8px" }}
                              src={data?.file_url}
                            />
                          ) : fileType.toLowerCase() === "mp3" ? (
                            <div
                              style={{
                                width: "100%",
                                paddingRight: "10px",
                              }}
                            >
                              <audio
                                style={{
                                  width: "inherit",
                                  marginTop: "60px",
                                  marginLeft: "5px",
                                }}
                                controls
                              >
                                <source src={data?.file_url} />
                              </audio>
                            </div>
                          ) : (
                            <img src={data?.file_url} alt={data.title} />
                          )}
                        </div>
                        <div className={styles.mynft__box__cat}>
                          <h6>{data?.category}</h6>
                        </div>
                      </div>
                      <div
                        className={styles.mynft__box__description__wrapper}
                      >
                        <h2>{data?.title}</h2>
                        <p>{data?.nft_id}</p>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>
      )}
    </div>
  );
};
export default memo(MyNft);

MyNft.propTypes = {
  isLink: PropTypes.bool.isRequired,
};
