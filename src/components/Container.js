import React from 'react';
import { Container as MuiContainer, Box } from '@mui/material';

// A custom Container component that ensures full-width layouts
const Container = ({ children, maxWidth = 'xl', ...props }) => {
  return (
    <MuiContainer 
      maxWidth={maxWidth} 
      sx={{ 
        width: '100%',
        px: { xs: 1, sm: 2, md: 3 },
        ...props.sx 
      }}
      {...props}
    >
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        {children}
      </Box>
    </MuiContainer>
  );
};

export default Container; 