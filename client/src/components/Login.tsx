import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField } from 'formik-mui';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';
// import { useMutation } from 'react-query';
import { loginUser } from '../features/auth/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formError, setFormError] = React.useState<string | null>(null);

  const mutation = useMutation(loginUser, {
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate('/');
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.message || 'Login failed');
    },
  });

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>
      {formError && <Alert severity="error">{formError}</Alert>}
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting || mutation.isLoading}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default Login; 