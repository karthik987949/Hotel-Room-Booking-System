import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Box,
  Card,
  CardContent,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  CalendarToday,
  Person,
  Star,
  TravelExplore,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { searchHotels, setSearchParams } from '../../store/hotelSlice';

const validationSchema = Yup.object({
  city: Yup.string().required('City is required'),
  checkInDate: Yup.date().required('Check-in date is required'),
  checkOutDate: Yup.date()
    .required('Check-out date is required')
    .min(Yup.ref('checkInDate'), 'Check-out date must be after check-in date'),
  guestCount: Yup.number().min(1, 'At least 1 guest required').required('Guest count is required'),
});

const SearchForm = () => {
  const dispatch = useDispatch();
  const { searchParams, isLoading } = useSelector((state) => state.hotels);

  const handleSubmit = (values) => {
    const searchData = {
      ...values,
      checkInDate: values.checkInDate ? values.checkInDate.toISOString().split('T')[0] : null,
      checkOutDate: values.checkOutDate ? values.checkOutDate.toISOString().split('T')[0] : null,
    };
    
    dispatch(setSearchParams(searchData));
    dispatch(searchHotels(searchData));
  };

  const popularCities = ['Mumbai', 'Goa', 'Udaipur', 'Agra', 'Srinagar', 'Hyderabad', 'Bangalore', 'Tirupati'];

  return (
    <Card 
      elevation={0} 
      sx={{ 
        mb: 4,
        border: '2px solid',
        borderColor: 'primary.light',
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <TravelExplore sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Find Your Perfect Stay
          </Typography>
        </Box>

        {/* Popular Cities */}
        <Box mb={3}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Popular destinations:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {popularCities.map((city) => (
              <Chip
                key={city}
                label={city}
                size="small"
                variant="outlined"
                clickable
                sx={{ 
                  '&:hover': { 
                    bgcolor: 'primary.light', 
                    color: 'white',
                    borderColor: 'primary.light'
                  } 
                }}
              />
            ))}
          </Box>
        </Box>
        
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Formik
            initialValues={{
              city: searchParams.city || '',
              country: searchParams.country || '',
              checkInDate: searchParams.checkInDate ? new Date(searchParams.checkInDate) : null,
              checkOutDate: searchParams.checkOutDate ? new Date(searchParams.checkOutDate) : null,
              guestCount: searchParams.guestCount || 1,
              starRating: searchParams.starRating || '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="city"
                      label="Destination City"
                      fullWidth
                      error={touched.city && errors.city}
                      helperText={touched.city && errors.city}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="country"
                      label="Country (Optional)"
                      fullWidth
                      disabled={isLoading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Check-in Date"
                      value={values.checkInDate}
                      onChange={(date) => setFieldValue('checkInDate', date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={touched.checkInDate && errors.checkInDate}
                          helperText={touched.checkInDate && errors.checkInDate}
                          disabled={isLoading}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday color="action" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      )}
                      minDate={new Date()}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Check-out Date"
                      value={values.checkOutDate}
                      onChange={(date) => setFieldValue('checkOutDate', date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={touched.checkOutDate && errors.checkOutDate}
                          helperText={touched.checkOutDate && errors.checkOutDate}
                          disabled={isLoading}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday color="action" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      )}
                      minDate={values.checkInDate || new Date()}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Field
                      as={TextField}
                      name="guestCount"
                      label="Guests"
                      type="number"
                      fullWidth
                      inputProps={{ min: 1, max: 10 }}
                      error={touched.guestCount && errors.guestCount}
                      helperText={touched.guestCount && errors.guestCount}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="starRating"
                      label="Minimum Star Rating"
                      select
                      fullWidth
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Star color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      <MenuItem value="">Any Rating</MenuItem>
                      <MenuItem value={3}>3+ Stars</MenuItem>
                      <MenuItem value={4}>4+ Stars</MenuItem>
                      <MenuItem value={5}>5 Stars Only</MenuItem>
                    </Field>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={isLoading}
                      startIcon={<SearchIcon />}
                      sx={{ 
                        py: 2,
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          transform: 'translateY(-1px)',
                        }
                      }}
                    >
                      {isLoading ? 'Searching...' : 'Search Hotels'}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </LocalizationProvider>
      </CardContent>
    </Card>
  );
};

export default SearchForm;