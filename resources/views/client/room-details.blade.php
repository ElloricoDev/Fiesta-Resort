@extends('layouts.client')

@section('title', 'Room Details - Fiesta Resort')

@push('styles')
  @vite('resources/css/client/room-details.css')
@endpush

@push('scripts')
  @vite('resources/js/client/room-details.js')
@endpush

@section('content')
  <section class="breadcrumb-section">
    <div class="breadcrumb-container">
      <x-client.breadcrumb 
        :items="[
          ['label' => 'Home', 'url' => route('client.home')],
          ['label' => 'Room Details']
        ]"
      />
    </div>
  </section>

  <section class="room-details-section">
    <div class="room-details-container">
      <div class="room-header">
        <h1 class="room-title" id="roomTitle">Blue Origin Fams</h1>
        <p class="room-location" id="roomLocation">Galle, Sri Lanka</p>
      </div>

      <div class="room-image-wrapper">
        <img
          src="{{ asset('assets/FiestaResort1.jpg') }}"
          alt="Room"
          class="room-image"
          id="roomImage"
        />
      </div>

      <div class="room-content-grid">
        <div class="room-about">
          <h2 class="section-heading">About the Room</h2>
          <div class="about-text">
            <p>
              Minimal techno is a minimalist subgenre of techno music. It is
              characterized by a stripped-down aesthetic that exploits the use
              of repetition and understated development.
            </p>
            <p>
              Such trends saw the demise of the soul-infused techno that
              typified the original Detroit sound.
            </p>
          </div>

          <div class="amenities-section">
            <x-client.amenity-item value="1" label="bedroom" value-id="bedrooms">
              <x-slot:icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </x-slot:icon>
            </x-client.amenity-item>
            <x-client.amenity-item value="1" label="living room" value-id="livingRooms">
              <x-slot:icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </x-slot:icon>
            </x-client.amenity-item>
            <x-client.amenity-item value="1" label="bathroom" value-id="bathrooms">
              <x-slot:icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 6h6M12 3v3m4.7 13.7A7.5 7.5 0 1 1 19 12h-1.5M12 12v5"></path>
                  <circle cx="12" cy="12" r="9"></circle>
                </svg>
              </x-slot:icon>
            </x-client.amenity-item>
            <x-client.amenity-item value="1" label="dining room" value-id="diningRooms">
              <x-slot:icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </x-slot:icon>
            </x-client.amenity-item>
            <x-client.amenity-item value="10" label="mbps" value-id="wifi">
              <x-slot:icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"></path>
                  <circle cx="12" cy="12" r="9"></circle>
                </svg>
              </x-slot:icon>
            </x-client.amenity-item>
            <x-client.amenity-item value="7" label="unit ready" value-id="unitReady">
              <x-slot:icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </x-slot:icon>
            </x-client.amenity-item>
            <x-client.amenity-item value="1" label="refrigerator" value-id="refrigerator">
              <x-slot:icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <path d="M3 9h18"></path>
                  <path d="M9 21V9"></path>
                </svg>
              </x-slot:icon>
            </x-client.amenity-item>
            <x-client.amenity-item value="2" label="television" value-id="television">
              <x-slot:icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                  <polyline points="17 2 12 7 7 2"></polyline>
                </svg>
              </x-slot:icon>
            </x-client.amenity-item>
          </div>
        </div>

        <div class="booking-card">
          <h3 class="booking-title">Start Booking</h3>
          <div class="price-display">
            <span class="price-amount" id="priceAmount">$200</span>
            <span class="price-period">per Day</span>
          </div>
          <a href="{{ route('client.booking') }}" class="book-now-button" id="bookNowBtn" style="text-decoration: none; display: inline-block;">Book Now!</a>
          <div class="booking-info">
            <p class="info-text">
              You will be redirected to complete your booking
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
@endsection

