import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async thunks
export const searchHotels = createAsyncThunk(
  'hotels/searchHotels',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/hotels/search', { params: searchParams });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const getHotelById = createAsyncThunk(
  'hotels/getHotelById',
  async (hotelId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/hotels/${hotelId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get hotel details');
    }
  }
);

export const getAllHotels = createAsyncThunk(
  'hotels/getAllHotels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/hotels');
      return {
        hotels: response.data,
        currentPage: 0,
        totalPages: 1,
        totalItems: response.data.length,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get hotels');
    }
  }
);

export const getHotelRooms = createAsyncThunk(
  'hotels/getHotelRooms',
  async ({ hotelId, checkInDate, checkOutDate, guestCount }, { rejectWithValue }) => {
    try {
      const params = {};
      if (checkInDate) params.checkInDate = checkInDate;
      if (checkOutDate) params.checkOutDate = checkOutDate;
      if (guestCount) params.guestCount = guestCount;
      
      const response = await api.get(`/hotels/${hotelId}/rooms`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get room types');
    }
  }
);

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: {
    searchResults: {
      hotels: [],
      currentPage: 0,
      totalPages: 0,
      totalItems: 0,
    },
    selectedHotel: null,
    hotelRooms: [],
    searchParams: {
      city: '',
      country: '',
      checkInDate: '',
      checkOutDate: '',
      guestCount: 1,
      starRating: null,
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    setSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    clearSearchResults: (state) => {
      state.searchResults = {
        hotels: [],
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
      };
    },
    clearSelectedHotel: (state) => {
      state.selectedHotel = null;
      state.hotelRooms = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Hotels
      .addCase(getAllHotels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(getAllHotels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Search Hotels
      .addCase(searchHotels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchHotels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Hotel By ID
      .addCase(getHotelById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getHotelById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedHotel = action.payload;
        state.error = null;
      })
      .addCase(getHotelById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Hotel Rooms
      .addCase(getHotelRooms.fulfilled, (state, action) => {
        state.hotelRooms = action.payload;
      });
  },
});

export const { setSearchParams, clearSearchResults, clearSelectedHotel, clearError } = hotelSlice.actions;
export default hotelSlice.reducer;