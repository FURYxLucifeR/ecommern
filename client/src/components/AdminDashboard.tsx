import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
// import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getMetrics,
  getUsers,
  updateUserRole,
  deleteUser,
  getAllProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from '../features/admin/api';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import ProductForm from './ProductForm';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// Add types for metrics, users, and products
interface Metrics {
  userCount: number;
  productCount: number;
  orderCount: number;
  salesTotal: number;
}
interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}
interface AdminProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images?: string[];
  isDeleted?: boolean;
}

const AdminDashboard: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: metrics, isLoading: loadingMetrics } = useQuery<Metrics, Error>({
    queryKey: ['metrics'],
    queryFn: () => getMetrics(token!),
    enabled: !!token,
  });
  console.log("metrics",metrics)
  const { data: users, isLoading: loadingUsers } = useQuery<AdminUser[], Error>({
    queryKey: ['admin-users'],
    queryFn: () => getUsers(token!),
    enabled: !!token,
  });
  const { data: products, isLoading: loadingProducts } = useQuery<AdminProduct[], Error>({
    queryKey: ['admin-products'],
    queryFn: () => getAllProducts(token!),
    enabled: !!token,
  });

  const updateRoleMutation = useMutation<any, Error, { id: string; role: string }>({
    mutationFn: ({ id, role }) => updateUserRole(id, role, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });
  const deleteUserMutation = useMutation<any, Error, string>({
    mutationFn: (id) => deleteUser(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });
  const deleteProductMutation = useMutation<any, Error, string>({
    mutationFn: (id) => deleteProduct(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const [editProduct, setEditProduct] = React.useState<any | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);

  const createProductMutation = useMutation<any, Error, any>({
    mutationFn: (data) => createProduct(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setAddOpen(false);
    },
  });
  const updateProductMutation = useMutation<any, Error, { id: string; data: any }>({
    mutationFn: ({ id, data }) => updateProduct(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setEditOpen(false);
      setEditProduct(null);
    },
  });

  if (!user || user.role !== 'admin') return <Alert severity="error">Access denied. Admins only.</Alert>;
  if (loadingMetrics || loadingUsers || loadingProducts) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;

  return (
    <Paper sx={{ p: 4, maxWidth: 1100, mx: 'auto', mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>
          Admin Dashboard
        </Typography>
        <Button variant="outlined" color="secondary" onClick={() => { dispatch(logout()); navigate('/login'); }}>
          Logout
        </Button>
      </Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Users: {metrics?.userCount ?? 0} | Products: {metrics?.productCount ?? 0} | Orders: {metrics?.orderCount ?? 0} 
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">User Management</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(users ?? []).map((u: AdminUser) => (
              <TableRow key={u._id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Select
                    value={u.role}
                    onChange={(e) => updateRoleMutation.mutate({ id: u._id, role: e.target.value })}
                    size="small"
                  >
                    <MenuItem value="user">user</MenuItem>
                    <MenuItem value="admin">admin</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => deleteUserMutation.mutate(u._id)}
                    disabled={u.role === 'admin'}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6">Product Management</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setAddOpen(true)}>
        Add Product
      </Button>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(products ?? []).map((p: AdminProduct) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => {
                      setEditProduct({
                        ...p,
                        images: p.images ? p.images.join(',') : '',
                      });
                      setEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => deleteProductMutation.mutate(p._id)}
                    disabled={p.isDeleted}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <ProductForm
            onSubmit={(values, helpers) => {
              createProductMutation.mutate({
                ...values,
                images: values.images.split(',').map((url: string) => url.trim()),
              });
              helpers.setSubmitting(false);
            }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <ProductForm
            initialValues={editProduct}
            isEdit
            onSubmit={(values, helpers) => {
              updateProductMutation.mutate({
                id: editProduct._id,
                data: {
                  ...values,
                  images: values.images.split(',').map((url: string) => url.trim()),
                },
              });
              helpers.setSubmitting(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default AdminDashboard; 