<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roomTypes = [
            'Deluxe King Suite' => ['price' => 350, 'count' => 10],
            'Standard Room' => ['price' => 250, 'count' => 15],
            'Executive Suite' => ['price' => 450, 'count' => 8],
            'Presidential Suite' => ['price' => 550, 'count' => 5],
        ];

        foreach ($roomTypes as $roomType => $config) {
            for ($i = 1; $i <= $config['count']; $i++) {
                // Generate room number based on type
                $prefix = match($roomType) {
                    'Deluxe King Suite' => 'DKS',
                    'Standard Room' => 'STD',
                    'Executive Suite' => 'EXE',
                    'Presidential Suite' => 'PRS',
                    default => 'RM',
                };
                
                $roomNumber = $prefix . '-' . str_pad($i, 3, '0', STR_PAD_LEFT);
                
                Room::create([
                    'room_number' => $roomNumber,
                    'room_type' => $roomType,
                    'status' => 'available',
                    'price_per_night' => $config['price'],
                    'max_occupancy' => $roomType === 'Presidential Suite' ? 4 : ($roomType === 'Executive Suite' ? 3 : 2),
                    'description' => "Comfortable {$roomType} with modern amenities",
                ]);
            }
        }
    }
}
