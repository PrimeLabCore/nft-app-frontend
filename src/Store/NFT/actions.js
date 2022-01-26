import { NFT_FETCH_LIST, NFT_SET_CURRENT, NFT_SET_TRACKER } from "./actionTypes";

export const actionNFTFetchList = payload => ({
  type: NFT_FETCH_LIST,
  payload
});

export const actionNFTSetCurrent = payload => ({
  type: NFT_SET_CURRENT,
  payload
});

export const actionNFTSetTracker = payload => ({
  type: NFT_SET_TRACKER,
  payload
});
