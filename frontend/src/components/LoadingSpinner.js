import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center" 
    minHeight="200px"
  >
    <CircularProgress />
    <Typography sx={{ mt: 2 }}>{message}</Typography>
  </Box>
);

export default LoadingSpinner;