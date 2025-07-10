import axios from 'axios';

export const placeOrder = async (
  data: { products: any[]; address: string; shipping: string },
  token: string
) => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getOrders = async (token: string) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}; 