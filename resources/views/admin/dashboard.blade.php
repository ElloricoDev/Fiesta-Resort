@extends('layouts.admin')

@section('title', 'Dashboard - Fiesta Resort')

@push('styles')
  @vite('resources/css/admin/dashboard.css')
@endpush

@push('scripts')
  @vite('resources/js/admin/dashboard.js')
@endpush

@section('content')
  <h1 class="page-title">Dashboard</h1>

  <div class="stats-container">
    <x-admin.stat-card label="Total Reservations" value="{{ $totalReservations }}" />
    <x-admin.stat-card label="Available Rooms" value="{{ $availableRooms }}" />
    <x-admin.stat-card label="Revenue" value="{{ $totalRevenue }}" />
  </div>

  <div class="activities-section">
    <h2 class="section-title">Recent Activities</h2>
    <table class="activities-table">
      <thead>
        <tr>
          <th>Activity</th>
          <th>Date</th>
          <th>User</th>
        </tr>
      </thead>
      <tbody id="activitiesTableBody">
        @forelse($activities as $activity)
          <tr>
            <td>{{ $activity['activity'] }}</td>
            <td>{{ $activity['date'] }}</td>
            <td>{{ $activity['user'] }}</td>
          </tr>
        @empty
          <tr>
            <td colspan="3" style="text-align: center; padding: 40px; color: #6b7280;">
              No recent activities
            </td>
          </tr>
        @endforelse
      </tbody>
    </table>

    @if(count($activities) > 10)
      <div class="pagination" id="paginationContainer">
        <button class="pagination-btn arrow" id="prevPage" type="button" aria-label="Previous page">
          &lt;
        </button>
        <div id="paginationPages"></div>
        <button class="pagination-btn arrow" id="nextPage" type="button" aria-label="Next page">
          &gt;
        </button>
      </div>
    @endif
  </div>
@endsection

