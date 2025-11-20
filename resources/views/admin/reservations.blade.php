@extends('layouts.admin')

@section('title', 'Reservations - Fiesta Resort')

@push('styles')
  @vite('resources/css/admin/reservations.css')
@endpush

@push('scripts')
  @vite('resources/js/admin/reservations.js')
@endpush

@section('content')
  <x-admin.page-header 
    title="Reservations"
    search-placeholder="Search reservations..."
    search-id="searchInput"
    add-button-text="Add Reservation"
    add-button-id="addReservationBtn"
  />

  <div class="reservations-section">
    <div class="filters-row">
      <div class="filter-dropdown">
        <button class="filter-btn" id="statusFilterBtn" type="button">
          <span id="selectedStatus">All Status</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="filter-dropdown-menu" id="statusFilterMenu">
          <button class="filter-option selected" data-status="all" type="button">All Status</button>
          <button class="filter-option" data-status="confirmed" type="button">Confirmed</button>
          <button class="filter-option" data-status="checked-in" type="button">Checked-in</button>
          <button class="filter-option" data-status="pending" type="button">Pending</button>
          <button class="filter-option" data-status="cancelled" type="button">Cancelled</button>
        </div>
      </div>
    </div>

    <table class="reservations-table">
      <thead>
        <tr>
          <th>Guest</th>
          <th>Dates</th>
          <th>Room</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="reservationsTableBody"></tbody>
    </table>

    <x-admin.empty-state 
      id="emptyState"
      message="No reservations found."
    />
  </div>

  <x-admin.modal 
    id="reservationModal"
    title="Add Reservation"
    form-id="reservationForm"
    submit-button-text="Save Reservation"
    cancel-button-text="Cancel"
  >
    <div class="form-row">
      <x-admin.form-group 
        label="Guest Name"
        id="guestName"
        type="text"
        placeholder="Enter guest name"
        :required="true"
      />
      <x-admin.form-group 
        label="Email Address"
        id="guestEmail"
        type="email"
        placeholder="guest@example.com"
        :required="true"
      />
    </div>

    <div class="form-row">
      <x-admin.form-group 
        label="Check-in Date"
        id="checkIn"
        type="date"
        :required="true"
      />
      <x-admin.form-group 
        label="Check-out Date"
        id="checkOut"
        type="date"
        :required="true"
      />
    </div>

    <div class="form-row">
      <x-admin.form-select 
        label="Room Type"
        id="room"
        :options="[
          'Deluxe King Suite' => 'Deluxe King Suite',
          'Standard Room' => 'Standard Room',
          'Executive Suite' => 'Executive Suite',
          'Presidential Suite' => 'Presidential Suite'
        ]"
        placeholder="Select room type"
        :required="true"
      />
      <x-admin.form-select 
        label="Status"
        id="status"
        :options="[
          'pending' => 'Pending',
          'confirmed' => 'Confirmed',
          'checked-in' => 'Checked-in',
          'cancelled' => 'Cancelled'
        ]"
        selected="pending"
        :required="true"
      />
    </div>
  </x-admin.modal>
@endsection

