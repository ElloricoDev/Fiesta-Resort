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
    <x-admin.stat-card label="Total Reservations" value="120" />
    <x-admin.stat-card label="Available Rooms" value="5" />
    <x-admin.stat-card label="Revenue" value="₱55,000" />
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
      <tbody>
        <tr>
          <td>New reservation created</td>
          <td>2025-07-26</td>
          <td>Emily Carter</td>
        </tr>
        <tr>
          <td>Room 101 cleaned</td>
          <td>2025-07-23</td>
          <td>Maintenance Team</td>
        </tr>
        <tr>
          <td>Guest check-in</td>
          <td>2025-07-13</td>
          <td>Front Desk</td>
        </tr>
        <tr>
          <td>Reservation cancelled</td>
          <td>2025-07-06</td>
          <td>David Lee</td>
        </tr>
        <tr>
          <td>New room added</td>
          <td>2025-04-03</td>
          <td>Admin</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button class="pagination-btn arrow" id="prevPage" type="button" aria-label="Previous page">
        &lt;
      </button>
      <button class="pagination-btn active" data-page="1" type="button">1</button>
      <button class="pagination-btn" data-page="2" type="button">2</button>
      <button class="pagination-btn" data-page="3" type="button">3</button>
      <button class="pagination-btn" data-page="4" type="button">4</button>
      <button class="pagination-btn" data-page="5" type="button">5</button>
      <button class="pagination-btn arrow" id="nextPage" type="button" aria-label="Next page">
        &gt;
      </button>
    </div>
  </div>
@endsection

