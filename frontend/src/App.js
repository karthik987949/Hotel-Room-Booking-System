import { Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ChatBot from './components/chatbot/ChatBot';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import CustomerProtectedRoute from './components/auth/CustomerProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Header />
      <Container 
        component="main" 
        maxWidth="xl"
        sx={{ 
          flexGrow: 1,
          py: { xs: 2, md: 4 },
          px: { xs: 2, md: 3 }
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Profile route - available for both customers and admins */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Customer-only routes - admins will be redirected to /admin */}
          <Route 
            path="/hotels" 
            element={
              <CustomerProtectedRoute>
                <Hotels />
              </CustomerProtectedRoute>
            } 
          />
          <Route 
            path="/hotels/:id" 
            element={
              <CustomerProtectedRoute>
                <HotelDetails />
              </CustomerProtectedRoute>
            } 
          />
          <Route 
            path="/my-bookings" 
            element={
              <CustomerProtectedRoute>
                <MyBookings />
              </CustomerProtectedRoute>
            } 
          />
          
          {/* Admin-only route */}
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />
        </Routes>
      </Container>
      <Footer />
      
      {/* AI ChatBot - Only show when user is logged in */}
      {isAuthenticated && <ChatBot />}
    </Box>
  );
}

export default App;