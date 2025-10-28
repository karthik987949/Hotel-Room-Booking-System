import { Box, Typography, Container, Grid, Link, IconButton } from '@mui/material';
import { 
  Hotel as HotelIcon,
  Phone,
  Email,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        background: 'linear-gradient(135deg, #2E3B55 0%, #1A202C 100%)',
        color: 'white', 
        py: 6, 
        mt: 'auto' 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <HotelIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                LuxeStay
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8, lineHeight: 1.6 }}>
              Discover exceptional hotels across India with LuxeStay. From luxury palaces to boutique stays, 
              we bring you the finest accommodations for unforgettable experiences.
            </Typography>
            <Box display="flex" gap={1}>
              <IconButton size="small" sx={{ color: 'white', '&:hover': { color: 'primary.light' } }}>
                <Facebook />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', '&:hover': { color: 'primary.light' } }}>
                <Twitter />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', '&:hover': { color: 'primary.light' } }}>
                <Instagram />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', '&:hover': { color: 'primary.light' } }}>
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/hotels" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Browse Hotels
              </Link>
              <Link href="/destinations" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Destinations
              </Link>
              <Link href="/offers" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Special Offers
              </Link>
              <Link href="/about" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                About Us
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Support
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/help" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Help Center
              </Link>
              <Link href="/contact" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Contact Us
              </Link>
              <Link href="/cancellation" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Cancellation Policy
              </Link>
              <Link href="/terms" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                Terms & Conditions
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Contact Info
            </Typography>
            <Box display="flex" flexDirection="column" gap={1.5}>
              <Box display="flex" alignItems="center">
                <Phone sx={{ mr: 1, fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +91 1800-123-4567
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Email sx={{ mr: 1, fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  support@luxestay.com
                </Typography>
              </Box>
              <Box display="flex" alignItems="flex-start">
                <LocationOn sx={{ mr: 1, fontSize: 18, opacity: 0.8, mt: 0.2 }} />
                <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.4 }}>
                  123 Business District,<br />
                  Mumbai, Maharashtra 400001
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box 
          sx={{ 
            borderTop: '1px solid rgba(255,255,255,0.1)', 
            mt: 4, 
            pt: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 LuxeStay. All rights reserved.
          </Typography>
          <Box display="flex" gap={3}>
            <Link href="/privacy" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
              Privacy Policy
            </Link>
            <Link href="/cookies" color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;