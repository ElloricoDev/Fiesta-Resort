# Public Access Guide

## Public Pages (No Login Required)

These pages can be accessed without logging in:

1. **Home Page** - `/` or `http://127.0.0.1:8000`
   - Browse hotels and rooms
   - View about section
   - Contact form
   - Search functionality

2. **Hotels Listing** - `/client/hotels`
   - View all available hotels
   - Filter by location, price, and sort
   - Click on hotels to view details
   - **Note:** Booking a hotel requires login

3. **Hotel Details** - `/client/hotel-details?hotel=hotel-name`
   - View hotel information
   - See available rooms
   - Click on rooms to view details
   - **Note:** Booking requires login

4. **Room Details** - `/client/room-details?room=room-type&hotel=hotel-name`
   - View room information
   - See amenities
   - View pricing
   - **Note:** Clicking "Book Now" requires login

## Protected Pages (Login Required)

These pages require authentication and will redirect to `/login` if not logged in:

1. **Booking** - `/client/booking`
   - Complete booking process
   - Enter booking information
   - Make payment

2. **My Bookings** - `/client/my-bookings`
   - View booking history
   - Filter bookings by status
   - View booking details

3. **My Profile** - `/client/my-profile`
   - View and edit profile
   - Change password
   - Manage preferences

## Test User Credentials

### Admin User
- Email: `admin@fiesta.com`
- Password: `admin123`
- Access: Admin Dashboard + All Client Pages

### Regular User
- Email: `user@fiesta.com`
- Password: `user123`
- Access: All Client Pages (except Admin Dashboard)

## How It Works

- **Browsing:** Users can freely browse hotels, view details, and explore rooms without logging in
- **Actions:** When users try to perform actions (book, view bookings, edit profile), they are prompted to login
- **Login Flow:** After login, users are redirected back to where they were or to the appropriate page based on their role

