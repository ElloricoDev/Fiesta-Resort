# Fiesta Resort - Test Instructions

## Dummy Users for Testing

The application includes dummy users for testing purposes. Use these credentials to log in:

### Admin User
- **Email:** `admin@fiesta.com`
- **Password:** `admin123`
- **Role:** Admin
- **Access:** Admin Dashboard, all admin pages

### Regular User
- **Email:** `user@fiesta.com`
- **Password:** `user123`
- **Role:** User
- **Access:** Client pages (Home, Hotels, Bookings, Profile)

## Testing Flow

### 1. Test Admin Side

1. Go to the login page: `/login`
2. Login with admin credentials:
   - Email: `admin@fiesta.com`
   - Password: `admin123`
3. You will be redirected to `/admin/dashboard`
4. Test the following admin pages:
   - Dashboard - View statistics and recent reservations
   - Reservations - View and manage reservations
   - Rooms - View and manage rooms
   - Guests - View and manage guest information
   - Users - View and manage users
   - Profile - Edit admin profile
   - Settings - Manage system settings

### 2. Test Client Side

1. Logout from admin (or use incognito/private window)
2. Go to the home page: `/client/home`
3. Browse the following pages:
   - Home - View hero section, hotels, rooms, about, contact
   - Hotels - Browse all available hotels
   - Hotel Details - View hotel details and available rooms
   - Room Details - View room details and amenities
4. Login as regular user:
   - Email: `user@fiesta.com`
   - Password: `user123`
5. Test authenticated features:
   - My Bookings - View booking history
   - My Profile - Edit profile, change password, preferences
   - Booking Flow - Create a new booking

### 3. Test Registration

1. Go to `/register`
2. Fill in the registration form
3. Submit the form
4. You will be automatically logged in as a new user
5. The new user will be added to the dummy users list

## Dummy Data

The application automatically initializes dummy data on first load:

- **Users:** Admin and regular user accounts
- **Bookings:** Sample bookings with different statuses
- **Guests:** Sample guest information
- **Reservations:** Sample reservation data
- **Rooms:** Sample room data
- **Profile Data:** Sample user profiles

All dummy data is stored in `localStorage` and will persist across page refreshes.

## Resetting Dummy Data

To reset all dummy data, open the browser console and run:

```javascript
localStorage.clear();
location.reload();
```

This will clear all data and reinitialize the dummy data on the next page load.

## Notes

- The dummy data is only for frontend testing
- Real authentication with Laravel will work alongside dummy authentication
- Dummy users are stored in `localStorage` under the key `dummyUsers`
- All bookings, reservations, and other data are stored in `localStorage`

