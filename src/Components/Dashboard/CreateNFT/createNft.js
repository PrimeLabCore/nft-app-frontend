import React, { useState } from "react";
import { nanoid } from "nanoid";
import { Modal, ProgressBar } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import styles from "./createNft.module.css";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";

const CreateNft = () => {
  let navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [createNftResponse, setCreateNftResponse] = useState({
    name: "",
  });
  const { user } = useSelector((state) => state.authReducer);
  const [details, setDetails] = useState({
    title: "",
    description: "",
    category: "Digital Arts",
  });

  const [formValues, setFormValues] = useState([
    {
      [`size_12345`]: "",
      [`extension_12345`]: "",
      id: "12345",
    },
  ]);

  const formInfo = {
    selectedFile,
    ...details,
    ...formValues,
  };

  let handleChange = (id, clikedInput) => (e) => {
    // console.log(id, clikedInput);
    const get_index = formValues.findIndex((value) => value.id === id);
    formValues[get_index] = {
      ...formValues[get_index],
      [`${clikedInput}_${id}`]: e.target.value,
    };
    setFormValues([...formValues]);
  };

  let addFormFields = () => {
    const id = nanoid();
    setFormValues([
      ...formValues,
      // generating unique keys for each object
      {
        [`size_${id}`]: "",
        [`extension_${id}`]: "",
        id: id,
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
      payload: createNftResponse,
    });
    navigate(`/nft/${createNftResponse.uuid}`);
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
  const handleNftPreview = () => {
    if (details.title && details.description && details.category) {
      // if (formValues.length <= 5) {
      //   for (let i = 0; i < formValues.length; i++) {
      //     let extension = `extension_${formValues[i].id}`;
      //     let size = `size_${formValues[i].id}`;
      //     var count = 0;
      //     if (!formValues[i][extension] && !formValues[i][size]) {
      //       count += 1;
      //     }
      //   }
      //   if (count === 0) {
      dispatch({ type: "createnft__close" });
      setNftForm(false);
      setNftPreview(true);
      setNftMint(false);
      //   } else {
      //     toast.error("All fields are required");
      //   }
      // } else {
      //   toast.error("Too Many Property Fields");
      // }
    } else {
      toast.error("All fields are required");
    }
  };

  const handleNftMint = async (comingFrom) => {
    setLoading(true);
    let fd = new FormData();
    fd.append("user_image[name]", details.title);
    fd.append("user_image[pic]", selectedFile);
    fd.append("user_image[description]", details.description);
    fd.append("user_image[category]", details.category);
    fd.append("user_image[properties]", "");

    const response = await axios.post(
      "https://nftmaker.algorepublic.com/api/v1/user_images",
      fd,
      {
        headers: {
          "Content-type": "multipart/form-data",
        },
      }
    );
    console.log(`response`, response);
    const { data, success } = response.data;
    // setSelectedFile(data);
    console.log(`data`, data);
    setCreateNftResponse(data);
    dispatch({ type: "addNewNft", payload: data });
    if (success) {
      dispatch({ type: "createnft__close" });
      setNftForm(false);
      setNftPreview(false);
      setNftMint(true);
      setDetails({
        title: "",
        description: "",
        category: "Digital Arts",
      });
      setSelectedFile("");
      setFormValues([
        {
          [`size_12345`]: "",
          [`extension_12345`]: "",
          id: "12345",
        },
      ]);
    }

    if(comingFrom==='create'){
      if (data){
        dispatch({
          type: "current_selected_nft",
          payload: data,
        });
      }
      sendNftModal()
    }

    setLoading(false);
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

  const changeHandler = async (event) => {
    // console.log(`event.target.files`, event.target.files[0]?.name);

    // let fd = new FormData();
    // fd.append("user_image[name]", "name");
    // fd.append("user_image[pic]", event.target.files[0]);

    // const response = await axios.post(
    //   "https://nftmaker.algorepublic.com/api/v1/user_images",
    //   fd,
    //   {
    //     headers: {
    //       "Content-type": "multipart/form-data",
    //     },
    //   }
    // );
    // console.log(`response`, response);
    // const { data } = response.data;
    // setSelectedFile(data);

    // FileReader support
    let target = event.target || window.event.srcElement,
      files = target.files;
    if (FileReader && files && files.length) {
      // console.log(`files[0]`, files[0]);
      let file__reader = new FileReader();
      file__reader.onload = function () {
        setSelectedFile(files[0]);
        toast.success("File Uploaded");
      };
      file__reader.readAsDataURL(files[0]);
    }
  };
  console.log(`details`, details);
  console.log(`selectedFile`, selectedFile);
  return (
    <>
      {/* Initial Modal  */}
      <Modal
        className={`${styles.initial__nft__modal} nft__mobile__modal initial__modal`}
        show={createnft__popup}
        onHide={() => dispatch({ type: "createnft__close" })}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className={styles.modal__header__wrapper} closeButton>
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
                onChange={changeHandler}
                accept="image/png, image/jpg, image/jpeg"
                style={{ display: "none" }}
                required
              />
              <div className="file__upload__wrapper">
                <label for="files">
                  {selectedFile ? "Upload Another File" : "Choose File"}
                </label>
              </div>
              <p>PNG, JPEG, JPG, SVG. Max 50mb.</p>
            </div>
            {selectedFile && (
              <div className="uploaded__file">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Uploaded File"
                />
              </div>
            )}
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
        className={`${styles.initial__nft__modal} nft__mobile__modal ${styles.nft__form__modal} initial__modal`}
        show={nftForm}
        onHide={() => setNftForm(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className={styles.modal__header__wrapper} closeButton>
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
                      style={{ width: "200px" }}
                      type="text"
                      value={val[`size_${val.id}`]}
                      placeholder="Ex. Size"
                      onChange={handleChange(val.id, "size")}
                    />

                    <input
                      type="text"
                      style={{ width: "200px" }}
                      value={val[`extension_${val.id}`]}
                      placeholder="Ex. 40"
                      onChange={handleChange(val.id, "extension")}
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
                  name="category"
                  value={details.category}
                  onChange={inputEvent}
                  defaultValue={"Digital Arts"}
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
        className={`${styles.initial__nft__modal} ${styles.nft__form__modal} initial__modal nft__mobile__modal`}
        show={nftPreview}
        onHide={() => setNftPreview(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className={styles.modal__header__wrapper} closeButton>
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
                <div className={styles.mynft__box__image}>
                  <img
                    src={selectedFile ? URL.createObjectURL(selectedFile) : ""}
                    alt={formInfo.title}
                  />
                </div>
                <div className={styles.mynft__box__cat}>
                  <h6>{details?.category}</h6>
                </div>
              </div>
              <div className={styles.mynft__box__description__wrapper}>
                <h2>{details?.title}</h2>
                <p>{details.title}</p>
                <h2>{details?.description}</h2>
                <p>{details?.description}</p>
                <div className={styles.mynft__box__profile__info}>
                  <div className={styles.details__profile__picture}></div>
                  <div className={styles.details__user__info}>
                    <p>Creater</p>
                    <h6>{user && user?.email?.split("@")[0]}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.multiple__btn__wrapper}>
            <button
              onClick={handleNftMint}
              disabled={loading}
              className={styles.next__btn}
            >
              Mint NFT
              <span>
                <IoIosArrowForward />
              </span>
            </button>
            <button
              onClick={()=>handleNftMint('create')}
              disabled={loading}
              className={styles.next__btn}
            >
              Create NFT
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
          closeButton
        ></Modal.Header>
        {/* <button onClick={allNft} className="btnclose">X</button> */}
        <Modal.Body className={styles.modal__body__top}>
          <div className={`${styles.modal__body__wrapper}`}>
            <div className={styles.mint__info__wrapper}>
              <div className={styles.mint__image}>
                <img
                  src={createNftResponse?.image ? createNftResponse.image : ""}
                  alt={""}
                />
              </div>
              <h1>
                {createNftResponse.name} <br /> Successfully Minted
              </h1>
              <h6>NFT ID #27283</h6>
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
