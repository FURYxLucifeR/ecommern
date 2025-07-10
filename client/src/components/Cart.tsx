import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateQuantity, removeFromCart, clearCart } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Cart: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  console.log("caaart",cart)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, quantity: number, stock: number) => {
    if (quantity < 1 || quantity > stock) return;
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cart
      </Typography>
      {cart.length === 0 ? (
        <Alert severity="info">Your cart is empty.</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {item.image && (
                          <img src={item.image} alt={item.name} width={50} height={50} style={{ marginRight: 8 }} />
                        )}
                        {item.name}
                      </Box>
                    </TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value), item.stock)}
                        inputProps={{ min: 1, max: item.stock, style: { width: 60 } }}
                      />
                    </TableCell>
                    <TableCell>${item.price * item.quantity}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleRemove(item.productId)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {cart.length > 0 && (
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Button variant="outlined" color="error" onClick={handleClear}>
                Clear Cart
              </Button>
              <Typography variant="h6">Total: ${total}</Typography>
              <Button variant="contained" color="primary" onClick={() => navigate('/checkout')}>
                Checkout
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Cart; 