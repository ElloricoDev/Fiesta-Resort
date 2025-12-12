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
          'surigao-city' => 'Surigao City',
          'brgy-ipil' => 'Brgy. Ipil',
          'surigao-del-norte' => 'Surigao del Norte'
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
          '0-2000' => 'Under ₱2,000',
          '2000-3000' => '₱2,000 - ₱3,000',
          '3000-4000' => '₱3,000 - ₱4,000',
          '4000+' => '₱4,000+'
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
        <span id="hotelsCount">{{ $hotels->count() }}</span> hotels found
      </div>

      @if($checkIn && $checkOut)
        <div class="search-info" style="margin-bottom: 1rem; padding: 1rem; background: #f0f9ff; border-radius: 8px;">
          <p style="margin: 0; color: #1e40af;">
            <strong>Search Results:</strong> 
            Check-in: {{ \Carbon\Carbon::parse($checkIn)->format('M d, Y') }} | 
            Check-out: {{ \Carbon\Carbon::parse($checkOut)->format('M d, Y') }} | 
            Guests: {{ $persons }}
            @if($location)
              | Location: {{ ucfirst(str_replace('-', ' ', $location)) }}
            @endif
          </p>
        </div>
      @endif

      <div class="hotels-grid">
        @forelse($hotels as $hotel)
          <div class="hotel-card"
            data-location="{{ Str::lower(Str::before($hotel['location'], ',')) }}"
            data-price="{{ $hotel['price'] }}"
            data-room-type="{{ $hotel['room_type'] }}">
            <div class="card-image">
              <img src="{{ asset('assets/' . $hotel['image']) }}" alt="{{ $hotel['title'] }}" />
              <div class="card-price">₱{{ number_format($hotel['price'], 0) }} per night</div>
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
                {{ $hotel['room_count'] }} {{ $hotel['room_count'] == 1 ? 'room' : 'rooms' }} available. Beautiful property with modern amenities.
              </p>
              <div class="card-features">
                @foreach ($hotel['features'] as $feature)
                  <span class="feature-tag">{{ $feature }}</span>
                @endforeach
              </div>
              <a href="{{ route('client.hotel-details') }}?hotel={{ urlencode($hotel['title']) }}" class="book-now-btn" style="text-decoration: none; display: inline-block; text-align: center;">View Details</a>
            </div>
          </div>
        @empty
          <div class="empty-hotels-message" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <p style="font-size: 1.25rem; color: #64748b; margin-bottom: 1rem;">No hotels found matching your criteria.</p>
            <button class="reset-filters-btn" onclick="document.getElementById('resetFilters').click()">Reset Filters</button>
          </div>
        @endforelse
      </div>
    </div>
  </section>
@endsection


