import { nanoid } from "nanoid";
import image1 from "../Assets/Images/dummy-card1.png";

let initialvalue = {
  image: image1,
  cat: "Digital Art",
  title: "Vecotry Illustration ",
  selected: false,
  id: "#17372",
  nftid: nanoid(),
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
