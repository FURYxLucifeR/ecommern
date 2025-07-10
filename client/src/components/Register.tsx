import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField } from 'formik-mui';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';
// import { useMutation } from 'react-query';
import { registerUser } from '../features/auth/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  address: Yup.string().required('Address is required'),
});

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formError, setFormError] = React.useState<string | null>(null);

  const mutation = useMutation(registerUser, {
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate('/');
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.message || 'Registration failed');
    },
  });

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Register
      </Typography>
      {formError && <Alert severity="error">{formError}</Alert>}
      <Formik
        initialValues={{ name: '', email: '', password: '', address: '' }}
        validationSchema={RegisterSchema}
        onSubmit={(values, { setSubmitting }) => {
          setFormError(null);
          mutation.mutate(values, {
            onSettled: () => setSubmitting(false),
          });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mb={2}>
              <Field
                component={TextField}
                name="name"
                label="Name"
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <Field
                component={TextField}
                name="email"
                label="Email"
                type="email"
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <Field
                component={TextField}
                name="password"
                label="Password"
                type="password"
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <Field
                component={TextField}
                name="address"
                label="Address"
                fullWidth
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting || mutation.isLoading}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default Register; 