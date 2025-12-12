<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    protected $fillable = [
        'guest_name',
        'guest_email',
        'guest_phone',
        'check_in',
        'check_out',
        'room_type',
        'room_id',
        'status',
        'total_price',
        'notes',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'total_price' => 'decimal:2',
    ];

    /**
     * Get the room assigned to this reservation
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Get the guest for this reservation
     */
    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class, 'guest_email', 'email');
    }
}
