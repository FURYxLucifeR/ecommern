// components/LoadingFallback.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingFallback: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        textAlign: 'center',
      }}
    >
      <CircularProgress size={60} color="primary" />
      <Typography sx={{ mt: 2 }} variant="h6" color="text.secondary">
        Loading ...
      </Typography>
    </Box>
  );
};

export default LoadingFallback;
