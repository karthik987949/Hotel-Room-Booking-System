import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async thunks
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Booking failed');
    }
  }
);

export const getMyBookings = createAsyncThunk(
  'bookings/getMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get bookings');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data.booking; // Backend returns { message, booking }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    currentBooking: null,
    isLoading: false,
    error: null,
    bookingSuccess: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBookingSuccess: (state) => {
      state.bookingSuccess = false;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.bookingSuccess = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBooking = action.payload;
        state.bookingSuccess = true;
        state.error = null;
        // Add to bookings list if it exists
        if (state.bookings) {
          state.bookings.unshift(action.payload);
        }
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.bookingSuccess = false;
      })
      // Get My Bookings
      .addCase(getMyBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel Booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const updatedBooking = action.payload;
        const index = state.bookings.findIndex(b => b.id === updatedBooking.id);
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
      });
  },
});

export const { clearError, clearBookingSuccess, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;