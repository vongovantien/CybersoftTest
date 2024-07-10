import axios from "axios";

const API_URL = "https://your-backend-url/api"; // Replace with your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await api.post("/user/register", {
    username,
    email,
    password,
  });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post("/user/login", { email, password });
  return response.data;
};

export const deposit = async (userId: string, amount: number) => {
  const response = await api.post("/payment/deposit", { userId, amount });
  return response.data;
};

export const transfer = async (
  senderId: string,
  receiverId: string,
  amount: number
) => {
  const response = await api.post("/payment/transfer", {
    senderId,
    receiverId,
    amount,
  });
  return response.data;
};

export const getTransactionHistory = async (userId: string) => {
  const response = await api.get(`/payment/history/${userId}`);
  return response.data;
};
