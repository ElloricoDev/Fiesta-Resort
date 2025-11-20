@extends('layouts.client')

@section('title', 'Hotel Details - Fiesta Resort')

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
          ['label' => 'Hotel Details']
        ]"
      />

      <div class="hotel-header">
        <h1 class="hotel-name" id="hotelName">Blue Origin Fams</h1>
        <p class="hotel-location" id="hotelLocation">Galle, Sri Lanka</p>
      </div>

      <div class="hotel-images">
        <div class="main-image">
          <img src="{{ asset('assets/FiestaResort1.jpg') }}" alt="Hotel Main View" id="mainImage" />
        </div>
        <div class="secondary-image">
          <img src="{{ asset('assets/FiestaResort5.jpg') }}" alt="Hotel Secondary View" id="secondaryImage" />
        </div>
      </div>

      <section class="available-rooms">
        <h2 class="section-title">Available Rooms</h2>
        <div class="rooms-grid">
          @foreach ([
              ['type' => 'single', 'name' => 'Single Room', 'price' => '$200 per night', 'image' => 'FiestaResort1.jpg'],
              ['type' => 'double', 'name' => 'Double Room', 'price' => '$350 per night', 'image' => 'FiestaResort2.jpg'],
              ['type' => 'deluxe', 'name' => 'Deluxe Room', 'price' => '$500 per night', 'image' => 'FiestaResort3.jpg', 'badge' => 'Popular Choice'],
              ['type' => 'suite', 'name' => 'Presidential Suite', 'price' => '$850 per night', 'image' => 'FiestaResort4.jpg'],
          ] as $room)
            <x-client.room-card 
              name="{{ $room['name'] }}"
              price="{{ $room['price'] }}"
              image="{{ $room['image'] }}"
              badge="{{ $room['badge'] ?? null }}"
              :url="route('client.room-details') . '?room=' . $room['type'] . '&hotel=' . urlencode($hotelName ?? 'Fiesta Resort') . '&roomName=' . urlencode($room['name'])"
              :data-attributes="['room-type' => $room['type'], 'room-name' => $room['name']]"
            />
          @endforeach
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

