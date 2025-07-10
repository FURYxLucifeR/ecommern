import React from 'react';
import { fetchProducts, ProductFilterParams } from '../features/products/api';
import { Product } from '../features/products/productSlice';
import Grid from '@mui/material/Grid';
import { Card, CardContent, CardMedia, Typography, CircularProgress, Alert, Button, Snackbar, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import ProductFilters, { ProductFiltersValues } from './ProductFilters';
import { useQuery } from 'react-query';

const defaultFilters: ProductFiltersValues = {
  search: '',
  category: '',
  minPrice: 0,
  maxPrice: 10000,
  rating: 1,
};

const ProductList: React.FC = () => {
  const [filters, setFilters] = React.useState<ProductFiltersValues>(defaultFilters);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const dispatch = useDispatch();

  // Fetch categories from products (unique list)
  React.useEffect(() => {
    fetchProducts().then((products: Product[]) => {
      const cats = Array.from(new Set(products.map(p => p.category)));
      setCategories(cats);
    });
  }, []);

  // Fetch products with filters
  const { data, isLoading, error } = useQuery<Product[]>(['products', filters], () => fetchProducts({
    search: filters.search,
    category: filters.category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    rating: filters.rating,
  }));

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity: 1,
      stock: product.stock,
    }));
    setSnackbarOpen(true);
  };

  const handleFilterChange = (vals: ProductFiltersValues) => {
    setFilters(vals);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <Box display="flex" flexDirection="row">
      <ProductFilters
        categories={categories}
        values={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />
      <Box flex={1} p={3}>
        {isLoading ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />
        ) : error ? (
          <Alert severity="error">Failed to load products</Alert>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {data && data.length > 0 ? (
              data.map((product: Product) => (
                <Grid  key={product._id}>
                  <Card>
                    {product.images && product.images[0] && (
                      <CardMedia
                        component="img"
                        height="180"
                        image={product.images[0]}
                        alt={product.name}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.description}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        ${product.price}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <Typography variant="body2">Rating:</Typography>
                        <Box>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} style={{ color: i < Math.round(product.rating) ? '#FFD700' : '#ccc', fontSize: 18 }}>★</span>
                          ))}
                        </Box>
                        <Typography variant="body2" sx={{ ml: 1 }}>({product.rating})</Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        fullWidth
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock < 1}
                      >
                        {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid >
                <Alert severity="info">No products found.</Alert>
              </Grid>
            )}
          </Grid>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          message="Added to cart"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Box>
  );
};

export default ProductList;
