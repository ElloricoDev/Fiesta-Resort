<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\ReservationController;
use App\Http\Controllers\Admin\RoomController;
use Illuminate\Support\Facades\Route;

// Client routes (public)
Route::prefix('client')->name('client.')->group(function () {
    // Public routes - anyone can access
    Route::view('/home', 'client.home')->name('home');
    Route::view('/hotels', 'client.hotels')->name('hotels');
    Route::view('/hotel-details', 'client.hotel-details')->name('hotel-details');
    Route::view('/room-details', 'client.room-details')->name('room-details');
    
    // Protected client routes - require auth but block admins
    Route::middleware(['auth', 'not.admin'])->group(function () {
        Route::view('/booking', 'client.booking')->name('booking');
        Route::view('/my-bookings', 'client.my-bookings')->name('my-bookings');
        Route::view('/my-profile', 'client.my-profile')->name('my-profile');
    });
});

// Root route - show client home
Route::get('/', function () {
    return view('client.home');
})->name('home');

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
