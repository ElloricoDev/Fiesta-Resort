<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * Display the profile page.
     */
    public function index()
    {
        $user = Auth::user();
        
        if (!$user) {
            abort(401, 'Unauthorized');
        }
        
        return view('admin.profile', [
            'user' => [
                'name' => $user->name ?? '',
                'email' => $user->email ?? '',
                'phone' => $user->phone ?? '',
                'country_code' => $user->country_code ?? '+63',
                'address' => $user->address ?? '',
            ],
        ]);
    }

    /**
     * Get current user profile via API.
     */
    public function get(): JsonResponse
    {
        $user = Auth::user();
        
        return response()->json([
            'success' => true,
            'data' => [
                'name' => $user->name ?? '',
                'email' => $user->email ?? '',
                'phone' => $user->phone ?? '',
                'country_code' => $user->country_code ?? '+63',
                'address' => $user->address ?? '',
            ],
        ]);
    }

    /**
     * Update user profile.
     */
    public function update(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'country_code' => 'nullable|string|max:10',
            'address' => 'nullable|string',
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:6',
            'confirm_password' => 'nullable|string|same:new_password',
        ]);

        // Update basic profile info
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? null;
        $user->country_code = $validated['country_code'] ?? null;
        $user->address = $validated['address'] ?? null;

        // Handle password change if provided
        if (!empty($validated['current_password']) || !empty($validated['new_password'])) {
            if (empty($validated['current_password']) || empty($validated['new_password'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please fill in all password fields to change your password.',
                ], 422);
            }

            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect.',
                ], 422);
            }

            $user->password = Hash::make($validated['new_password']);
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'country_code' => $user->country_code,
                'address' => $user->address,
            ],
        ]);
    }
}
