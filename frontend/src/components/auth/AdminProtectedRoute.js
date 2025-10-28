import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Avatar } from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'HOTEL_ADMIN') {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Card sx={{ maxWidth: 400, textAlign: 'center', p: 3 }}>
          <CardContent>
            <Avatar 
              sx={{ 
                width: 64, 
                height: 64, 
                mx: 'auto', 
                mb: 2,
                bgcolor: 'error.main'
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Access Denied
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This page is only accessible to hotel administrators.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return children;
};

export default AdminProtectedRoute;