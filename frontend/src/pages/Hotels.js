import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Typography, Box } from '@mui/material';
import SearchForm from '../components/hotels/SearchForm';
import HotelList from '../components/hotels/HotelList';
import { getAllHotels } from '../store/hotelSlice';

const Hotels = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load all hotels when component mounts (only accessible after login)
    dispatch(getAllHotels());
  }, [dispatch]);

  return (
    <Container maxWidth="lg">
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Find Your Perfect Hotel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search and book from our collection of premium hotels
        </Typography>
      </Box>
      <SearchForm />
      <HotelList />
    </Container>
  );
};

export default Hotels;