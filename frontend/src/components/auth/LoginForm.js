import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Email,
  Lock,
  Login as LoginIcon,
  Hotel as HotelIcon,
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { login, clearError } from '../../store/authSlice';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 'HOTEL_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/hotels');
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (values) => {
    dispatch(login(values));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      sx={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        borderRadius: 4,
        p: 2,
      }}
    >
      <Card 
        elevation={0} 
        sx={{ 
          maxWidth: 450, 
          width: '100%',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Box textAlign="center" mb={4}>
            <Avatar 
              sx={{ 
                width: 64, 
                height: 64, 
                mx: 'auto', 
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <HotelIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your LuxeStay account
            </Typography>
          </Box>
        
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              bgcolor: 'info.50',
              border: '1px solid',
              borderColor: 'info.200',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              <strong>Demo Credentials:</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Admin: admin@example.com / admin123<br />
              Customer: customer@example.com / password123
            </Typography>
          </Alert>
        
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                bgcolor: 'error.50',
                border: '1px solid',
                borderColor: 'error.200',
              }}
            >
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, handleChange, handleBlur }) => (
              <Form>
                <Field
                  as={TextField}
                  name="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                  helperText={touched.email && errors.email}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              
                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
                  helperText={touched.password && errors.password}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
                  disabled={isLoading}
                  sx={{ 
                    mt: 4, 
                    mb: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    }
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Form>
            )}
          </Formik>

          <Divider sx={{ my: 3 }} />

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{ 
                  textDecoration: 'none',
                  color: '#667eea',
                  fontWeight: 600,
                }}
              >
                Create Account
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;