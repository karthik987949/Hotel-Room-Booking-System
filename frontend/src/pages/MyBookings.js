import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { 
  Hotel, 
  CalendarToday, 
  People, 
  LocationOn,
  Cancel as CancelIcon 
} from '@mui/icons-material';
import { getMyBookings, cancelBooking } from '../store/bookingSlice';

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelBooking(bookingId));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Bookings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your hotel reservations and view booking history
        </Typography>
      </Box>

      {!bookings || bookings.length === 0 ? (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
          <Hotel sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Bookings Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't made any bookings yet. Start exploring our hotels to make your first reservation!
          </Typography>
          <Button variant="contained" href="/hotels">
            Browse Hotels
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} key={booking.id}>
              <Card elevation={2}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Hotel color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          {booking.hotel?.name || 'Hotel Name'}
                        </Typography>
                        <Chip
                          label={booking.status || 'Pending'}
                          color={getStatusColor(booking.status)}
                          size="small"
                          sx={{ ml: 2 }}
                        />
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationOn color="action" sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {booking.hotel?.city}, {booking.hotel?.country}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <CalendarToday color="action" sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                          ({calculateNights(booking.checkInDate, booking.checkOutDate)} nights)
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={2}>
                        <People color="action" sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {booking.guests || booking.guestCount} Guest(s)
                        </Typography>
                      </Box>

                      {booking.specialRequests && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Special Requests:</strong> {booking.specialRequests}
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box textAlign={{ xs: 'left', md: 'right' }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                          ${booking.totalAmount || '299.00'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Confirmation: {booking.confirmationNumber || booking.id}
                        </Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box display="flex" gap={1} flexDirection={{ xs: 'row', md: 'column' }}>
                          {booking.status?.toLowerCase() === 'confirmed' && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<CancelIcon />}
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              Cancel
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            href={`/hotels/${booking.hotel?.id || booking.hotelId}`}
                          >
                            View Hotel
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyBookings;