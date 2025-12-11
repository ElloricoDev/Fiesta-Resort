<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Guest;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Reservation::query();

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('guest_name', 'like', "%{$search}%")
                  ->orWhere('guest_email', 'like', "%{$search}%")
                  ->orWhere('room_type', 'like', "%{$search}%");
            });
        }

        $reservations = $query->with(['room', 'guest'])->orderBy('created_at', 'desc')->get();

        // Format dates for frontend
        $formattedReservations = $reservations->map(function ($reservation) {
            return [
                'id' => $reservation->id,
                'guest_name' => $reservation->guest_name,
                'guest_email' => $reservation->guest_email,
                'check_in' => $reservation->check_in->format('Y-m-d'),
                'check_out' => $reservation->check_out->format('Y-m-d'),
                'room_type' => $reservation->room_type,
                'room_id' => $reservation->room_id,
                'status' => $reservation->status,
                'total_price' => $reservation->total_price,
                'notes' => $reservation->notes,
                'room' => $reservation->room ? [
                    'id' => $reservation->room->id,
                    'room_number' => $reservation->room->room_number,
                    'room_type' => $reservation->room->room_type,
                ] : null,
                'guest' => $reservation->guest ? [
                    'id' => $reservation->guest->id,
                    'name' => $reservation->guest->name,
                    'email' => $reservation->guest->email,
                    'phone' => $reservation->guest->phone,
                    'total_stays' => $reservation->guest->total_stays,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formattedReservations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'required|email|max:255',
            'guest_phone' => 'nullable|string|max:255',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'room_type' => 'required|string|max:255',
            'room_id' => 'nullable|exists:rooms,id',
            'status' => ['required', Rule::in(['pending', 'confirmed', 'checked-in', 'cancelled'])],
            'notes' => 'nullable|string',
        ]);

        // If room_id is provided, verify it's available
        if ($validated['room_id']) {
            $room = Room::findOrFail($validated['room_id']);
            if (!$room->isAvailableForDates($validated['check_in'], $validated['check_out'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Selected room is not available for the selected dates',
                ], 422);
            }
            if ($room->room_type !== $validated['room_type']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Room type mismatch',
                ], 422);
            }
        } else {
            // Auto-assign an available room if not specified
            $availableRoom = Room::where('room_type', $validated['room_type'])
                ->where('status', 'available')
                ->get()
                ->first(function ($room) use ($validated) {
                    return $room->isAvailableForDates($validated['check_in'], $validated['check_out']);
                });

            if ($availableRoom) {
                $validated['room_id'] = $availableRoom->id;
            }
        }

        // Calculate total price
        if ($validated['room_id']) {
            $room = Room::find($validated['room_id']);
            $nights = Carbon::parse($validated['check_in'])->diffInDays(Carbon::parse($validated['check_out']));
            $validated['total_price'] = $room->price_per_night * $nights;
        }

        // Create or update guest
        $this->syncGuest($validated['guest_name'], $validated['guest_email'], $validated['guest_phone'] ?? null, $validated['check_in']);

        $reservation = Reservation::create($validated);
        $reservation->load('room');

        // Create notification for new reservation
        Notification::createNotification(
            'reservation',
            'New Reservation',
            "New reservation created for {$validated['guest_name']} - {$validated['room_type']}",
            route('admin.reservations')
        );

        return response()->json([
            'success' => true,
            'message' => 'Reservation created successfully',
            'data' => $reservation,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $reservation = Reservation::with(['room', 'guest'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $reservation->id,
                'guest_name' => $reservation->guest_name,
                'guest_email' => $reservation->guest_email,
                'check_in' => $reservation->check_in->format('Y-m-d'),
                'check_out' => $reservation->check_out->format('Y-m-d'),
                'room_type' => $reservation->room_type,
                'room_id' => $reservation->room_id,
                'status' => $reservation->status,
                'total_price' => $reservation->total_price,
                'notes' => $reservation->notes,
                'room' => $reservation->room ? [
                    'id' => $reservation->room->id,
                    'room_number' => $reservation->room->room_number,
                    'room_type' => $reservation->room->room_type,
                ] : null,
                'guest' => $reservation->guest ? [
                    'id' => $reservation->guest->id,
                    'name' => $reservation->guest->name,
                    'email' => $reservation->guest->email,
                    'phone' => $reservation->guest->phone,
                    'total_stays' => $reservation->guest->total_stays,
                ] : null,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $reservation = Reservation::findOrFail($id);

        $validated = $request->validate([
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'required|email|max:255',
            'guest_phone' => 'nullable|string|max:255',
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
            'room_type' => 'required|string|max:255',
            'room_id' => 'nullable|exists:rooms,id',
            'status' => ['required', Rule::in(['pending', 'confirmed', 'checked-in', 'cancelled'])],
            'notes' => 'nullable|string',
        ]);

        // If room_id is provided or changed, verify availability
        if (isset($validated['room_id']) && $validated['room_id']) {
            $room = Room::findOrFail($validated['room_id']);
            if (!$room->isAvailableForDates($validated['check_in'], $validated['check_out'], $reservation->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Selected room is not available for the selected dates',
                ], 422);
            }
            if ($room->room_type !== $validated['room_type']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Room type mismatch',
                ], 422);
            }

            // Recalculate total price
            $nights = Carbon::parse($validated['check_in'])->diffInDays(Carbon::parse($validated['check_out']));
            $validated['total_price'] = $room->price_per_night * $nights;
        }

        // Always sync guest to update phone and total_stays
        $this->syncGuest($validated['guest_name'], $validated['guest_email'], $validated['guest_phone'] ?? null, $validated['check_in']);

        // Create notification if status changed to checked-in
        if ($reservation->status !== 'checked-in' && $validated['status'] === 'checked-in') {
            Notification::createNotification(
                'check_in',
                'Guest Checked In',
                "{$validated['guest_name']} has checked in",
                route('admin.reservations')
            );
        }

        $reservation->update($validated);
        $reservation->load('room');

        return response()->json([
            'success' => true,
            'message' => 'Reservation updated successfully',
            'data' => $reservation,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $reservation = Reservation::findOrFail($id);
        
        // Update guest total_stays when reservation is deleted
        if ($reservation->guest_email) {
            $guest = Guest::where('email', $reservation->guest_email)->first();
            if ($guest) {
                $guest->total_stays = max(0, $guest->total_stays - 1);
                $guest->save();
            }
        }

        $reservation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Reservation deleted successfully',
        ]);
    }

    /**
     * Sync guest information when creating/updating reservations
     */
    protected function syncGuest(string $name, string $email, ?string $phone, string $checkIn): void
    {
        $guest = Guest::firstOrNew(['email' => $email]);
        
        // Update name if it's different
        if ($guest->name !== $name) {
            $guest->name = $name;
        }
        
        // Update phone if provided
        if ($phone && $phone !== $guest->phone) {
            $guest->phone = $phone;
        }
        
        // Set start_since to the earliest reservation date
        if (!$guest->start_since || Carbon::parse($checkIn)->lt($guest->start_since)) {
            $guest->start_since = Carbon::parse($checkIn);
        }
        
        // Count total stays (reservations) - only count non-cancelled reservations
        $guest->total_stays = Reservation::where('guest_email', $email)
            ->where('status', '!=', 'cancelled')
            ->count();
        
        $guest->save();
    }
}
