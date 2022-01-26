import axios from "axios";
import { API_BASE_URL } from "../Utils/config";

export const createNFTRequest = body => {
  const conversionURL = "https://fcnefunrz6.execute-api.us-east-1.amazonaws.com/test/conversion";
  return axios.post(
    conversionURL,
    // TODO: Populate conversionURL with the production
    // version of the endpoint, something like below:
    // `${API_BASE_URL}/api/v1/conversion`,
    body
  );
};

export const postNFTRequest = data =>
  axios
    .post(`${API_BASE_URL}/nfts`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

export const getNFTListByOwnerId = ownerId =>
  axios.get(`${API_BASE_URL}/nfts/list?owner_id=${ownerId}`);