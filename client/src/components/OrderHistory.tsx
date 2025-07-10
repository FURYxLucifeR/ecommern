import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useQuery } from 'react-query';
import { getOrders } from '../features/orders/api';
import { Order } from '../features/orders/orderSlice';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';

const OrderHistory: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const { data, isLoading, error } = useQuery<Order[]>(['orders'], () => getOrders(token!), { enabled: !!token });
console.log("daata",data)
  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error">Failed to load orders</Alert>;

  return (
    <Paper sx={{ p: 4, maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Order History
      </Typography>
      {data && data.length > 0 ? (
        <List>
          {data.map((order) => (
            <React.Fragment key={order._id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`Order #${order._id}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {new Date(order.createdAt).toLocaleString()} | Status: {order.status}
                      </Typography>
                      <br />
                      {order.products.map((p, idx) => (
                        <span key={idx}>
                          {p.quantity} x {p.product} @ ${p.price}
                          <br />
                        </span>
                      ))}
                      <Typography variant="subtitle1">Total: ${order.total}</Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Alert severity="info">No orders found.</Alert>
      )}
    </Paper>
  );
};

export default OrderHistory; 