<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RoomController extends Controller
{
    /**
     * Display all room types listing page.
     */
    public function index(Request $request)
    {
        // Get search parameters from query string
        $checkIn = $request->get('check_in');
        $checkOut = $request->get('check_out');
        $persons = (int) $request->get('persons', 2);

        // Start with all available rooms
        $query = Room::where('status', 'available');

        // Filter by occupancy if persons is specified
        if ($persons > 0) {
            $query->where('max_occupancy', '>=', $persons);
        }

        // Get all rooms first
        $allRooms = $query->get();

        // If dates are provided, filter by availability
        if ($checkIn && $checkOut) {
            $allRooms = $allRooms->filter(function ($room) use ($checkIn, $checkOut) {
                return $room->isAvailableForDates($checkIn, $checkOut);
            });
        }

        // Group by room type and calculate stats
        $roomTypes = $allRooms->groupBy('room_type')
            ->map(function ($rooms, $roomType) {
                // Map room types to display information
                $roomTypeInfo = [
                    'Standard Room' => [
                        'image' => 'FiestaResort1.jpg',
                        'badge' => 'Popular',
                        'features' => ['Free WiFi', 'Pool Access', 'Breakfast'],
                    ],
                    'Deluxe King Suite' => [
                        'image' => 'FiestaResort2.jpg',
                        'badge' => null,
                        'features' => ['Free WiFi', 'King Bed', 'Ocean View'],
                    ],
                    'Executive Suite' => [
                        'image' => 'FiestaResort3.jpg',
                        'badge' => 'Luxury',
                        'features' => ['Free WiFi', 'Spa Access', 'Concierge'],
                    ],
                    'Presidential Suite' => [
                        'image' => 'FiestaResort4.jpg',
                        'badge' => 'Premium',
                        'features' => ['Free WiFi', 'Private Pool', 'Butler Service'],
                    ],
                ];

                $info = $roomTypeInfo[$roomType] ?? [
                    'image' => 'FiestaResort1.jpg',
                    'badge' => null,
                    'features' => ['Free WiFi', 'Modern Amenities'],
                ];

                $prices = $rooms->pluck('price_per_night');
                
                return [
                    'room_type' => $roomType,
                    'price' => (int) $prices->min(),
                    'min_price' => (int) $prices->min(),
                    'max_price' => (int) $prices->max(),
                    'room_count' => $rooms->count(),
                    'image' => $info['image'],
                    'badge' => $info['badge'],
                    'features' => $info['features'],
                ];
            })
            ->values();

        return view('client.rooms', [
            'roomTypes' => $roomTypes,
            'checkIn' => $checkIn,
            'checkOut' => $checkOut,
            'persons' => $persons,
        ]);
    }

    /**
     * Display room type details page.
     */
    public function show(Request $request)
    {
        $roomType = $request->get('room_type');
        
        // Get all available room types with their minimum prices
        $roomTypes = Room::where('status', 'available')
            ->selectRaw('room_type, MIN(price_per_night) as min_price')
            ->groupBy('room_type')
            ->get()
            ->map(function ($room) {
                return [
                    'type' => $room->room_type,
                    'price_per_night' => $room->min_price,
                    'min_price' => $room->min_price,
                ];
            });

        // Get room counts by type
        $roomCounts = Room::where('status', 'available')
            ->selectRaw('room_type, COUNT(*) as count')
            ->groupBy('room_type')
            ->pluck('count', 'room_type');

        // If specific room type requested, get details
        $selectedRoomType = null;
        if ($roomType) {
            $selectedRoomType = Room::where('room_type', $roomType)
                ->where('status', 'available')
                ->first();
        }

        return view('client.room-type-details', [
            'roomType' => $roomType,
            'selectedRoomType' => $selectedRoomType,
            'roomTypes' => $roomTypes,
            'roomCounts' => $roomCounts,
        ]);
    }

    /**
     * Get rooms by type.
     */
    public function getRooms(Request $request): JsonResponse
    {
        $roomType = $request->get('room_type');
        
        $query = Room::where('status', 'available');
        
        if ($roomType) {
            $query->where('room_type', $roomType);
        }

        $rooms = $query->get()
            ->map(function ($room) {
                return [
                    'id' => $room->id,
                    'room_number' => $room->room_number,
                    'room_type' => $room->room_type,
                    'price_per_night' => $room->price_per_night,
                    'max_occupancy' => $room->max_occupancy,
                    'description' => $room->description,
                    'amenities' => $room->amenities,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $rooms,
        ]);
    }
}

