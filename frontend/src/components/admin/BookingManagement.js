import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Hotel as HotelIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // For now, we'll get all bookings. In a real app, you'd have an admin endpoint
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      case 'COMPLETED':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredBookings = bookings.filter(booking => 
    statusFilter === 'ALL' || booking.status === statusFilter
  );

  const bookingStats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Booking Management
      </Typography>

      {/* Booking Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{bookingStats.total}</Typography>
                  <Typography color="text.secondary">Total Bookings</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{bookingStats.confirmed}</Typography>
                  <Typography color="text.secondary">Confirmed</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarIcon color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{bookingStats.pending}</Typography>
                  <Typography color="text.secondary">Pending</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarIcon color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{bookingStats.cancelled}</Typography>
                  <Typography color="text.secondary">Cancelled</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter */}
      <Box mb={3}>
        <TextField
          select
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="ALL">All Bookings</MenuItem>
          <MenuItem value="CONFIRMED">Confirmed</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="CANCELLED">Cancelled</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
        </TextField>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Bookings Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Confirmation #</TableCell>
              <TableCell>Guest</TableCell>
              <TableCell>Hotel</TableCell>
              <TableCell>Room Type</TableCell>
              <TableCell>Check-in</TableCell>
              <TableCell>Check-out</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {booking.confirmationNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
                    <Box>
                      <Typography variant="body2">
                        {booking.user?.firstName} {booking.user?.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.user?.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <HotelIcon sx={{ mr: 1, fontSize: 16 }} />
                    <Box>
                      <Typography variant="body2">
                        {booking.hotel?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.hotel?.city}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {booking.roomType?.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {booking.guestCount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    ₹{booking.totalAmount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredBookings.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">
            No bookings found for the selected filter.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BookingManagement;