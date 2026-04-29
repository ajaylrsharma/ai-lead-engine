import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const generateEmail = (data) => API.post("/outreach/emails/generate/", data);
export const sendEmail = (id) => API.post(`/outreach/emails/${id}/send/`);
export const getEmails = (params) => API.get("/outreach/emails/", { params });
export const getCampaigns = () => API.get("/outreach/campaigns/");
export const createCampaign = (data) => API.post("/outreach/campaigns/", data);
