import axios from "axios";
import { API_BASE_URL } from "../Utils/config";

export const getTransactionByUserId = userId =>
  axios.get(`${API_BASE_URL}/transactions/list/${userId}`);

export const createTransactionRequest = (data) =>
  axios.post(`${API_BASE_URL}/transactions`, data)

export const preventLinterError = () => {};
