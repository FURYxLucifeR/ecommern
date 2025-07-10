import axios from 'axios';

export const placeOrder = async (
  data: { products: any[]; address: string; shipping: string },
  token: string
) => {
  const response = await axios.post('http://localhost:5000/api/orders', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getOrders = async (token: string) => {
  const response = await axios.get('http://localhost:5000/api/user/orders', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}; 