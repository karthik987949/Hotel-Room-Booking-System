import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Rating,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { LocationOn, ArrowBack } from '@mui/icons-material';
import { getHotelById, clearSelectedHotel } from '../store/hotelSlice';
import BookingDialog from '../components/booking/BookingDialog';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedHotel, isLoading, error } = useSelector((state) => state.hotels);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getHotelById(id));
    }
    
    return () => {
      dispatch(clearSelectedHotel());
    };
  }, [dispatch, id]);

  const parseAmenities = (amenitiesData) => {
    if (!amenitiesData) return [];
    
    if (Array.isArray(amenitiesData)) {
      return amenitiesData;
    }
    
    if (typeof amenitiesData === 'string') {
      try {
        const parsed = JSON.parse(amenitiesData);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [amenitiesData];
      }
    }
    
    return [];
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
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/hotels')}
          variant="outlined"
        >
          Back to Hotels
        </Button>
      </Container>
    );
  }

  if (!selectedHotel) {
    return (
      <Container maxWidth="lg">
        <Alert severity="info" sx={{ mb: 2 }}>
          Hotel not found
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/hotels')}
          variant="outlined"
        >
          Back to Hotels
        </Button>
      </Container>
    );
  }

  const amenities = parseAmenities(selectedHotel.amenities);

  return (
    <Container maxWidth="lg">
      <Box mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/hotels')}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Back to Hotels
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h3" component="h1" gutterBottom>
              {selectedHotel.name}
            </Typography>
            
            <Box display="flex" alignItems="center" mb={2}>
              <LocationOn color="action" sx={{ mr: 1 }} />
              <Typography variant="h6" color="text.secondary">
                {selectedHotel.fullAddress || `${selectedHotel.address}, ${selectedHotel.city}, ${selectedHotel.country}`}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={3}>
              <Rating value={selectedHotel.starRating || 0} readOnly size="large" />
              <Typography variant="h6" color="text.secondary" ml={2}>
                {selectedHotel.starRating} Star Hotel
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>
              About This Hotel
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
              {selectedHotel.description}
            </Typography>
          </Grid>

          {amenities.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" gutterBottom>
                Amenities & Services
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {amenities.map((amenity, index) => (
                  <Chip
                    key={index}
                    label={amenity}
                    variant="outlined"
                    size="medium"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>
              Location Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Address:</strong> {selectedHotel.address}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>City:</strong> {selectedHotel.city}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Country:</strong> {selectedHotel.country}
                </Typography>
              </Grid>
              {selectedHotel.latitude && selectedHotel.longitude && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Coordinates:</strong> {selectedHotel.latitude}, {selectedHotel.longitude}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2} mt={3}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setBookingDialogOpen(true)}
              >
                Book Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/hotels')}
              >
                View Other Hotels
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <BookingDialog
        open={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        hotel={selectedHotel}
      />
    </Container>
  );
};

export default HotelDetails;