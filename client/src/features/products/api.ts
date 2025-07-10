import axios from 'axios';

export interface ProductFilterParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const fetchProducts = async (params: ProductFilterParams = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category) query.append('category', params.category);
  if (params.minPrice !== undefined) query.append('minPrice', String(params.minPrice));
  if (params.maxPrice !== undefined) query.append('maxPrice', String(params.maxPrice));
  if (params.rating !== undefined) query.append('rating', String(params.rating));
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortOrder) query.append('sortOrder', params.sortOrder);
  const response = await axios.get(`http://localhost:5000/api/products?${query.toString()}`);
  return response.data;
}; 