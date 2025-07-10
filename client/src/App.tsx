import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { logout } from './features/auth/authSlice';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LoadingFallback from './components/LoadingFallback';

const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const ProductList = lazy(() => import('./components/ProductList'));
const Cart = lazy(() => import('./components/Cart'));
const Checkout = lazy(() => import('./components/Checkout'));
const OrderHistory = lazy(() => import('./components/OrderHistory'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  if (!token || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            E-Commerce Store
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Always show Products link */}
            <Button color="inherit" onClick={() => navigate('/')}>
              Products
            </Button>
            
            {token ? (
  <>
  
    <Button
      color="inherit"
      startIcon={<ShoppingCartIcon />}
      onClick={() => navigate('/cart')}
    >
      Cart
    </Button>


    <Button
      color="inherit"
      startIcon={<PersonIcon />}
      onClick={() => navigate('/orders')}
    >
      Orders
    </Button>


    {user?.role === 'admin' && (
      <Button
        color="inherit"
        startIcon={<AdminPanelSettingsIcon />}
        onClick={() => navigate('/admin')}
      >
        Admin
      </Button>
    )}

  
    <Button color="inherit" onClick={() => navigate('/dashboard')}>
      Dashboard
    </Button>

 
    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  </>
) : (
  <>

    <Button color="inherit" onClick={() => navigate('/login')}>
      Login
    </Button>
    <Button color="inherit" onClick={() => navigate('/register')}>
      Register
    </Button>
  </>
)}

          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Container>
    </>
  );
};

export default App;
