@extends('layouts.admin')

@section('title', 'Guests - Fiesta Resort')

@push('styles')
  @vite('resources/css/admin/guests.css')
@endpush

@push('scripts')
  @vite('resources/js/admin/guests.js')
@endpush

@section('content')
  <x-admin.page-header 
    title="Guests"
    search-placeholder="Search guest..."
    search-id="searchInput"
    add-button-text="Add Guest"
    add-button-id="addGuestBtn"
  />

  <div class="guests-section">
    <table class="guests-table">
      <thead>
        <tr>
          <th>Guest</th>
          <th>Contact Information</th>
          <th>Total Stays</th>
          <th>Start Since</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="guestsTableBody"></tbody>
    </table>

    <x-admin.empty-state 
      id="emptyState"
      message="No guests found."
    />
  </div>

  <x-admin.modal 
    id="guestModal"
    title="Add Guest"
    form-id="guestForm"
    submit-button-text="Save Guest"
    cancel-button-text="Cancel"
  >
    <x-admin.form-row>
      <x-admin.form-group 
        label="Full Name"
        id="guestName"
        type="text"
        placeholder="Enter full name"
        :required="true"
      />
      <x-admin.form-group 
        label="Email Address"
        id="guestEmail"
        type="email"
        placeholder="guest@example.com"
        :required="true"
      />
    </x-admin.form-row>

    <x-admin.form-row>
      <x-admin.form-group 
        label="Phone Number"
        id="guestPhone"
        type="tel"
        placeholder="(555) 123-4567"
        :required="true"
      />
      <x-admin.form-group 
        label="Start Since"
        id="startSince"
        type="date"
        :required="true"
      />
    </x-admin.form-row>

    <x-admin.form-group 
      label="Total Stays"
      id="totalStays"
      type="number"
      placeholder="0"
      :required="true"
      :min="0"
      class="full-width"
    />
  </x-admin.modal>
@endsection

