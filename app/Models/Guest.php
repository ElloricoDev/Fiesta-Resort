<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guest extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'start_since',
        'total_stays',
    ];

    protected $casts = [
        'start_since' => 'date',
    ];

    /**
     * Get all reservations for this guest
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'guest_email', 'email');
    }
}
