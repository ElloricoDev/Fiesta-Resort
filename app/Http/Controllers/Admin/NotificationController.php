<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /**
     * Get all notifications
     */
    public function index(Request $request): JsonResponse
    {
        $unreadOnly = $request->boolean('unread_only', false);
        
        $query = Notification::query();
        
        if ($unreadOnly) {
            $query->where('is_read', false);
        }
        
        $notifications = $query->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();
        
        $unreadCount = Notification::where('is_read', false)->count();
        
        return response()->json([
            'success' => true,
            'data' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(string $id): JsonResponse
    {
        $notification = Notification::findOrFail($id);
        $notification->markAsRead();
        
        $unreadCount = Notification::where('is_read', false)->count();
        
        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(): JsonResponse
    {
        Notification::markAllAsRead();
        
        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read',
            'unread_count' => 0,
        ]);
    }

    /**
     * Delete a notification
     */
    public function destroy(string $id): JsonResponse
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();
        
        $unreadCount = Notification::where('is_read', false)->count();
        
        return response()->json([
            'success' => true,
            'message' => 'Notification deleted',
            'unread_count' => $unreadCount,
        ]);
    }
}
