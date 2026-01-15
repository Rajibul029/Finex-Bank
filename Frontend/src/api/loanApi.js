import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/loans",
});

// include JWT from localStorage
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const applyLoan = (data) => API.post("/apply", data);
export const getMyLoans = () => API.get("/my-loans");
export const payEMI = (data) => API.post("/pay-emi", data);

// admin routes
export const getAllLoans = () => API.get("/admin/all-loans");
export const adminAction = (data) => API.post("/admin/action", data);
