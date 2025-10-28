import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card,
  Chip,
  Avatar
} from '@mui/material';
import { 
  Hotel, 
  Search, 
  Verified,
  Support,
  Dashboard
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const featuredDestinations = [
    { name: 'Mumbai', hotels: '25+ Hotels', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400' },
    { name: 'Goa', hotels: '15+ Hotels', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400' },
    { name: 'Udaipur', hotels: '12+ Hotels', image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400' },
    { name: 'Agra', hotels: '8+ Hotels', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: 4,
          p: { xs: 4, md: 8 },
          textAlign: 'center',
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
            borderRadius: 4,
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Chip 
            label="✨ Discover India's Finest Hotels" 
            sx={{ 
              mb: 3, 
              bgcolor: 'primary.main', 
              color: 'white',
              fontWeight: 600,
              px: 2
            }} 
          />
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Welcome to LuxeStay
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            paragraph 
            sx={{ 
              mb: 4, 
              maxWidth: 600, 
              mx: 'auto',
              lineHeight: 1.4,
              fontWeight: 400
            }}
          >
            Discover exceptional hotels across India's most beautiful destinations. 
            From luxury palaces to boutique stays, create unforgettable memories.
          </Typography>
          
          {isAuthenticated ? (
            user?.role === 'HOTEL_ADMIN' ? (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/admin')}
                sx={{ 
                  mt: 2, 
                  px: 6, 
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'translateY(-2px)',
                  }
                }}
                startIcon={<Dashboard />}
              >
                Go to Admin Dashboard
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/hotels')}
                sx={{ 
                  mt: 2, 
                  px: 6, 
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    transform: 'translateY(-2px)',
                  }
                }}
                startIcon={<Search />}
              >
                Explore Hotels Now
              </Button>
            )
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
                Join thousands of travelers who trust LuxeStay
              </Typography>
              <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    }
                  }}
                >
                  Create Account
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Featured Destinations - Only show for customers */}
      {(!isAuthenticated || user?.role !== 'HOTEL_ADMIN') && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
            Popular Destinations
          </Typography>
          <Grid container spacing={3}>
            {featuredDestinations.map((destination, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    }
                  }}
                  onClick={() => navigate('/hotels')}
                >
                  <Box
                    sx={{
                      height: 200,
                      backgroundImage: `url(${destination.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        color: 'white',
                        p: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {destination.name}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {destination.hotels}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
          {user?.role === 'HOTEL_ADMIN' ? 'Admin Features' : 'Why Choose LuxeStay?'}
        </Typography>
        <Grid container spacing={4}>
          {user?.role === 'HOTEL_ADMIN' ? (
            // Admin-specific features
            <>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 4, textAlign: 'center', height: '100%', border: '1px solid', borderColor: 'divider' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                    <Hotel sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Hotel Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Manage your hotel listings, update information, add amenities, and control 
                    availability across all your properties.
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 4, textAlign: 'center', height: '100%', border: '1px solid', borderColor: 'divider' }}>
                  <Avatar sx={{ bgcolor: 'success.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                    <Dashboard sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Booking Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Track bookings, monitor occupancy rates, and analyze performance 
                    with comprehensive dashboard insights.
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 4, textAlign: 'center', height: '100%', border: '1px solid', borderColor: 'divider' }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                    <Support sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Customer Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    View and manage customer bookings, handle special requests, 
                    and provide exceptional service to your guests.
                  </Typography>
                </Card>
              </Grid>
            </>
          ) : (
            // Customer features
            <>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 4, textAlign: 'center', height: '100%', border: '1px solid', borderColor: 'divider' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                    <Hotel sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Curated Hotels
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Hand-picked luxury and boutique hotels across India's most beautiful destinations, 
                    ensuring quality and comfort for every stay.
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 4, textAlign: 'center', height: '100%', border: '1px solid', borderColor: 'divider' }}>
                  <Avatar sx={{ bgcolor: 'success.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                    <Verified sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Secure & Trusted
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Your bookings and personal information are protected with bank-level security. 
                    Book with confidence and peace of mind.
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 4, textAlign: 'center', height: '100%', border: '1px solid', borderColor: 'divider' }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                    <Support sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    24/7 Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Our dedicated support team is available round the clock to assist you 
                    with bookings, changes, and any travel needs.
                  </Typography>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      {/* Stats Section */}
      <Card 
        sx={{ 
          p: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Trusted by Travelers Across India
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              15+
            </Typography>
            <Typography variant="body1">
              Premium Hotels
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              10+
            </Typography>
            <Typography variant="body1">
              Cities Covered
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              100%
            </Typography>
            <Typography variant="body1">
              Secure Bookings
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default Home;