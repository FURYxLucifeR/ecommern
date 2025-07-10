import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order {
  _id: string;
  products: Array<{ product: string; quantity: number; price: number }>;
  address: string;
  shipping: string;
  status: string;
  total: number;
  createdAt: string;
  cancelable: boolean;
}

interface OrdersState {
  items: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setOrders, setLoading, setError } = orderSlice.actions;
export default orderSlice.reducer; 