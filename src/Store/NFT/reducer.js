import { nanoid } from "nanoid";
import {
  NFT_FETCH_LIST,
  NFT_SET_CURRENT,
  NFT_SET_TRACKER
} from "./actionTypes";

const initialValue = {
  adTracker: "",
  nftList: [],
  currentNft: {
    image: "",
    category: "",
    title: " ",
    selected: false,
    id: "",
    nftid: nanoid(),
    description: "",
    owner: "",
    status: "",
  }
};

const NFTReducer = (state = initialValue, action) => {
  switch (action.type) {
    case NFT_SET_TRACKER:
      return {
        ...state,
        adTracker: action.payload
      }
    case NFT_FETCH_LIST:
      return {
        ...state,
        nftList: action.payload.filter(n => n.status !== "unclaimed_gift"),
      };
    case NFT_SET_CURRENT:
      return {
        ...state,
        currentNft: action.payload
      }
    default:
      return state;
  }
};
export default NFTReducer;
