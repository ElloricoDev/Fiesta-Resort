@extends('layouts.client')

@php
  use Illuminate\Support\Str;
@endphp

@section('title', 'Our Rooms - Fiesta Resort')

@push('styles')
  @vite('resources/css/client/hotels.css')
@endpush

@push('scripts')
  @vite('resources/js/client/hotels.js')
@endpush

@section('content')
  <x-client.page-header 
    title="Our Rooms"
    description="Choose from our selection of comfortable and well-appointed rooms at Fiesta Resort"
  />

  <section class="filters-section">
    <div class="filters-container">
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
          'price-high' => 'Price: High to Low'
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
        <span id="roomsCount">{{ $roomTypes->count() }}</span> room {{ $roomTypes->count() == 1 ? 'type' : 'types' }} available
      </div>

      @if($checkIn && $checkOut)
        <div class="search-info" style="margin-bottom: 1rem; padding: 1rem; background: #f0f9ff; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <p style="margin: 0; color: #1e40af; font-weight: 600;">
              <strong>Search Results:</strong> 
              Check-in: {{ \Carbon\Carbon::parse($checkIn)->format('M d, Y') }} | 
              Check-out: {{ \Carbon\Carbon::parse($checkOut)->format('M d, Y') }} | 
              Guests: {{ $persons }}
            </p>
            <p style="margin: 0.5rem 0 0 0; color: #64748b; font-size: 0.9rem;">
              Showing rooms available for your selected dates and occupancy
            </p>
          </div>
          <a href="{{ route('client.rooms') }}" class="reset-filters-btn" style="text-decoration: none; display: inline-block;">
            Clear Search
          </a>
        </div>
      @endif

      <div class="hotels-grid">
        @forelse($roomTypes as $roomType)
          <div class="hotel-card"
            data-price="{{ $roomType['price'] }}"
            data-room-type="{{ $roomType['room_type'] }}">
            <div class="card-image">
              <img src="{{ asset('assets/' . $roomType['image']) }}" alt="{{ $roomType['room_type'] }}" />
              <div class="card-price">₱{{ number_format($roomType['price'], 0) }} per night</div>
              @if (!empty($roomType['badge']))
                <div class="card-badge {{ Str::lower($roomType['badge']) }}">{{ $roomType['badge'] }}</div>
              @endif
            </div>
            <div class="card-content">
              <div class="card-header">
                <h3 class="card-title">{{ $roomType['room_type'] }}</h3>
              </div>
              <p class="card-location">Brgy. Ipil, Surigao City, Surigao del Norte</p>
              <p class="card-description">
                @if($checkIn && $checkOut)
                  {{ $roomType['room_count'] }} {{ $roomType['room_count'] == 1 ? 'room' : 'rooms' }} available for your selected dates.
                @else
                  {{ $roomType['room_count'] }} {{ $roomType['room_count'] == 1 ? 'room' : 'rooms' }} available.
                @endif
                Comfortable and well-appointed accommodation with modern amenities.
              </p>
              <div class="card-features">
                @foreach ($roomType['features'] as $feature)
                  <span class="feature-tag">{{ $feature }}</span>
                @endforeach
              </div>
              <a href="{{ route('client.room-type-details') }}?room_type={{ urlencode($roomType['room_type']) }}@if($checkIn && $checkOut)&check_in={{ $checkIn }}&check_out={{ $checkOut }}&persons={{ $persons }}@endif" class="book-now-btn" style="text-decoration: none; display: inline-block; text-align: center;">View Details</a>
            </div>
          </div>
        @empty
          <div class="empty-hotels-message" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            @if($checkIn && $checkOut)
              <p style="font-size: 1.25rem; color: #64748b; margin-bottom: 0.5rem;">No rooms available for your selected dates and criteria.</p>
              <p style="font-size: 1rem; color: #94a3b8; margin-bottom: 1.5rem;">Try adjusting your dates or number of guests, or <a href="{{ route('client.rooms') }}" style="color: #3b82f6; text-decoration: underline;">browse all available rooms</a>.</p>
            @else
              <p style="font-size: 1.25rem; color: #64748b; margin-bottom: 1rem;">No rooms available at the moment.</p>
            @endif
            <button class="reset-filters-btn" onclick="document.getElementById('resetFilters').click()">Reset Filters</button>
          </div>
        @endforelse
      </div>
    </div>
  </section>
@endsection

