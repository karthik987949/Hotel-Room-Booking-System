import React, { useState, useEffect } from 'react';
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
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

const validationSchema = Yup.object({
  name: Yup.string().required('Room type name is required'),
  description: Yup.string().required('Description is required'),
  capacity: Yup.number().min(1).required('Capacity is required'),
  basePrice: Yup.number().min(0).required('Base price is required'),
  amenities: Yup.string(),
});

const RoomManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchRoomTypes(selectedHotel);
    }
  }, [selectedHotel]);

  const fetchHotels = async () => {
    try {
      const response = await api.get('/hotels');
      setHotels(response.data);
      if (response.data.length > 0) {
        setSelectedHotel(response.data[0].id);
      }
    } catch (error) {
      setError('Failed to fetch hotels');
    }
  };

  const fetchRoomTypes = async (hotelId) => {
    try {
      setLoading(true);
      const response = await api.get(`/hotels/${hotelId}/rooms`);
      setRoomTypes(response.data);
    } catch (error) {
      setError('Failed to fetch room types');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = () => {
    if (!selectedHotel) {
      setError('Please select a hotel first');
      return;
    }
    setEditingRoom(null);
    setDialogOpen(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setDialogOpen(true);
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room type?')) {
      try {
        await api.delete(`/hotels/admin/rooms/${roomId}`);
        setRoomTypes(roomTypes.filter(r => r.id !== roomId));
      } catch (error) {
        setError('Failed to delete room type');
      }
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Parse amenities from string to array
      const amenitiesArray = values.amenities 
        ? values.amenities.split(',').map(a => a.trim()).filter(a => a)
        : [];

      const roomData = {
        ...values,
        amenities: JSON.stringify(amenitiesArray),
      };

      let response;
      if (editingRoom) {
        response = await api.put(`/hotels/admin/rooms/${editingRoom.id}`, roomData);
        setRoomTypes(roomTypes.map(r => r.id === editingRoom.id ? response.data : r));
      } else {
        response = await api.post(`/hotels/admin/${selectedHotel}/rooms`, roomData);
        setRoomTypes([...roomTypes, response.data]);
      }

      setDialogOpen(false);
      setEditingRoom(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save room type');
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
        <Typography variant="h5">Room Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateRoom}
          disabled={!selectedHotel}
        >
          Add New Room Type
        </Button>
      </Box>

      {/* Hotel Selection */}
      <Box mb={3}>
        <FormControl fullWidth>
          <InputLabel>Select Hotel</InputLabel>
          <Select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            label="Select Hotel"
          >
            {hotels.map((hotel) => (
              <MenuItem key={hotel.id} value={hotel.id}>
                {hotel.name} - {hotel.city}, {hotel.country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {roomTypes.map((room) => (
          <Grid item xs={12} md={6} lg={4} key={room.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {room.name}
                </Typography>

                <Box display="flex" alignItems="center" mb={1}>
                  <PeopleIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2" color="text.secondary">
                    Capacity: {room.capacity} guests
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <MoneyIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2" color="text.secondary">
                    ₹{room.basePrice}/night
                  </Typography>
                </Box>

                <Typography variant="body2" paragraph>
                  {room.description?.substring(0, 100)}...
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                  {parseAmenities(room.amenities).slice(0, 3).map((amenity, index) => (
                    <Chip key={index} label={amenity} size="small" variant="outlined" />
                  ))}
                  {parseAmenities(room.amenities).length > 3 && (
                    <Chip label={`+${parseAmenities(room.amenities).length - 3} more`} size="small" />
                  )}
                </Box>
              </CardContent>

              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleEditRoom(room)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteRoom(room.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Room Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRoom ? 'Edit Room Type' : 'Add New Room Type'}
        </DialogTitle>

        <Formik
          initialValues={{
            name: editingRoom?.name || '',
            description: editingRoom?.description || '',
            capacity: editingRoom?.capacity || 1,
            basePrice: editingRoom?.basePrice || 0,
            amenities: editingRoom ? parseAmenities(editingRoom.amenities).join(', ') : '',
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
                      label="Room Type Name"
                      fullWidth
                      error={touched.name && errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="capacity"
                      label="Capacity (guests)"
                      type="number"
                      inputProps={{ min: 1 }}
                      fullWidth
                      error={touched.capacity && errors.capacity}
                      helperText={touched.capacity && errors.capacity}
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

                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      name="basePrice"
                      label="Base Price (₹ per night)"
                      type="number"
                      inputProps={{ min: 0, step: 100 }}
                      fullWidth
                      error={touched.basePrice && errors.basePrice}
                      helperText={touched.basePrice && errors.basePrice}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="amenities"
                      label="Amenities (comma-separated)"
                      placeholder="King Bed, City View, Mini Bar, WiFi"
                      fullWidth
                      error={touched.amenities && errors.amenities}
                      helperText={touched.amenities && errors.amenities}
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingRoom ? 'Update' : 'Create')}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

export default RoomManagement;