import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { register, clearError } from '../../store/authSlice';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  phone: Yup.string(),
});

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (values) => {
    const { confirmPassword, ...userData } = values;
    dispatch(register(userData));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange, handleBlur }) => (
            <Form>
              <Box display="flex" gap={2}>
                <Field
                  as={TextField}
                  name="firstName"
                  label="First Name"
                  fullWidth
                  margin="normal"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstName && errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                  disabled={isLoading}
                />
                
                <Field
                  as={TextField}
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastName && errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                  disabled={isLoading}
                />
              </Box>

              <Field
                as={TextField}
                name="email"
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                helperText={touched.email && errors.email}
                disabled={isLoading}
              />

              <Field
                as={TextField}
                name="phone"
                label="Phone (Optional)"
                fullWidth
                margin="normal"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && errors.phone}
                helperText={touched.phone && errors.phone}
                disabled={isLoading}
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
              />

              <Field
                as={TextField}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
                disabled={isLoading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Register'}
              </Button>
            </Form>
          )}
        </Formik>

        <Box textAlign="center">
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none' }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterForm;