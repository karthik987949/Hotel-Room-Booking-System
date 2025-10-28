import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  Badge,
} from '@mui/material';
import { 
  LocationOn, 
  CurrencyRupee, 
  Star,
  Wifi,
  Pool,
  Restaurant,
  LocalParking
} from '@mui/icons-material';

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();

  // Safety check for hotel data
  if (!hotel) {
    return null;
  }

  const handleViewDetails = () => {
    navigate(`/hotels/${hotel.id}`);
  };

  const parseAmenities = (amenitiesData) => {
    if (!amenitiesData) return [];
    
    // If it's already an array, return it
    if (Array.isArray(amenitiesData)) {
      return amenitiesData;
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof amenitiesData === 'string') {
      try {
        const parsed = JSON.parse(amenitiesData);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // If JSON parsing fails, treat it as a single amenity
        return [amenitiesData];
      }
    }
    
    return [];
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi')) return <Wifi sx={{ fontSize: 16 }} />;
    if (amenityLower.includes('pool')) return <Pool sx={{ fontSize: 16 }} />;
    if (amenityLower.includes('restaurant') || amenityLower.includes('dining')) return <Restaurant sx={{ fontSize: 16 }} />;
    if (amenityLower.includes('parking')) return <LocalParking sx={{ fontSize: 16 }} />;
    return null;
  };

  // Get minimum price from hotel's room types (mock data for now)
  const getMinPrice = () => {
    // This would typically come from the hotel's room types
    const basePrices = {
      5: 15000, // 5-star hotels
      4: 8000,  // 4-star hotels
      3: 5000,  // 3-star hotels
    };
    return basePrices[hotel.starRating] || 8000;
  };

  const amenities = parseAmenities(hotel?.amenities);
  const minPrice = getMinPrice();

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
      }}
      onClick={handleViewDetails}
    >
      {hotel.starRating === 5 && (
        <Badge
          badgeContent="Luxury"
          color="secondary"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
            '& .MuiBadge-badge': {
              borderRadius: 1,
              px: 1,
              fontSize: '0.75rem',
              fontWeight: 600,
            }
          }}
        />
      )}
      
      <CardMedia
        component="img"
        height="240"
        image={hotel.mainImageUrl || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format`}
        alt={hotel.name}
        onError={(e) => {
          e.target.src = `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format`;
        }}
        sx={{ 
          objectFit: 'cover',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          }
        }}
      />
      
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {hotel.name || 'Hotel Name'}
          </Typography>
          <Box display="flex" alignItems="center">
            <Star sx={{ color: '#FFD700', fontSize: 18, mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {hotel.starRating || 0}
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" alignItems="center" mb={2}>
          <LocationOn sx={{ color: 'text.secondary', fontSize: 18, mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {hotel.city || 'City'}, {hotel.country || 'Country'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <Rating 
            value={hotel.starRating || 0} 
            readOnly 
            size="small"
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            ({hotel.starRating || 0} Star Hotel)
          </Typography>
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
          }}
        >
          {hotel.description || 'Luxury accommodation with world-class amenities and exceptional service.'}
        </Typography>

        {amenities.length > 0 && (
          <Box mb={2}>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {amenities.slice(0, 4).map((amenity, index) => (
                <Chip
                  key={index}
                  icon={getAmenityIcon(amenity)}
                  label={amenity}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.75rem',
                    height: 24,
                    '& .MuiChip-icon': {
                      fontSize: 14,
                    }
                  }}
                />
              ))}
              {amenities.length > 4 && (
                <Chip
                  label={`+${amenities.length - 4}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: 24 }}
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
      
      <Box sx={{ p: 3, pt: 0 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Box display="flex" alignItems="center">
              <CurrencyRupee sx={{ fontSize: 18, color: 'success.main', mr: 0.5 }} />
              <Typography variant="h6" color="success.main" sx={{ fontWeight: 700 }}>
                {minPrice.toLocaleString('en-IN')}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              per night (incl. taxes)
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="medium"
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-1px)',
              }
            }}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default HotelCard;