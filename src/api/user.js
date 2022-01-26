import axios from "axios";
import { API_BASE_URL } from "../Utils/config";

export const getUserById = userId =>
  axios.get(`${API_BASE_URL}/users/${userId}`);

export const getUserDetails = () =>
  axios.get(`${API_BASE_URL}/users/details`);

export const updateUserById = (userId, data) =>
  axios.put(`${API_BASE_URL}/users/${userId}`, data);

export const checkAccount = (accountId) =>
  axios.get(`${API_BASE_URL}/check_account_id?account_id=${accountId}`);

export const signupRequest = formData =>
  axios.post(`${API_BASE_URL}/signup`, formData);

export const userLoginRequest = formData =>
  axios.post(`${API_BASE_URL}/login`, formData);

export const createUserRequest = (data) =>
  axios.post(`${API_BASE_URL}/user/create`, data);