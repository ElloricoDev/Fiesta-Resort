<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    /**
     * Display the settings page.
     */
    public function index()
    {
        $settings = Setting::allAsArray();
        
        return view('admin.settings', [
            'settings' => [
                'hotel_name' => $settings['hotel_name'] ?? 'Fiesta Resort',
                'address' => $settings['address'] ?? 'Sitio Dacuman, Barangay Ipil, Surigao City, 8400, PH',
                'zip_code' => $settings['zip_code'] ?? '8400',
                'timezone' => $settings['timezone'] ?? 'pst',
                'language' => $settings['language'] ?? 'english',
                'date_format' => $settings['date_format'] ?? 'yyyy-mm-dd',
            ],
        ]);
    }

    /**
     * Update settings via API.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'hotel_name' => 'required|string|max:255',
            'address' => 'required|string',
            'zip_code' => 'required|string|max:20',
            'timezone' => 'required|string|max:50',
            'language' => 'required|string|max:50',
            'date_format' => 'required|string|max:20',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully',
            'data' => $validated,
        ]);
    }

    /**
     * Get settings via API.
     */
    public function get(): JsonResponse
    {
        $settings = Setting::allAsArray();

        return response()->json([
            'success' => true,
            'data' => [
                'hotel_name' => $settings['hotel_name'] ?? 'Fiesta Resort',
                'address' => $settings['address'] ?? 'Sitio Dacuman, Barangay Ipil, Surigao City, 8400, PH',
                'zip_code' => $settings['zip_code'] ?? '8400',
                'timezone' => $settings['timezone'] ?? 'pst',
                'language' => $settings['language'] ?? 'english',
                'date_format' => $settings['date_format'] ?? 'yyyy-mm-dd',
            ],
        ]);
    }
}
