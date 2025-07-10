import React from 'react';
import { Box, TextField, MenuItem, InputLabel, FormControl, Select, Slider, Typography, Button } from '@mui/material';
import Rating from '@mui/material/Rating';

export interface ProductFiltersValues {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
}

interface ProductFiltersProps {
  categories: string[];
  values: ProductFiltersValues;
  onChange: (values: ProductFiltersValues) => void;
  onReset: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ categories, values, onChange, onReset }) => {
  const [localValues, setLocalValues] = React.useState(values);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const validate = (vals: ProductFiltersValues) => {
    const errors: { [key: string]: string } = {};
    if (vals.rating < 1 || vals.rating > 5) errors.rating = 'Rating must be between 1 and 5';
    if (vals.minPrice < 0) errors.minPrice = 'Min price must be positive';
    if (vals.maxPrice < 0) errors.maxPrice = 'Max price must be positive';
    if (vals.minPrice > vals.maxPrice) errors.maxPrice = 'Max price must be greater than min price';
    return errors;
  };

  const handleChange = (field: keyof ProductFiltersValues, value: any) => {
    const newValues = { ...localValues, [field]: value };
    setLocalValues(newValues);
    const errors = validate(newValues);
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      onChange(newValues);
    }
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <Box sx={{ width: 250, p: 2, borderRight: 1, borderColor: 'divider', minHeight: '100vh', position: 'sticky', top: 0 }}>
      <Typography variant="h6" gutterBottom>Filters</Typography>
      <TextField
        label="Search"
        value={localValues.search}
        onChange={e => handleChange('search', e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          value={localValues.category}
          label="Category"
          onChange={e => handleChange('category', e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {categories.map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box mt={2} mb={1}>
        <Typography gutterBottom>Price Range</Typography>
        <Box display="flex" gap={1}>
          <TextField
            label="Min"
            type="number"
            value={localValues.minPrice}
            onChange={e => handleChange('minPrice', Number(e.target.value))}
            error={!!errors.minPrice}
            helperText={errors.minPrice}
            size="small"
            sx={{ width: '50%' }}
          />
          <TextField
            label="Max"
            type="number"
            value={localValues.maxPrice}
            onChange={e => handleChange('maxPrice', Number(e.target.value))}
            error={!!errors.maxPrice}
            helperText={errors.maxPrice}
            size="small"
            sx={{ width: '50%' }}
          />
        </Box>
      </Box>
      <Box mt={2} mb={1}>
        <Typography gutterBottom>Rating</Typography>
        <Rating
          value={localValues.rating}
          max={5}
          precision={1}
          onChange={(_, value) => handleChange('rating', value || 1)}
        />
        {errors.rating && <Typography color="error" variant="caption">{errors.rating}</Typography>}
      </Box>
      <Box mt={2}>
        <Button variant="outlined" color="primary" fullWidth onClick={handleReset}>
          Reset Filters
        </Button>
      </Box>
    </Box>
  );
};

export default ProductFilters; 