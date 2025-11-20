@extends('layouts.client')

@php
  use Illuminate\Support\Str;
@endphp

@section('title', 'All Hotels - Fiesta Resort')

@push('styles')
  @vite('resources/css/client/hotels.css')
@endpush

@push('scripts')
  @vite('resources/js/client/hotels.js')
@endpush

@section('content')
  <x-client.page-header 
    title="Explore All Hotels"
    description="Find your perfect getaway from our collection of beautiful hotels"
  />

  <section class="filters-section">
    <div class="filters-container">
      <x-client.filter-group 
        label="Location"
        select-id="locationFilter"
        placeholder="All Locations"
        :options="[
          'colombo' => 'Colombo',
          'galle' => 'Galle',
          'kandy' => 'Kandy',
          'trincomalee' => 'Trincomalee',
          'dehiwala' => 'Dehiwala',
          'beruwala' => 'Beruwala'
        ]"
      >
        <x-slot:icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </x-slot:icon>
      </x-client.filter-group>

      <x-client.filter-group 
        label="Price Range"
        select-id="priceFilter"
        placeholder="All Prices"
        :options="[
          '0-50' => 'Under $50',
          '50-100' => '$50 - $100',
          '100-500' => '$100 - $500',
          '500+' => '$500+'
        ]"
      >
        <x-slot:icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </x-slot:icon>
      </x-client.filter-group>

      <x-client.filter-group 
        label="Sort By"
        select-id="sortFilter"
        :options="[
          'featured' => 'Featured',
          'price-low' => 'Price: Low to High',
          'price-high' => 'Price: High to Low',
          'rating' => 'Rating'
        ]"
      >
        <x-slot:icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </x-slot:icon>
      </x-client.filter-group>

      <button class="reset-filters-btn" id="resetFilters" type="button">
        Reset Filters
      </button>
    </div>
  </section>

  <section class="all-hotels-section">
    <div class="section-container">
      <div class="hotels-count">
        <span id="hotelsCount">12</span> hotels found
      </div>

      <div class="hotels-grid">
        @foreach ([
            ['title' => 'Blue Origin Farms', 'location' => 'Galle, Sri Lanka', 'price' => 50, 'rating' => 4.8, 'features' => ['Free WiFi', 'Pool', 'Breakfast'], 'image' => 'FiestaResort1.jpg'],
            ['title' => 'Ocean Land', 'location' => 'Trincomalee, Sri Lanka', 'price' => 22, 'rating' => 4.5, 'features' => ['Free WiFi', 'Parking'], 'image' => 'FiestaResort2.jpg'],
            ['title' => 'Stark House', 'location' => 'Dehiwala, Sri Lanka', 'price' => 856, 'rating' => 5.0, 'features' => ['Spa', 'Fine Dining', 'Concierge'], 'image' => 'FiestaResort3.jpg', 'badge' => 'Luxury'],
            ['title' => 'Vinna Vill', 'location' => 'Beruwala, Sri Lanka', 'price' => 62, 'rating' => 4.6, 'features' => ['Garden View', 'Free WiFi', 'Parking'], 'image' => 'FiestaResort4.jpg'],
            ['title' => 'Babox', 'location' => 'Kandy, Sri Lanka', 'price' => 72, 'rating' => 4.7, 'features' => ['Mountain View', 'Restaurant', 'Pool'], 'image' => 'FiestaResort5.jpg'],
            ['title' => 'City Central Hotel', 'location' => 'Colombo, Sri Lanka', 'price' => 145, 'rating' => 4.9, 'features' => ['City Center', 'Gym', 'Business Center'], 'image' => 'FiestaResort1.jpg'],
            ['title' => 'Coastal Paradise', 'location' => 'Galle, Sri Lanka', 'price' => 89, 'rating' => 4.4, 'features' => ['Beach Access', 'Water Sports', 'Kids Club'], 'image' => 'FiestaResort2.jpg'],
            ['title' => 'Hill Country Manor', 'location' => 'Kandy, Sri Lanka', 'price' => 98, 'rating' => 4.8, 'features' => ['Tea Plantation', 'Hiking', 'Heritage'], 'image' => 'FiestaResort3.jpg'],
            ['title' => 'Metropolitan Suites', 'location' => 'Colombo, Sri Lanka', 'price' => 175, 'rating' => 4.9, 'features' => ['Rooftop Pool', 'City View', 'Spa'], 'image' => 'FiestaResort4.jpg'],
            ['title' => 'Sunrise Bay Resort', 'location' => 'Trincomalee, Sri Lanka', 'price' => 55, 'rating' => 4.3, 'features' => ['Diving', 'Snorkeling', 'Beach Bar'], 'image' => 'FiestaResort5.jpg'],
            ['title' => 'Palm Grove Resort', 'location' => 'Dehiwala, Sri Lanka', 'price' => 120, 'rating' => 4.7, 'features' => ['Garden', 'Restaurant', 'Yoga'], 'image' => 'FiestaResort1.jpg'],
            ['title' => 'Sunset Beach Villa', 'location' => 'Beruwala, Sri Lanka', 'price' => 78, 'rating' => 4.6, 'features' => ['Private Beach', 'Terrace', 'BBQ'], 'image' => 'FiestaResort2.jpg'],
        ] as $hotel)
          <div class="hotel-card"
            data-location="{{ Str::lower(Str::before($hotel['location'], ',')) }}"
            data-price="{{ $hotel['price'] }}">
            <div class="card-image">
              <img src="{{ asset('assets/' . $hotel['image']) }}" alt="{{ $hotel['title'] }}" />
              <div class="card-price">${{ $hotel['price'] }} per night</div>
              @if (!empty($hotel['badge']))
                <div class="card-badge {{ Str::lower($hotel['badge']) }}">{{ $hotel['badge'] }}</div>
              @endif
            </div>
            <div class="card-content">
              <div class="card-header">
                <h3 class="card-title">{{ $hotel['title'] }}</h3>
                <div class="card-rating">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{{ number_format($hotel['rating'], 1) }}</span>
                </div>
              </div>
              <p class="card-location">{{ $hotel['location'] }}</p>
              <p class="card-description">
                Beautiful beachfront property with stunning ocean views and
                modern amenities.
              </p>
              <div class="card-features">
                @foreach ($hotel['features'] as $feature)
                  <span class="feature-tag">{{ $feature }}</span>
                @endforeach
              </div>
              <button class="book-now-btn" type="button">Book Now</button>
            </div>
          </div>
        @endforeach
      </div>
    </div>
  </section>
@endsection

