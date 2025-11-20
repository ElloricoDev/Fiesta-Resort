<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Client routes (public)
Route::prefix('client')->name('client.')->group(function () {
    Route::view('/home', 'client.home')->name('home');
    Route::view('/hotels', 'client.hotels')->name('hotels');
    Route::view('/hotel-details', 'client.hotel-details')->name('hotel-details');
    Route::view('/room-details', 'client.room-details')->name('room-details');
    Route::view('/booking', 'client.booking')->name('booking');
    Route::view('/my-bookings', 'client.my-bookings')->name('my-bookings');
    Route::view('/my-profile', 'client.my-profile')->name('my-profile');
});

// Root route - show client home
Route::get('/', function () {
    return view('client.home');
})->name('home');

// Admin routes - using dummy data (localStorage) for authentication
Route::prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::view('/dashboard', 'admin.dashboard')->name('dashboard');
        Route::view('/reservations', 'admin.reservations')->name('reservations');
        Route::view('/rooms', 'admin.rooms')->name('rooms');
        Route::view('/users', 'admin.users')->name('users');
        Route::view('/guests', 'admin.guests')->name('guests');
        Route::view('/profile', 'admin.profile')->name('profile');
        Route::view('/settings', 'admin.settings')->name('settings');
    });

Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
