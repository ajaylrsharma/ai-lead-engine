import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getLeads = (params) => API.get("/leads/", { params });
export const createLead = (data) => API.post("/leads/", data);
export const updateLead = (id, data) => API.patch(`/leads/${id}/`, data);
export const deleteLead = (id) => API.delete(`/leads/${id}/`);
export const scoreLead = (id) => API.post(`/leads/${id}/score/`);
export const importCSV = (formData) =>
  API.post("/leads/import_csv/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const scrapeLeads = (data) => API.post("/leads/scrape/", data);
export const getStats = () => API.get("/dashboard/stats/");
