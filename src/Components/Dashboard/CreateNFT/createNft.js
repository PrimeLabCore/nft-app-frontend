import React, { useState } from "react";
import { Modal, ProgressBar } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import styles from "./createNft.module.css";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";

import fileHelper from "../../../Services/fileHelper";
import { API_BASE_URL } from "../../../Utils/config";
import { isEmpty } from "../../../Utils/utils";
import { mapNftDetails } from "../../../Utils/utils";

const audioRegex = /(audio)(\/\w+)+/g;
const videoRegex = /(video)(\/\w+)+/g;

const allowedUploadCount = 1;
const requiredFileExtensions = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".mp4",
  ".mp3",
  ".webp",
];
const requiredFileExtensionsDescription =
  requiredFileExtensions
    .map((extension) => extension.substring(1).toUpperCase())
    .join(", ") +
  " or " +
  requiredFileExtensions[requiredFileExtensions.length - 1]
    .substring(1)
    .toUpperCase();

const CreateNft = (props) => {
  let navigate = useNavigate();
  const { transactionId } = props;

  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("image");

  const [loading, setLoading] = useState(false);
  const [createNftResponse, setCreateNftResponse] = useState({
    name: "",
  });
  const { user } = useSelector((state) => state.authReducer);
  const { adTracker } = useSelector((state) => state.nftReducer);

  // getting all NFT detail
  const home__allnft = useSelector((state) => state.home__allnft);

  const [details, setDetails] = useState({
    title: "",
    description: "",
    category: "Digital Arts",
  });

  const [formValues, setFormValues] = useState([{}]);

  const formInfo = {
    selectedFile,
    ...details,
    ...formValues,
  };

  let handleChange = (index, clikedInput) => (e) => {
    formValues[index] = {
      ...formValues[index],
      [`${clikedInput}`]: e.target.value,
    };
    setFormValues([...formValues]);
  };

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        attr_name: "",
        attr_value: "",
      },
    ]);
  };

  const allNft = () => {
    dispatch({ type: "createnft__close" });
    setNftForm(false);
    setNftPreview(false);
    setNftMint(false);
    navigate("/all-nft");
  };

  const openNftDetail = () => {
    // navigate(`/nft/${nanoid()}`);
    dispatch({
      type: "nft__detail",
      payload: mapNftDetails(createNftResponse),
    });
    navigate(`/nft/${createNftResponse.nft_id}`);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const dispatch = useDispatch();
  const createnft__popup = useSelector((state) => state.createnft__popup); //Defined in reducer function

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setDetails((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
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
  //Rest Of the Modals
  const [nftForm, setNftForm] = useState(false);
  const [nftPreview, setNftPreview] = useState(false);
  const [nftMint, setNftMint] = useState(false);

  const handleNftForm = () => {
    if (selectedFile) {
      dispatch({ type: "createnft__close" });
      setNftForm(true);
      setNftPreview(false);
      setNftMint(false);
    } else {
      toast.error("File Cannot Be Empty");
    }
  };
  const handleNftPreview = async () => {
    if (isEmpty(details.title)) {
      toast.error("Please enter the title");
    } else if (isEmpty(details.description)) {
      toast.error("Please enter the description");
    } else {
      dispatch({ type: "createnft__close" });
      setNftForm(false);
      setNftPreview(true);
      setNftMint(false);
    }
  };

  const trackConversion = async (user, transactionId, details) => {
    const requestBody = {
      transaction_id: transactionId,
      userWallet: user.user_id,
      details,
    };

    const conversionURL =
      "https://fcnefunrz6.execute-api.us-east-1.amazonaws.com/test/conversion";
    return axios.post(
      conversionURL,
      // TODO: Populate conversionURL with the production version of the endpoint, something like below:
      // `${API_BASE_URL}/api/v1/conversion`,
      requestBody
    );
  };

  const mineNft = async (type) => {
    setLoading(true);

    let nftDetail = { ...details };
    nftDetail.attributes = formValues;
    nftDetail.owner_id = user.user_id;
    nftDetail.tracker = adTracker;

    if (type === "mint") {
      nftDetail.action_type = "mine";
    }

    let nftData = new FormData();
    nftData.append("file", selectedFile);
    nftData.append("data", JSON.stringify(nftDetail));

    axios
      .post(`${API_BASE_URL}/nfts`, nftData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        dispatch({
          type: "current_selected_nft",
          payload: response.data?.data,
        });

        setCreateNftResponse(response.data?.data);

        toast.success(
          `NFT ${details.title} was successfully ${
            type === "mint" ? "mined" : "created"
          }.`
        );

        axios
          .get(`${API_BASE_URL}/nfts?user_id=${user?.user_id}`)
          .then((response) => {
            let tempNfts = response.data.data;
            dispatch({ type: "update_nfts", payload: tempNfts });
          });

        dispatch({ type: "createnft__close" });
        setNftForm(false);
        setNftPreview(false);

        //reset create nft form
        setDetails({
          ...details,
          title: "",
          description: "",
        });
        setSelectedFile("");
        setFormValues([]);

        if (type === "gift") {
          sendNftModal();

          if (transactionId) {
            trackConversion(user, transactionId, details);
          }
        }

        if (type === "mint") {
          setNftMint(true);
        }
      })
      .catch((error) => {
        if (error.response.data) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const goBack = (modalName) => {
    if (modalName === "initalForm") {
      dispatch({ type: "createnft__open" });
      setNftForm(false);
      setNftPreview(false);
      setNftMint(false);
    } else if (modalName === "nftForm") {
      dispatch({ type: "createnft__close" });
      setNftForm(true);
      setNftPreview(false);
      setNftMint(false);
    }
  };

  // const openNftDesc = () => {
  //   navigate("/nft-details");
  // };

  /**
   * Saves new files in state, or shows error modal if error in upload
   * @param {array} files array of files returned from upload event
   */
  async function handleNewFileUpload(files) {
    const errorObject = fileHelper.validateFilesForUpload(
      files,
      allowedUploadCount,
      requiredFileExtensions
    );

    if (errorObject) {
      toast.error(errorObject.message);
    } else {
      const newFile = files[0];
      setSelectedFile(newFile);
      if (videoRegex.test(newFile.type)) {
        setSelectedFileType("video");
      } else if (audioRegex.test(newFile.type)) {
        setSelectedFileType("audio");
      } else {
        setSelectedFileType("image");
      }
    }
  }

  return (
    <>
      {/* Initial Modal  */}
      <Modal
        className={`${styles.initial__nft__modal} ${styles.nft__mobile__modal} initial__modal`}
        show={createnft__popup}
        onHide={() => {
          dispatch({ type: "createnft__close" });
          setDetails({ title: "", description: "", category: "Digital Arts" });
          setSelectedFile("");
          setFormValues([{}]);
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          className={styles.modal__header__wrapper}
          closeButton={home__allnft?.nfts.length > 0}
        >
          <div className="modal__title__wrapper">
            <Modal.Title>
              <div className={styles.modal__header}>
                <h2>Create an NFT</h2>
              </div>
            </Modal.Title>
          </div>
        </Modal.Header>
        <div className={styles.progress}>
          <ProgressBar now={(1 / 3) * 100} />
        </div>
        <Modal.Body>
          <div className={styles.modal__body__wrapper}>
            <h3>Upload Files</h3>

            <div className="file__wrapper">
              <input
                type="file"
                id="files"
                name="file"
                onChange={(e) => handleNewFileUpload(e.target.files)}
                accept={requiredFileExtensions.join(", ")}
                style={{ display: "none" }}
                required
              />
              <div className="file__upload__wrapper">
                <label htmlFor="files">
                  {selectedFile ? "Upload Another File" : "Choose File"}
                </label>
              </div>
              <p>{requiredFileExtensionsDescription}</p>
              <p>
                Max{" "}
                {fileHelper.convertBytesToMB(
                  fileHelper.DEFAULT_MAX_FILE_SIZE_IN_BYTES
                )}
                MB
              </p>
            </div>

            {selectedFile &&
              (selectedFile?.type?.includes("video") ? (
                <div className="uploaded__file">
                  <video
                    style={{ width: "100%", borderRadius: "8px" }}
                    src={URL.createObjectURL(selectedFile)}
                  />
                </div>
              ) : selectedFile?.type?.includes("audio") ? (
                <div className="uploaded__file">
                  <audio controls>
                    <source src={URL.createObjectURL(selectedFile)} />
                  </audio>
                </div>
              ) : (
                <div className="uploaded__file">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Uploaded File"
                  />
                </div>
              ))}
          </div>
          <div className={styles.next__btn__wrapper}>
            <button
              onClick={() =>
                selectedFile
                  ? handleNftForm()
                  : toast.error("Please upload files.")
              }
              disabled={selectedFile ? false : true}
              className={styles.next__btn}
            >
              Next
              <span>
                <IoIosArrowForward />
              </span>
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* NFT Form Modal */}
      <Modal
        className={`${styles.initial__nft__modal} ${styles.nft__mobile__modal} ${styles.nft__form__modal} initial__modal`}
        show={nftForm}
        onHide={() => {
          setNftForm(false);
          setDetails({});
          setFormValues([{}]);
          setSelectedFile("");
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          className={styles.modal__header__wrapper}
          closeButton={home__allnft?.nfts.length > 0}
        >
          <div className="modal__multiple__wrapper">
            <button onClick={() => goBack("initalForm")} className="back__btn">
              Back
            </button>
            <Modal.Title>
              <div className={styles.modal__header}>
                <h2>Create an NFT</h2>
              </div>
            </Modal.Title>
          </div>
        </Modal.Header>
        <div className={styles.progress}>
          <ProgressBar now={(2 / 3) * 100} />
        </div>
        <Modal.Body>
          <div className={styles.modal__body__wrapper}>
            <form>
              <div className={styles.form__group}>
                <label>TITLE</label>
                <input
                  type="text"
                  name="title"
                  value={details.title}
                  onChange={inputEvent}
                  placeholder="Ex. Redeemable Art"
                  required
                />
              </div>
              <div className={styles.form__group}>
                <label>DESCRIPTION</label>
                <textarea
                  rows={5}
                  name="description"
                  value={details.description}
                  onChange={inputEvent}
                  placeholder="Ex. Redeemable Art"
                  required
                />
              </div>
              <div className={styles.form__group}>
                <label>PROPERTIES</label>
                {formValues.map((val, index) => (
                  <div className={styles.form__group__inner} key={index}>
                    <input
                      type="text"
                      value={val[`attr_name`]}
                      placeholder="Tag"
                      onChange={handleChange(index, "attr_name")}
                    />

                    <input
                      type="text"
                      value={val[`attr_value`]}
                      placeholder="Value"
                      onChange={handleChange(index, "attr_value")}
                    />

                    {index ? (
                      <button
                        type="button"
                        className={styles.remove__btn}
                        onClick={() => removeFormFields(index)}
                      >
                        X
                      </button>
                    ) : null}
                  </div>
                ))}
                <button
                  className={styles.addFieldsBtn}
                  type="button"
                  onClick={() => addFormFields()}
                >
                  <span>
                    <AiOutlinePlus />
                  </span>
                  Add More
                </button>
              </div>
              <div className={styles.form__group}>
                <label>CATEGORY</label>
                <select
                  className={styles.form__category__dropdown}
                  name="category"
                  value={details.category}
                  onChange={inputEvent}
                  defaultValue={"Digital Arts"}
                  disabled
                >
                  <option></option>
                  <option value="Digital Arts">Digital Arts</option>
                </select>
              </div>
            </form>
          </div>
          <div className={styles.multiple__btn__wrapper}>
            <button onClick={handleNftPreview} className={styles.next__btn}>
              Next
              <span>
                <IoIosArrowForward />
              </span>
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* NFT Preview Modal */}
      <Modal
        className={`${styles.initial__nft__modal} ${styles.nft__form__modal} initial__modal ${styles.nft__mobile__modal}`}
        show={nftPreview}
        onHide={() => {
          setNftPreview(false);
          setDetails({ title: "", description: "", category: "Digital Arts" });
          setSelectedFile("");
          setFormValues([{}]);
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          className={styles.modal__header__wrapper}
          closeButton={home__allnft?.nfts.length > 0}
        >
          <div className="modal__multiple__wrapper">
            <button onClick={() => goBack("nftForm")} className="back__btn">
              Back
            </button>
            <Modal.Title>
              <div className={styles.modal__header}>
                <h2>Create an NFT</h2>
              </div>
            </Modal.Title>
          </div>
        </Modal.Header>
        <div className={styles.progress}>
          <ProgressBar now={(2.9 / 3) * 100} />
        </div>
        <Modal.Body>
          <div className={styles.modal__body__wrapper}>
            <h6>Preview</h6>
            <div className={styles.mynft__box}>
              <div className={styles.mynft__box__image__wrapper}>
                {selectedFile &&
                  (selectedFile?.type?.includes("video") ? (
                    <video
                      style={{ width: "100%", borderRadius: "8px" }}
                      src={URL.createObjectURL(selectedFile)}
                    />
                  ) : selectedFile?.type?.includes("audio") ? (
                    <audio
                      style={{ marginTop: "60px", marginLeft: "5px" }}
                      controls
                    >
                      <source src={URL.createObjectURL(selectedFile)} />
                    </audio>
                  ) : (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt={formInfo.title}
                    />
                  ))}
                {!audioRegex.test(selectedFile.type) && (
                  <div className={styles.mynft__box__cat}>
                    <h6>{details?.category}</h6>
                  </div>
                )}
              </div>
              <div className={styles.mynft__box__description__wrapper}>
                <h2>Title</h2>
                <p>{details.title}</p>
                <h2>Description</h2>
                <p>{details?.description}</p>
                <div className={styles.mynft__box__profile__info}>
                  <div className={styles.details__profile__picture}></div>
                  <div className={styles.details__user__info}>
                    <p>{user?.full_name}</p>
                    <h6>{user?.wallet_id}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.multiple__btn__wrapper}>
            <button
              onClick={() => {
                mineNft("mint");
                localStorage.removeItem("firstImport");
              }}
              disabled={loading}
              className={styles.next__btn}
            >
              Mint NFT
              <span>
                <IoIosArrowForward />
              </span>
            </button>
            <button
              onClick={() => {
                mineNft("gift");
                localStorage.removeItem("firstImport");
              }}
              disabled={loading}
              className={styles.next__btn}
            >
              Gift NFT
              <span>
                <IoIosArrowForward />
              </span>
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* NFT Mint Modal */}
      <Modal
        className={`${styles.initial__nft__modal} ${styles.nft__form__modal} nft__final__mobile__modal initial__modal`}
        show={nftMint}
        onHide={() => setNftMint(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header
          className={`${styles.modal__header__wrapper}  ${styles.modal__header__bottom} last__modal__header`}
          closeButton={home__allnft?.nfts.length > 0}
        ></Modal.Header>
        {/* <button onClick={allNft} className="btnclose">X</button> */}
        <Modal.Body className={styles.modal__body__top}>
          <div className={`${styles.modal__body__wrapper}`}>
            <div className={styles.mint__info__wrapper}>
              <div className={styles.mint__image}>
                <img
                  src={
                    createNftResponse?.file_url
                      ? createNftResponse.file_url
                      : ""
                  }
                  alt={""}
                />
              </div>
              <h1>
                {createNftResponse.title} <br /> Successfully Mined
              </h1>
              <h6>NFT ID {createNftResponse?.nft_id}</h6>
            </div>
          </div>
          <div
            className={`${styles.multiple__btn__wrapper} ${styles.last__modal__btn}`}
          >
            <button onClick={openNftDetail} className={styles.next__btn}>
              Open
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default CreateNft;
