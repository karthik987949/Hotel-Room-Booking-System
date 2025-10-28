import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Hotel as HotelIcon,
  Add as AddIcon,
  Room as RoomIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import HotelManagement from '../components/admin/HotelManagement';
import RoomManagement from '../components/admin/RoomManagement';
import BookingManagement from '../components/admin/BookingManagement';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user || user.role !== 'HOTEL_ADMIN') {
      navigate('/hotels');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!isAuthenticated || !user || user.role !== 'HOTEL_ADMIN') {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          Access denied. Admin privileges required.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Welcome back, {user.firstName}! Manage your hotels and bookings.
        </Typography>

        {/* Quick Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <HotelIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      12
                    </Typography>
                    <Typography color="text.secondary">
                      Total Hotels
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <RoomIcon color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      48
                    </Typography>
                    <Typography color="text.secondary">
                      Room Types
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AssessmentIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      156
                    </Typography>
                    <Typography color="text.secondary">
                      Total Bookings
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AssessmentIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" component="div">
                      23
                    </Typography>
                    <Typography color="text.secondary">
                      Pending Bookings
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Management Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin dashboard tabs">
            <Tab label="Hotel Management" />
            <Tab label="Room Management" />
            <Tab label="Booking Management" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <HotelManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <RoomManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <BookingManagement />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default AdminDashboard;