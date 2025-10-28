# Hotel Booking System

A full-stack hotel booking application built with Java Spring Boot backend and React frontend.

## Features

- **User Authentication**: Register, login, and profile management
- **Hotel Search**: Search hotels by location, dates, and preferences
- **Room Booking**: Book rooms with payment processing
- **Booking Management**: View, modify, and cancel bookings
- **Admin Panel**: Hotel and inventory management (coming soon)

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0
- Maven 3.6+

## Project Structure

```
hotel-booking-system/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml             # Maven dependencies
├── frontend/               # React frontend
│   ├── src/                # React source code
│   ├── public/             # Static files
│   └── package.json        # NPM dependencies
└── README.md
```

## Setup Instructions

### Database Setup

1. Install MySQL 8.0
2. Create a database named `hotel_booking_db`:
   ```sql
   CREATE DATABASE hotel_booking_db;
   ```
3. Update database credentials in `backend/src/main/resources/application.yml` if needed

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies and run the application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

3. The backend will start on `http://localhost:8080`
4. Sample data will be automatically loaded on first run

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The frontend will start on `http://localhost:3000`

## Sample Accounts

The application comes with pre-loaded sample data:

**Customer Account:**
- Email: `customer@example.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Hotels
- `GET /api/hotels/search` - Search hotels
- `GET /api/hotels/{id}` - Get hotel details
- `GET /api/hotels/{id}/rooms` - Get hotel room types

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking

### Health Check
- `GET /api/health` - Application health status

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security (JWT Authentication)
- Spring Data JPA
- MySQL 8.0
- Maven

### Frontend
- React 18
- Redux Toolkit
- Material-UI
- React Router
- Axios
- Formik & Yup

## Features Implemented

✅ User registration and authentication  
✅ Hotel search and filtering  
✅ Hotel details and room types  
✅ Booking creation and management  
✅ Payment processing (simulated)  
✅ Responsive UI with Material-UI  
✅ Redux state management  
✅ Form validation  
✅ Error handling  

## Development

The application includes:
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Error handling and user feedback
- Responsive design
- Sample data for testing

## Testing

You can test the application by:
1. Registering a new account or using sample accounts
2. Searching for hotels in "New York", "Miami", or "Denver"
3. Viewing hotel details and available room types
4. Creating bookings (payment is simulated)
5. Managing your bookings in the user dashboard

## Next Steps

Additional features that can be implemented:
- Hotel reviews and ratings
- Advanced search filters
- Email notifications
- Admin dashboard
- Real payment gateway integration
- Booking analytics and reporting