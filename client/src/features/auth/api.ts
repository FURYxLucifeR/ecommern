import axios from 'axios';

const API_URL = "http://localhost:5000/api/auth";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  address: string;
}) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};

export const getProfile = async (token: string) => {
  const response = await axios.get('http://localhost:5000/api/user/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProfile = async (data: { name: string; address: string }, token: string) => {
  const response = await axios.put('http://localhost:5000/api/user/profile', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getTotalExpenses = async (token: string) => {
  const response = await axios.get('http://localhost:5000/api/user/expenses', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}; 