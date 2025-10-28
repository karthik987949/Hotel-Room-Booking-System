import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Rating,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

const validationSchema = Yup.object({
  name: Yup.string().required('Hotel name is required'),
  description: Yup.string().required('Description is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  country: Yup.string().required('Country is required'),
  starRating: Yup.number().min(1).max(5).required('Star rating is required'),
  latitude: Yup.number().nullable(),
  longitude: Yup.number().nullable(),
  amenities: Yup.string(),
  mainImageUrl: Yup.string().url('Must be a valid URL'),
  imageUrls: Yup.string(),
});

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await api.get('/hotels');
      setHotels(response.data);
    } catch (error) {
      setError('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHotel = () => {
    setEditingHotel(null);
    setDialogOpen(true);
  };

  const handleEditHotel = (hotel) => {
    setEditingHotel(hotel);
    setDialogOpen(true);
  };

  const handleDeleteHotel = async (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await api.delete(`/hotels/admin/${hotelId}`);
        setHotels(hotels.filter(h => h.id !== hotelId));
      } catch (error) {
        setError('Failed to delete hotel');
      }
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Parse amenities from string to array
      const amenitiesArray = values.amenities 
        ? values.amenities.split(',').map(a => a.trim()).filter(a => a)
        : [];

      const hotelData = {
        ...values,
        amenities: JSON.stringify(amenitiesArray),
      };

      let response;
      if (editingHotel) {
        response = await api.put(`/hotels/admin/${editingHotel.id}`, hotelData);
        setHotels(hotels.map(h => h.id === editingHotel.id ? response.data : h));
      } else {
        response = await api.post('/hotels/admin', hotelData);
        setHotels([...hotels, response.data]);
      }

      setDialogOpen(false);
      setEditingHotel(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save hotel');
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Hotel Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateHotel}
        >
          Add New Hotel
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {hotels.map((hotel) => (
          <Grid item xs={12} md={6} lg={4} key={hotel.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {hotel.name}
                </Typography>
                
                <Box display="flex" alignItems="center" mb={1}>
                  <Rating value={hotel.starRating || 0} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" ml={1}>
                    {hotel.starRating} Star Hotel
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <LocationIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2" color="text.secondary">
                    {hotel.city}, {hotel.country}
                  </Typography>
                </Box>

                <Typography variant="body2" paragraph>
                  {hotel.description?.substring(0, 100)}...
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                  {parseAmenities(hotel.amenities).slice(0, 3).map((amenity, index) => (
                    <Chip key={index} label={amenity} size="small" variant="outlined" />
                  ))}
                  {parseAmenities(hotel.amenities).length > 3 && (
                    <Chip label={`+${parseAmenities(hotel.amenities).length - 3} more`} size="small" />
                  )}
                </Box>
              </CardContent>

              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleEditHotel(hotel)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteHotel(hotel.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Hotel Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
        </DialogTitle>

        <Formik
          initialValues={{
            name: editingHotel?.name || '',
            description: editingHotel?.description || '',
            address: editingHotel?.address || '',
            city: editingHotel?.city || '',
            country: editingHotel?.country || '',
            starRating: editingHotel?.starRating || 1,
            latitude: editingHotel?.latitude || '',
            longitude: editingHotel?.longitude || '',
            amenities: editingHotel ? parseAmenities(editingHotel.amenities).join(', ') : '',
            mainImageUrl: editingHotel?.mainImageUrl || '',
            imageUrls: editingHotel?.imageUrls || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="name"
                      label="Hotel Name"
                      fullWidth
                      error={touched.name && errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="starRating"
                      label="Star Rating"
                      type="number"
                      inputProps={{ min: 1, max: 5 }}
                      fullWidth
                      error={touched.starRating && errors.starRating}
                      helperText={touched.starRating && errors.starRating}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="description"
                      label="Description"
                      multiline
                      rows={3}
                      fullWidth
                      error={touched.description && errors.description}
                      helperText={touched.description && errors.description}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="address"
                      label="Address"
                      fullWidth
                      error={touched.address && errors.address}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="city"
                      label="City"
                      fullWidth
                      error={touched.city && errors.city}
                      helperText={touched.city && errors.city}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="country"
                      label="Country"
                      fullWidth
                      error={touched.country && errors.country}
                      helperText={touched.country && errors.country}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="latitude"
                      label="Latitude (Optional)"
                      type="number"
                      fullWidth
                      error={touched.latitude && errors.latitude}
                      helperText={touched.latitude && errors.latitude}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="longitude"
                      label="Longitude (Optional)"
                      type="number"
                      fullWidth
                      error={touched.longitude && errors.longitude}
                      helperText={touched.longitude && errors.longitude}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="amenities"
                      label="Amenities (comma-separated)"
                      placeholder="WiFi, Pool, Gym, Spa, Restaurant"
                      fullWidth
                      error={touched.amenities && errors.amenities}
                      helperText={touched.amenities && errors.amenities}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="mainImageUrl"
                      label="Main Image URL"
                      placeholder="https://example.com/hotel-image.jpg"
                      fullWidth
                      error={touched.mainImageUrl && errors.mainImageUrl}
                      helperText={touched.mainImageUrl && errors.mainImageUrl}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="imageUrls"
                      label="Additional Image URLs (JSON format)"
                      placeholder='["https://example.com/image1.jpg", "https://example.com/image2.jpg"]'
                      fullWidth
                      error={touched.imageUrls && errors.imageUrls}
                      helperText={touched.imageUrls && errors.imageUrls}
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingHotel ? 'Update' : 'Create')}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

export default HotelManagement;