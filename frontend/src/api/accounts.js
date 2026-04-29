import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data) => API.post("/accounts/register/", data);
export const loginUser = (data) => API.post("/accounts/login/", data);
export const refreshToken = (data) => API.post("/accounts/token/refresh/", data);
export const getMe = () => API.get("/accounts/me/");
