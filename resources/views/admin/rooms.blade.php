@extends('layouts.admin')

@section('title', 'Rooms & Availability - Fiesta Resort')

@push('styles')
  @vite('resources/css/admin/rooms.css')
@endpush

@push('scripts')
  @vite('resources/js/admin/rooms.js')
@endpush

@section('content')
  <x-admin.page-header 
    title="Rooms & Availability"
    search-placeholder="Search rooms..."
    search-id="searchInput"
    :show-add-button="false"
  />

  <div class="room-inventory-section">
    <x-admin.section-header 
      title="Room Inventory"
      button-text="Add Room"
      button-id="addRoomBtn"
    />

    <table class="rooms-table">
      <thead>
        <tr>
          <th>Room Type</th>
          <th>Capacity</th>
          <th>Status</th>
          <th>Base Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="roomsTableBody"></tbody>
    </table>

    <x-admin.empty-state 
      id="emptyState"
      message="No rooms found."
    />
  </div>

  <x-admin.modal 
    id="roomModal"
    title="Add Room"
    form-id="roomForm"
    submit-button-text="Save Room"
    cancel-button-text="Cancel"
  >
    <x-admin.form-row>
      <x-admin.form-group 
        label="Room Type"
        id="roomType"
        type="text"
        placeholder="e.g., Deluxe King Suite"
        :required="true"
      />
      <x-admin.form-group 
        label="Capacity"
        id="capacity"
        type="number"
        placeholder="Number of guests"
        :required="true"
        :min="1"
        :max="10"
      />
    </x-admin.form-row>

    <x-admin.form-row>
      <x-admin.form-group 
        label="Base Price (₱)"
        id="basePrice"
        type="number"
        placeholder="0"
        :required="true"
        :min="0"
        :step="10"
      />
      <x-admin.form-select 
        label="Status"
        id="status"
        :options="[
          'available' => 'Available',
          'occupied' => 'Occupied',
          'under-maintenance' => 'Under Maintenance'
        ]"
        selected="available"
        :required="true"
      />
    </x-admin.form-row>
  </x-admin.modal>
@endsection

