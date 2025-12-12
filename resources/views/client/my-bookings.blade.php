@extends('layouts.client')

@section('title', 'My Bookings - Fiesta Resort')

@push('styles')
  @vite('resources/css/client/my-bookings.css')
@endpush

@push('scripts')
  @vite('resources/js/client/my-bookings.js')
@endpush

@section('content')
  <x-client.page-header 
    title="My Bookings"
    description="Manage and view all your reservations"
  />

  <section class="bookings-section">
    <div class="bookings-container">
      <div class="bookings-filters">
        <x-client.filter-button label="All Bookings" filter="all" :is-active="true" />
        <x-client.filter-button label="Upcoming" filter="upcoming" />
        <x-client.filter-button label="Completed" filter="completed" />
        <x-client.filter-button label="Cancelled" filter="cancelled" />
      </div>

      <div class="bookings-list" id="bookingsList"></div>

      <x-client.empty-state 
        id="emptyState"
        title="No bookings found"
        description="You haven't made any bookings yet. Start exploring our hotels and rooms!"
        :show-button="true"
        button-text="Explore Rooms"
        :button-url="route('client.rooms')"
      >
        <x-slot:icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="empty-icon">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </x-slot:icon>
      </x-client.empty-state>
    </div>
  </section>

  <x-client.modal 
    id="bookingModal"
    title="Booking Details"
    close-button-id="modalClose"
  />

  <!-- Cancel Booking Confirmation Modal -->
  <x-client.confirmation-modal 
    id="cancelBookingModal"
    title="Cancel Booking"
    message="Are you sure you want to cancel this booking? This action cannot be undone."
    confirm-text="Yes, Cancel"
    cancel-text="Keep Booking"
    confirm-button-class="logout-modal-btn-delete"
  />
@endsection

