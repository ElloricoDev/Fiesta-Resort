import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                // Admin assets
                'resources/css/admin/base.css',
                'resources/css/admin/dashboard.css',
                'resources/css/admin/guests.css',
                'resources/css/admin/reservations.css',
                'resources/css/admin/rooms.css',
                'resources/css/admin/profile.css',
                'resources/css/admin/settings.css',
                'resources/css/admin/users.css',
                'resources/js/admin/base.js',
                'resources/js/admin/dashboard.js',
                'resources/js/admin/notifications.js',
                'resources/js/admin/guests.js',
                'resources/js/admin/reservations.js',
                'resources/js/admin/rooms.js',
                'resources/js/admin/users.js',
                'resources/js/admin/profile.js',
                'resources/js/admin/settings.js',
                // Auth assets
                'resources/css/auth/login.css',
                'resources/css/auth/signup.css',
                'resources/js/auth/login.js',
                'resources/js/auth/signup.js',
                // Client assets
                'resources/css/client/home.css',
                'resources/css/client/booking.css',
                'resources/css/client/hotel-details.css',
                'resources/css/client/hotels.css',
                'resources/css/client/my-bookings.css',
                'resources/css/client/my-profile.css',
                'resources/css/client/room-details.css',
                'resources/js/client/home.js',
                'resources/js/client/booking.js',
                'resources/js/client/hotel-details.js',
                'resources/js/client/hotels.js',
                'resources/js/client/my-bookings.js',
                'resources/js/client/my-profile.js',
                'resources/js/client/room-details.js',
                // Dummy data seed script
                'resources/js/dummy-data.js',
                // Notification utility
                'resources/js/utils/notifications.js',
            ],
            refresh: true,
        }),
    ],
});
