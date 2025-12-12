<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\ReservationController;
use App\Http\Controllers\Admin\RoomController;
use Illuminate\Support\Facades\Route;

// Client routes (public)
Route::prefix('client')->name('client.')->group(function () {
    // Public routes - anyone can access
    Route::get('/home', function () {
        $stats = [
            'totalUsers' => \App\Models\User::where('role', '!=', 'admin')->orWhereNull('role')->count(),
            'totalRooms' => \App\Models\Room::where('status', 'available')->count(),
            'totalReservations' => \App\Models\Reservation::whereIn('status', ['pending', 'confirmed', 'checked-in'])->count(),
        ];
        
        return view('client.home', $stats);
    })->name('home');
    Route::get('/rooms', [App\Http\Controllers\Client\RoomController::class, 'index'])->name('rooms');
    Route::get('/room-type-details', [App\Http\Controllers\Client\RoomController::class, 'show'])->name('room-type-details');
    Route::view('/room-details', 'client.room-details')->name('room-details');
    
    // Protected client routes - require auth but block admins
    Route::middleware(['auth', 'not.admin'])->group(function () {
        Route::view('/booking', 'client.booking')->name('booking');
        Route::view('/my-bookings', 'client.my-bookings')->name('my-bookings');
        Route::get('/my-profile', [App\Http\Controllers\Client\ProfileController::class, 'index'])->name('my-profile');
    });
});

// Root route - show client home
Route::get('/', function () {
    $stats = [
        'totalUsers' => \App\Models\User::where('role', '!=', 'admin')->orWhereNull('role')->count(),
        'totalRooms' => \App\Models\Room::where('status', 'available')->count(),
        'totalReservations' => \App\Models\Reservation::whereIn('status', ['pending', 'confirmed', 'checked-in'])->count(),
    ];
    
    return view('client.home', $stats);
})->name('home');

// Contact form route
Route::post('/contact', [App\Http\Controllers\ContactController::class, 'store'])->name('contact.store');

// Client booking routes - require authentication
Route::middleware(['auth', 'not.admin'])->prefix('client')->name('client.')->group(function () {
    Route::post('/booking', [App\Http\Controllers\Client\BookingController::class, 'store'])->name('booking.store');
    Route::get('/booking/available-rooms', [App\Http\Controllers\Client\BookingController::class, 'getAvailableRooms'])->name('booking.available-rooms');
    
    // Client profile API routes
    Route::get('/profile', [App\Http\Controllers\Client\ProfileController::class, 'get'])->name('profile.get');
    Route::put('/profile', [App\Http\Controllers\Client\ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/password', [App\Http\Controllers\Client\ProfileController::class, 'changePassword'])->name('profile.password');
    Route::get('/profile/stats', [App\Http\Controllers\Client\ProfileController::class, 'getStats'])->name('profile.stats');
    Route::get('/profile/recent-bookings', [App\Http\Controllers\Client\ProfileController::class, 'getRecentBookings'])->name('profile.recent-bookings');
    
    // Client bookings API routes
    Route::get('/bookings', [App\Http\Controllers\Client\BookingController::class, 'getBookings'])->name('bookings.get');
    Route::post('/bookings/{id}/cancel', [App\Http\Controllers\Client\BookingController::class, 'cancelBooking'])->name('bookings.cancel');
});

// Client room routes - public
Route::prefix('client')->name('client.')->group(function () {
    Route::get('/rooms/list', [App\Http\Controllers\Client\RoomController::class, 'getRooms'])->name('rooms.list');
});

// Admin routes - require authentication and admin role
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function () {
        Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::view('/reservations', 'admin.reservations')->name('reservations');
        Route::view('/rooms', 'admin.rooms')->name('rooms');
        Route::view('/users', 'admin.users')->name('users');
        Route::view('/guests', 'admin.guests')->name('guests');
        Route::get('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'index'])->name('profile');
        Route::get('/settings', [App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings');
        
        // API routes for reservations
        Route::prefix('api')->name('api.')->group(function () {
            Route::get('/reservations', [ReservationController::class, 'index'])->name('reservations.index');
            Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');
            Route::get('/reservations/{id}', [ReservationController::class, 'show'])->name('reservations.show');
            Route::put('/reservations/{id}', [ReservationController::class, 'update'])->name('reservations.update');
            Route::delete('/reservations/{id}', [ReservationController::class, 'destroy'])->name('reservations.destroy');
            
            // API routes for rooms
            Route::get('/rooms', [RoomController::class, 'index'])->name('rooms.index');
            Route::get('/rooms/available', [RoomController::class, 'getAvailableRooms'])->name('rooms.available');
            Route::post('/rooms', [RoomController::class, 'store'])->name('rooms.store');
            Route::put('/rooms/{id}', [RoomController::class, 'update'])->name('rooms.update');
            Route::delete('/rooms/{id}', [RoomController::class, 'destroy'])->name('rooms.destroy');
            
            // API routes for guests
            Route::get('/guests', [App\Http\Controllers\Admin\GuestController::class, 'index'])->name('guests.index');
            Route::put('/guests/{id}', [App\Http\Controllers\Admin\GuestController::class, 'update'])->name('guests.update');
            Route::delete('/guests/{id}', [App\Http\Controllers\Admin\GuestController::class, 'destroy'])->name('guests.destroy');
            
            // API routes for settings
            Route::get('/settings', [App\Http\Controllers\Admin\SettingsController::class, 'get'])->name('settings.get');
            Route::put('/settings', [App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');
            
            // API routes for notifications
            Route::get('/notifications', [App\Http\Controllers\Admin\NotificationController::class, 'index'])->name('notifications.index');
            Route::put('/notifications/{id}/read', [App\Http\Controllers\Admin\NotificationController::class, 'markAsRead'])->name('notifications.read');
            Route::put('/notifications/read-all', [App\Http\Controllers\Admin\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
            Route::delete('/notifications/{id}', [App\Http\Controllers\Admin\NotificationController::class, 'destroy'])->name('notifications.destroy');
            
            // API routes for profile
            Route::get('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'get'])->name('profile.get');
            Route::put('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');
            
            // API routes for users
            Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
            Route::post('/users', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
            Route::put('/users/{id}', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
            Route::delete('/users/{id}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
        });
    });

Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->name('dashboard');

// Client profile routes - require auth but block admins
Route::middleware(['auth', 'not.admin'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
