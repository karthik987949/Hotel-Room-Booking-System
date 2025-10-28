import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Alert,
  Pagination,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Snackbar,
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList,
  Hotel as HotelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import HotelCard from './HotelCard';
import webSocketService from '../../services/websocket';
import { searchHotels } from '../../store/hotelSlice';

const HotelList = () => {
  const dispatch = useDispatch();
  const { searchResults, isLoading, error } = useSelector((state) => state.hotels);
  const { hotels, currentPage, totalPages, totalItems } = searchResults;

  // WebSocket for real-time updates
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        await webSocketService.connect();
        
        // Subscribe to hotel updates
        webSocketService.subscribeToHotelUpdates((notification) => {
          console.log('Hotel updated:', notification);
          // Refresh hotel list when updates occur
          dispatch(searchHotels({}));
        });

        // Subscribe to price updates
        webSocketService.subscribeToPriceUpdates((notification) => {
          console.log('Price updated:', notification);
          // Refresh hotel list when prices change
          dispatch(searchHotels({}));
        });

        // Subscribe to image updates
        webSocketService.subscribeToImageUpdates((notification) => {
          console.log('Image updated:', notification);
          // Refresh hotel list when images change
          dispatch(searchHotels({}));
        });

      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <SearchIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Searching Hotels...
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card>
                <Skeleton variant="rectangular" height={240} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} width="60%" />
                  <Skeleton variant="text" height={20} width="80%" />
                  <Box mt={2}>
                    <Skeleton variant="rectangular" height={36} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          '& .MuiAlert-message': {
            fontSize: '1rem'
          }
        }}
      >
        {error}
      </Alert>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <Card sx={{ textAlign: 'center', py: 6, borderRadius: 3 }}>
        <CardContent>
          <HotelIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            No Hotels Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We couldn't find any hotels matching your search criteria.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search for a different destination.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center">
          <SearchIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Search Results
          </Typography>
          <Chip 
            label={`${totalItems} ${totalItems === 1 ? 'hotel' : 'hotels'} found`}
            color="primary"
            variant="outlined"
            sx={{ ml: 2 }}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <FilterList sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Sorted by relevance
          </Typography>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {hotels.map((hotel) => (
          <Grid item xs={12} sm={6} lg={4} key={hotel.id}>
            <HotelCard hotel={hotel} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={6}>
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={(_, page) => {
              // Handle pagination - would need to implement in Redux
              console.log('Page changed to:', page);
            }}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 2,
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default HotelList;