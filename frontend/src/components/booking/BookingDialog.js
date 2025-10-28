import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material';
import { 
  CalendarToday, 
  Person, 
  CurrencyRupee,
  Hotel as HotelIcon,
  CheckCircle
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { createBooking, clearError, clearBookingSuccess } from '../../store/bookingSlice';

const validationSchema = Yup.object({
  specialRequests: Yup.string().max(500, 'Special requests must be less than 500 characters'),
});

const BookingDialog = ({ open, onClose, hotel }) => {
  const dispatch = useDispatch();
  const { isLoading, error, bookingSuccess } = useSelector((state) => state.bookings);
  const { searchParams } = useSelector((state) => state.hotels);
  const [roomTypeId] = useState(1); // Default room type - in a real app, this would be selected
  const [totalAmount, setTotalAmount] = useState(0);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [pricePerNight, setPricePerNight] = useState(0);

  // Calculate booking details
  useEffect(() => {
    if (searchParams.checkInDate && searchParams.checkOutDate && hotel) {
      const checkIn = new Date(searchParams.checkInDate);
      const checkOut = new Date(searchParams.checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      
      // Calculate price per night based on hotel star rating
      const basePrices = {
        5: 15000, // 5-star hotels
        4: 8000,  // 4-star hotels
        3: 5000,  // 3-star hotels
      };
      const basePrice = basePrices[hotel.starRating] || 8000;
      
      // Add some variation based on hotel ID for different pricing
      const priceVariation = (hotel.id % 3) * 2000;
      const finalPricePerNight = basePrice + priceVariation;
      
      const subtotal = finalPricePerNight * nights;
      const taxes = subtotal * 0.18; // 18% GST
      const total = subtotal + taxes;
      
      setNumberOfNights(nights);
      setPricePerNight(finalPricePerNight);
      setTotalAmount(total);
    }
  }, [searchParams.checkInDate, searchParams.checkOutDate, hotel]);

  const handleSubmit = async (values) => {
    const bookingData = {
      hotelId: hotel.id,
      roomTypeId: roomTypeId,
      checkInDate: searchParams.checkInDate,
      checkOutDate: searchParams.checkOutDate,
      guestCount: searchParams.guestCount || 1,
      specialRequests: values.specialRequests || '',
    };

    const result = await dispatch(createBooking(bookingData));
    if (result.type === 'bookings/createBooking/fulfilled') {
      setTimeout(() => {
        onClose();
        dispatch(clearBookingSuccess());
      }, 2000);
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    dispatch(clearBookingSuccess());
    onClose();
  };

  if (!hotel) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <HotelIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Complete Your Booking
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          {hotel.name} • {hotel.city}, {hotel.country}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        {!searchParams.checkInDate || !searchParams.checkOutDate ? (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            Please search for hotels with check-in and check-out dates first before booking.
          </Alert>
        ) : null}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error === 'Booking failed' ? 'Please make sure you are logged in and try again.' : error}
          </Alert>
        )}

        {bookingSuccess && (
          <Alert 
            severity="success" 
            sx={{ mb: 3, borderRadius: 2 }}
            icon={<CheckCircle />}
          >
            Booking created successfully! You will be redirected shortly.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Booking Details Card */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Booking Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <CalendarToday sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Check-in
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {searchParams.checkInDate ? 
                            new Date(searchParams.checkInDate).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 'Not selected'
                          }
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <CalendarToday sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Check-out
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {searchParams.checkOutDate ? 
                            new Date(searchParams.checkOutDate).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 'Not selected'
                          }
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Person sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Guests
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {searchParams.guestCount || 1} {(searchParams.guestCount || 1) === 1 ? 'Guest' : 'Guests'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Duration
                        </Typography>
                        <Chip 
                          label={`${numberOfNights} ${numberOfNights === 1 ? 'Night' : 'Nights'}`}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Formik
                  initialValues={{
                    specialRequests: '',
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <Box mt={3}>
                        <Field
                          as={TextField}
                          name="specialRequests"
                          label="Special Requests (Optional)"
                          multiline
                          rows={3}
                          fullWidth
                          placeholder="Any special requests or preferences (early check-in, room preferences, etc.)"
                          error={touched.specialRequests && errors.specialRequests}
                          helperText={touched.specialRequests && errors.specialRequests}
                          disabled={isLoading}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Box>

                      <DialogActions sx={{ mt: 4, px: 0, gap: 2 }}>
                        <Button 
                          onClick={handleClose} 
                          disabled={isLoading}
                          sx={{ borderRadius: 2, px: 3 }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={isLoading || bookingSuccess || !searchParams.checkInDate || !searchParams.checkOutDate}
                          startIcon={isLoading ? <CircularProgress size={20} /> : null}
                          sx={{ 
                            borderRadius: 2, 
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                            }
                          }}
                        >
                          {isLoading ? 'Processing...' : `Confirm Booking • ₹${totalAmount.toLocaleString('en-IN')}`}
                        </Button>
                      </DialogActions>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </Grid>

          {/* Price Breakdown Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, border: '2px solid', borderColor: 'primary.light' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Price Breakdown
                </Typography>
                
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">
                      ₹{pricePerNight.toLocaleString('en-IN')} × {numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'}
                    </Typography>
                    <Typography variant="body2">
                      ₹{(pricePerNight * numberOfNights).toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Taxes & Fees (18% GST)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{(pricePerNight * numberOfNights * 0.18).toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total Amount
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <CurrencyRupee sx={{ fontSize: 20, color: 'success.main' }} />
                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 700 }}>
                      {totalAmount.toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Includes all taxes and fees
                </Typography>

                <Box mt={3} p={2} sx={{ bgcolor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.200' }}>
                  <Typography variant="body2" color="success.dark" sx={{ fontWeight: 500 }}>
                    ✓ Free cancellation up to 24 hours before check-in
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;