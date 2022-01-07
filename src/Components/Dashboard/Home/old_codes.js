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

//   const detailPage = (id, index) => {
//     // dispatch({ type: "nft__detail", payload: mynft[index] });
//     navigate(`/nft/${id}`);
//   };

// const nft__data = useSelector((state)=> state.home__allnft) //Defined in reducer function

// open the create NFT by default if no nft images found
// if(response.data.data.length === 0) {
//   dispatch({ type: "createnft__open" });
// }

// mynft = [];
// dispatch({ type: "getNft", payload: mynft });

useEffect(() => {
  setAlldata(nfts);
  console.log(nfts);
}, [nfts]);
