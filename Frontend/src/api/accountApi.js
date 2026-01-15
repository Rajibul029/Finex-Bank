import axios from "axios";

const BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginUser = (email, password) =>
  api.post("/users/login", { email, password });

export const getAccountDetails = () => api.get("/accounts/me");
export const depositMoney = (amount) => api.post("/accounts/deposit", { amount });
export const withdrawMoney = (amount) => api.post("/accounts/withdraw", { amount });
export const transferMoney = (receiver_account_number, amount) =>
  api.post("/accounts/transfer", { receiver_account_number, amount });
export const getTransactions = () => api.get("/accounts/transactions");
