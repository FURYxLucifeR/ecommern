import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField } from 'formik-mui';
import { Box, Button, Paper, Typography } from '@mui/material';

const ProductSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
  description: Yup.string().required('Description is required'),
  images: Yup.string().required('At least one image URL is required'),
  stock: Yup.number().min(0, 'Stock must be positive').required('Stock is required'),
  category: Yup.string().required('Category is required'),
});

interface ProductFormProps {
  initialValues?: {
    name: string;
    price: number;
    description: string;
    images: string;
    stock: number;
    category: string;
  };
  onSubmit: (values: any, helpers: any) => void;
  isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialValues, onSubmit, isEdit }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Product' : 'Add Product'}
      </Typography>
      <Formik
        initialValues={
          initialValues || {
            name: '',
            price: 0,
            description: '',
            images: '',
            stock: 0,
            category: '',
          }
        }
        validationSchema={ProductSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mb={2}>
              <Field component={TextField} name="name" label="Name" fullWidth />
            </Box>
            <Box mb={2}>
              <Field component={TextField} name="price" label="Price" type="number" fullWidth />
            </Box>
            <Box mb={2}>
              <Field component={TextField} name="description" label="Description" fullWidth />
            </Box>
            <Box mb={2}>
              <Field component={TextField} name="images" label="Image URLs (comma separated)" fullWidth />
            </Box>
            <Box mb={2}>
              <Field component={TextField} name="stock" label="Stock" type="number" fullWidth />
            </Box>
            <Box mb={2}>
              <Field component={TextField} name="category" label="Category" fullWidth />
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
              {isEdit ? 'Update Product' : 'Add Product'}
            </Button>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default ProductForm; 