import axios from 'axios';

export const getUsers = async (token: string) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUserRole = async (id: string, role: string, token: string) => {
    const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/admin/users/${id}/role`, { role }, {
      headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (id: string, token: string) => {
  const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMetrics = async (token: string) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/metrics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllProducts = async (token: string) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteProduct = async (id: string, token: string) => {
  const response = await axios.delete(`${process.env.API_URL}/api/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const restoreProduct = async (id: string, token: string) => {
  // This would require a backend endpoint to restore a soft-deleted product
  const response = await axios.patch(`${process.env.API_URL}/api/products/${id}/restore`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createProduct = async (data: any, token: string) => {
    const response = await axios.post(`${process.env.API_URL}/api/products`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProduct = async (id: string, data: any, token: string) => {
  const response = await axios.put(`${process.env.API_URL}/api/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}; 