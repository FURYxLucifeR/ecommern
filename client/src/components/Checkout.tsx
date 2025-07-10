import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearCart } from '../features/cart/cartSlice';
import { useMutation } from 'react-query';
import { placeOrder } from '../features/orders/api';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  TextField as MuiTextField,
} from '@mui/material';
import { TextField } from 'formik-mui';

const CheckoutSchema = Yup.object().shape({
  address: Yup.string().required('Address is required'),
  shipping: Yup.string().required('Shipping method is required'),
});

const Checkout: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const [orderSuccess, setOrderSuccess] = React.useState(false);
  const [orderError, setOrderError] = React.useState<string | null>(null);

  const mutation = useMutation((data: { address: string; shipping: string }) =>
    placeOrder(
      {
        products: cart.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        address: data.address,
        shipping: data.shipping,
      },
      token!
    )
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0)
    return <Alert severity="info">Your cart is empty.</Alert>;

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Checkout
      </Typography>
      <List>
        {cart.map((item) => (
          <ListItem key={item.productId}>
            <ListItemText
              primary={`${item.name} x${item.quantity}`}
              secondary={`$${item.price} each`}
            />
            <Typography>${item.price * item.quantity}</Typography>
          </ListItem>
        ))}
        <Divider />
        <ListItem>
          <ListItemText primary="Total" />
          <Typography variant="h6">${total}</Typography>
        </ListItem>
      </List>
      <Formik
        initialValues={{ address: '', shipping: '' }}
        validationSchema={CheckoutSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setOrderError(null);
          mutation.mutate(values, {
            onSuccess: () => {
              setOrderSuccess(true);
              dispatch(clearCart());
              setSubmitting(false);
              resetForm();
            },
            onError: (error: any) => {
              setOrderError(error.response?.data?.message || 'Order failed');
              setSubmitting(false);
            },
          });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mb={2}>
              <Field
                component={TextField}
                name="address"
                label="Address"
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <Field
                component={TextField}
                name="shipping"
                label="Shipping Method"
                fullWidth
                as={MuiTextField}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              Place Order
            </Button>
          </Form>
        )}
      </Formik>
      {orderSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Order placed successfully!
        </Alert>
      )}
      {orderError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {orderError}
        </Alert>
      )}
    </Paper>
  );
};

export default Checkout; 