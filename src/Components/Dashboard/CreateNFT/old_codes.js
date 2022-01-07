// let fd = new FormData();
// fd.append("user_image[name]", "name");
// fd.append("user_image[pic]", event.target.files[0]);

// const response = await axios.post(
//   `${API_BASE_URL}/api/v1/user_images`,
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



[`size_12345`]: "",
      [`extension_12345`]: "",
      id: "12345",



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


  <div className={styles.mynft__box__description__wrapper}>
                <h2>Title</h2>
                <p>{details.title}</p>
                <h2>Description</h2>
                <p>{details?.description}</p>
                <br></br>
                <div className={styles.mynft__box__profile__info}>
                  <div className={styles.details__profile__picture}></div>
                  <div className={styles.details__user__info}>
                    <p>{user?.full_name}</p>
                    <h6>{user?.wallet_id}</h6>
                  </div>
                </div>
              </div>



[`size_${id}`]: "",
        [`extension_${id}`]: "",
        id: id,

         //create NFT here

      let nftDetail = { ...details };
      nftDetail.attributes = formValues;
      nftDetail.owner_id = user.user_id;
 setLoading(true);
   let nftData = new FormData();
      nftData.append("file", selectedFile);
      nftData.append("data", JSON.stringify(nftDetail));

      //Ajax Request to create user
      axios
        .post(`${API_BASE_URL}/nfts`, nftData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          toast.success(`NFT ${details.title} was successfully created.`);
        
          console.log(response);
        })
        .catch((error) => {
          if (error.response.data) {
            toast.error(error.response.data.message);
          }
        })
        .finally(() => {
          setLoading(false);
        });

         {
            [`size_12345`]: "",
            [`extension_12345`]: "",
            id: "12345",
          },


setCreateNftResponse(data);
    dispatch({ type: "addNewNft", payload: data });


     {console.log(selectedFile?.type?.includes("video"))}