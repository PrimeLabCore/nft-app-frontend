import { nanoid } from "nanoid";

let initialvalue = {
  image: "",
  category: "",
  title: " ",
  selected: false,
  id: "",
  nftid: nanoid(),
  description: "",
};

const NFTDetail = (state = initialvalue, action) => {
  switch (action.type) {
    case "nft__detail":
      return action.payload;

    default:
      return state;
  }
};
export default NFTDetail;
