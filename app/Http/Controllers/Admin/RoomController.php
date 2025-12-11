<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Room::query();

        // Filter by room type
        if ($request->has('room_type') && $request->room_type) {
            $query->where('room_type', $request->room_type);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('room_number', 'like', "%{$search}%")
                  ->orWhere('room_type', 'like', "%{$search}%");
            });
        }

        $rooms = $query->withCount(['reservations' => function ($q) {
            $q->whereIn('status', ['pending', 'confirmed', 'checked-in']);
        }])->orderBy('room_type')->orderBy('room_number')->get();

        // Group by room type and calculate availability
        $grouped = $rooms->groupBy('room_type')->map(function ($typeRooms, $type) {
            $total = $typeRooms->count();
            $available = $typeRooms->where('status', 'available')->count();
            
            return [
                'room_type' => $type,
                'total' => $total,
                'available' => $available,
                'occupied' => $total - $available,
                'rooms' => $typeRooms->map(function ($room) {
                    return [
                        'id' => $room->id,
                        'room_number' => $room->room_number,
                        'room_type' => $room->room_type,
                        'status' => $room->status,
                        'price_per_night' => $room->price_per_night,
                        'max_occupancy' => $room->max_occupancy,
                        'reservations_count' => $room->reservations_count,
                    ];
                }),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $rooms,
            'grouped' => $grouped,
        ]);
    }

    /**
     * Get available rooms for given dates and room type
     */
    public function getAvailableRooms(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'room_type' => 'required|string',
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
            'exclude_reservation_id' => 'nullable|integer',
        ]);

        $rooms = Room::where('room_type', $validated['room_type'])
            ->where('status', 'available')
            ->get()
            ->filter(function ($room) use ($validated) {
                return $room->isAvailableForDates(
                    $validated['check_in'],
                    $validated['check_out'],
                    $validated['exclude_reservation_id'] ?? null
                );
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => $rooms,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'room_number' => 'required|string|max:50|unique:rooms,room_number',
            'room_type' => 'required|string|max:255',
            'status' => ['required', Rule::in(['available', 'occupied', 'maintenance', 'reserved'])],
            'price_per_night' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'max_occupancy' => 'required|integer|min:1',
            'amenities' => 'nullable|array',
        ]);

        $room = Room::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Room created successfully',
            'data' => $room,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $room = Room::findOrFail($id);

        $validated = $request->validate([
            'room_number' => ['required', 'string', 'max:50', Rule::unique('rooms')->ignore($room->id)],
            'room_type' => 'required|string|max:255',
            'status' => ['required', Rule::in(['available', 'occupied', 'maintenance', 'reserved'])],
            'price_per_night' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'max_occupancy' => 'required|integer|min:1',
            'amenities' => 'nullable|array',
        ]);

        $room->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Room updated successfully',
            'data' => $room,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $room = Room::findOrFail($id);
        
        // Check if room has active reservations
        $activeReservations = $room->reservations()
            ->whereIn('status', ['pending', 'confirmed', 'checked-in'])
            ->count();

        if ($activeReservations > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete room with active reservations',
            ], 422);
        }

        $room->delete();

        return response()->json([
            'success' => true,
            'message' => 'Room deleted successfully',
        ]);
    }
}
