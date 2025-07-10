import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getProfile, updateProfile, getTotalExpenses } from '../features/auth/api';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Grid,
} from '@mui/material';
import { TextField } from 'formik-mui';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

interface Profile {
  name: string;
  email: string;
  address: string;
  role: string;
}
interface Expenses {
  total: number;
}

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
});

const UserDashboard: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: loadingProfile, error: errorProfile } = useQuery<Profile, Error>({
    queryKey: ['profile'],
    queryFn: () => getProfile(token!),
    enabled: !!token,
  });

  const { data: expenses, isLoading: loadingExpenses } = useQuery<Expenses, Error>({
    queryKey: ['expenses'],
    queryFn: () => getTotalExpenses(token!),
    enabled: !!token,
  });

  const mutation = useMutation<any, Error, { name: string; address: string }>({
    mutationFn: (values) => updateProfile(values, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditMode(false);
    },
  });

  const [editMode, setEditMode] = React.useState(false);

  if (loadingProfile || loadingExpenses) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  }

  if (errorProfile || !profile) {
    return <Alert severity="error">Failed to load profile</Alert>;
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Welcome, {profile.name}</Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => { dispatch(logout()); navigate('/login'); }}
        >
          Logout
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid  >
          <Typography variant="h6" color="primary" gutterBottom>User Information</Typography>
          <Typography><strong>Email:</strong> {profile.email}</Typography>
          <Typography><strong>Role:</strong> {profile.role}</Typography>
          <Typography><strong>Address:</strong> {profile.address}</Typography>
        </Grid>
        <Grid >
          <Typography variant="h6" color="primary" gutterBottom>Account Stats</Typography>
          <Typography><strong>Total Expenses:</strong> ${expenses?.total ?? 0}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Edit Profile</Typography>
        <Button variant="contained" onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Cancel' : 'Edit'}
        </Button>
      </Box>

      {editMode && (
        <Formik
          initialValues={{ name: profile.name, address: profile.address || '' }}
          validationSchema={ProfileSchema}
          enableReinitialize
          onSubmit={(values, { setSubmitting }) => {
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
                  name="address"
                  label="Address"
                  fullWidth
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || mutation.isLoading}
              >
                Save Changes
              </Button>
            </Form>
          )}
        </Formik>
      )}

      {mutation.isSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Profile updated successfully!
        </Alert>
      )}
      {mutation.isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to update profile
        </Alert>
      )}
    </Paper>
  );
};

export default UserDashboard;
