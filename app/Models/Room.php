<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    protected $fillable = [
        'room_number',
        'room_type',
        'status',
        'price_per_night',
        'description',
        'max_occupancy',
        'amenities',
    ];

    protected $casts = [
        'price_per_night' => 'decimal:2',
        'amenities' => 'array',
    ];

    /**
     * Get all reservations for this room
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Check if room is available for given dates
     * 
     * A room is unavailable if there's an overlapping reservation where:
     * - The reservation check-in is before the requested check-out AND
     * - The reservation check-out is after the requested check-in
     */
    public function isAvailableForDates($checkIn, $checkOut, $excludeReservationId = null): bool
    {
        if ($this->status !== 'available') {
            return false;
        }

        // Convert to date strings to ensure proper comparison
        $checkInDate = is_string($checkIn) ? $checkIn : $checkIn->format('Y-m-d');
        $checkOutDate = is_string($checkOut) ? $checkOut : $checkOut->format('Y-m-d');

        $query = $this->reservations()
            ->where(function ($q) use ($checkInDate, $checkOutDate) {
                // Check for overlapping reservations
                // Reservation overlaps if: res_check_in < req_check_out AND res_check_out > req_check_in
                $q->where('check_in', '<', $checkOutDate)
                  ->where('check_out', '>', $checkInDate);
            })
            ->whereIn('status', ['pending', 'confirmed', 'checked-in']);

        if ($excludeReservationId) {
            $query->where('id', '!=', $excludeReservationId);
        }

        return $query->count() === 0;
    }
}
