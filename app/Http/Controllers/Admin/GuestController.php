<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class GuestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Guest::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $guests = $query->orderBy('name')->get();

        // Format for frontend
        $formattedGuests = $guests->map(function ($guest) {
            return [
                'id' => $guest->id,
                'name' => $guest->name,
                'email' => $guest->email,
                'phone' => $guest->phone,
                'total_stays' => $guest->total_stays,
                'start_since' => $guest->start_since ? $guest->start_since->format('Y-m-d') : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formattedGuests,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $guest = Guest::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('guests')->ignore($guest->id)],
            'phone' => 'nullable|string|max:255',
            'start_since' => 'nullable|date',
        ]);

        $guest->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Guest updated successfully',
            'data' => [
                'id' => $guest->id,
                'name' => $guest->name,
                'email' => $guest->email,
                'phone' => $guest->phone,
                'total_stays' => $guest->total_stays,
                'start_since' => $guest->start_since ? $guest->start_since->format('Y-m-d') : null,
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $guest = Guest::findOrFail($id);

        // Check if guest has reservations
        $reservationCount = $guest->reservations()->count();
        if ($reservationCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Cannot delete guest. They have {$reservationCount} reservation(s).",
            ], 422);
        }

        $guest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Guest deleted successfully',
        ]);
    }
}
