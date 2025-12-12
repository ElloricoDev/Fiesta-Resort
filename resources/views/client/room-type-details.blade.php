@extends('layouts.client')

@section('title', 'Room Type Details - Fiesta Resort')

@push('styles')
  @vite('resources/css/client/hotel-details.css')
@endpush

@push('scripts')
  @vite('resources/js/client/hotel-details.js')
@endpush

@section('content')
  <main class="details-main">
    <div class="details-container">
      <x-client.breadcrumb 
        :items="[
          ['label' => 'Home', 'url' => route('client.home')],
          ['label' => 'Rooms', 'url' => route('client.rooms')],
          ['label' => $roomType ?? 'Room Details']
        ]"
      />

      <div class="hotel-header">
        <h1 class="hotel-name" id="roomTypeName">{{ $roomType ?? 'All Room Types' }}</h1>
        <p class="hotel-location" id="resortLocation">Fiesta Resort • Brgy. Ipil, Surigao City, Surigao del Norte</p>
      </div>

      @if($selectedRoomType)
        <div class="hotel-images">
          <div class="main-image">
            @php
              $roomImages = [
                'Standard Room' => 'FiestaResort1.jpg',
                'Deluxe King Suite' => 'FiestaResort2.jpg',
                'Executive Suite' => 'FiestaResort3.jpg',
                'Presidential Suite' => 'FiestaResort4.jpg',
              ];
              $image = $roomImages[$selectedRoomType->room_type] ?? 'FiestaResort1.jpg';
            @endphp
            <img src="{{ asset('assets/' . $image) }}" alt="{{ $selectedRoomType->room_type }}" id="mainImage" />
          </div>
          <div class="secondary-image">
            <img src="{{ asset('assets/FiestaResort5.jpg') }}" alt="Resort View" id="secondaryImage" />
          </div>
        </div>
      @else
        <div class="hotel-images">
          <div class="main-image">
            <img src="{{ asset('assets/FiestaResort1.jpg') }}" alt="Fiesta Resort" id="mainImage" />
          </div>
          <div class="secondary-image">
            <img src="{{ asset('assets/FiestaResort5.jpg') }}" alt="Resort View" id="secondaryImage" />
          </div>
        </div>
      @endif

      <section class="available-rooms">
        <h2 class="section-title">Available Room Types</h2>
        <p class="section-description" style="margin-bottom: 2rem; color: #64748b;">
          Browse all our room types available at Fiesta Resort. Each room type offers unique features and amenities to make your stay comfortable and memorable.
        </p>
        <div class="rooms-grid" id="roomsGrid">
          @php
            $roomImages = [
              'Standard Room' => 'FiestaResort1.jpg',
              'Deluxe King Suite' => 'FiestaResort2.jpg',
              'Executive Suite' => 'FiestaResort3.jpg',
              'Presidential Suite' => 'FiestaResort4.jpg',
            ];
            $roomTypeMapping = [
              'Standard Room' => 'standard',
              'Deluxe King Suite' => 'deluxe',
              'Executive Suite' => 'executive',
              'Presidential Suite' => 'presidential',
            ];
          @endphp
          @forelse($roomTypes as $roomType)
            @php
              $type = $roomType['type'];
              $count = $roomCounts[$type] ?? 0;
              $price = $roomType['price_per_night'] ?? $roomType['min_price'] ?? 0;
              $mappedType = $roomTypeMapping[$type] ?? strtolower(str_replace(' ', '-', $type));
            @endphp
            <x-client.room-card 
              name="{{ $type }}"
              price="₱{{ number_format($price, 0) }} per night"
              image="{{ $roomImages[$type] ?? 'FiestaResort1.jpg' }}"
              badge="{{ $count > 0 && $count <= 2 ? 'Limited' : ($count > 5 ? 'Popular' : null) }}"
              :url="route('client.room-details') . '?room=' . $mappedType . '&room_type=' . urlencode($type)"
              :data-attributes="['room-type' => $mappedType, 'room-name' => $type]"
            />
          @empty
            <div class="empty-rooms-message">
              <p>No rooms available at the moment. Please check back later.</p>
            </div>
          @endforelse
        </div>
      </section>
    </div>
  </main>

  @section('footer')
    <footer class="details-footer">
      <div class="become-owner-section">
        <div class="owner-content">
          <div class="owner-left">
            <span class="fiesta-text">Fiesta</span><span class="resort-text">Resort</span>
            <p class="owner-tagline">
              We kaboom your beauty holiday instantly and memorable.
            </p>
          </div>
          <div class="owner-right">
            <span class="owner-question">You're not registered yet?</span>
            <a href="{{ route('register') }}" class="register-now-btn" data-auth-transition>Register Now</a>
          </div>
        </div>
      </div>
      <div class="copyright-footer">
        <p>Copyright {{ now()->year }} • All rights reserved • Fiesta Resort</p>
      </div>
    </footer>
  @endsection
@endsection

