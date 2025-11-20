@extends('layouts.client')

@section('title', 'Fiesta Resort - Your Beauty Holiday Destination')

{{-- Top banner removed --}}

@section('content')
  <section class="hero-section" id="home">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">Forget Busy Work,<br />Start Next Vacation</h1>
        <p class="hero-description">
          We provide what you need to enjoy your holiday with family. Time to
          make another memorable moments.
        </p>
        <button class="show-more-btn">Show More</button>

        <div class="stats-container">
          <x-client.stat-item value="2500" label="Users">
            <x-slot:icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </x-slot:icon>
          </x-client.stat-item>
          <x-client.stat-item value="200" label="Treasure">
            <x-slot:icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </x-slot:icon>
          </x-client.stat-item>
          <x-client.stat-item value="100" label="Cities">
            <x-slot:icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </x-slot:icon>
          </x-client.stat-item>
        </div>
      </div>

      <div class="hero-image">
        <img src="{{ asset('assets/FiestaResort1.jpg') }}" alt="Fiesta Resort Pool" />
      </div>
    </div>
  </section>

  <section class="search-section">
    <div class="search-container">
      <div class="search-bar">
        <button class="search-field">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Check Available</span>
        </button>

        <div class="search-field-dropdown">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span class="dropdown-label">Person</span>
          <span class="dropdown-value">2</span>
          <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        <button class="search-field">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>Select Location</span>
        </button>

        <button class="search-btn">Search</button>
      </div>
    </div>
  </section>

  <section class="hotels-section" id="hotels">
    <div class="section-container">
      <div class="section-header">
        <h2 class="section-title">Hotels</h2>
        <a href="{{ route('client.hotels') }}" class="view-all-btn">View All</a>
      </div>
      <div class="hotels-grid">
        @foreach ([
            ['title' => 'Blue Origin Farms', 'location' => 'Galle, Sri Lanka', 'price' => 50, 'rating' => 4.8, 'features' => ['Free WiFi', 'Pool'], 'image' => 'FiestaResort1.jpg'],
            ['title' => 'Ocean Land', 'location' => 'Trincomalee, Sri Lanka', 'price' => 22, 'rating' => 4.5, 'features' => ['Free WiFi'], 'image' => 'FiestaResort2.jpg'],
            ['title' => 'Stark House', 'location' => 'Dehiwala, Sri Lanka', 'price' => 856, 'rating' => 5.0, 'features' => ['Spa', 'Fine Dining'], 'image' => 'FiestaResort3.jpg'],
            ['title' => 'Vinna Vill', 'location' => 'Beruwala, Sri Lanka', 'price' => 62, 'rating' => 4.6, 'features' => ['Garden View'], 'image' => 'FiestaResort4.jpg'],
            ['title' => 'Babox', 'location' => 'Kandy, Sri Lanka', 'price' => 72, 'rating' => 4.7, 'features' => ['Mountain View'], 'image' => 'FiestaResort5.jpg'],
        ] as $hotel)
          <x-client.hotel-card 
            title="{{ $hotel['title'] }}"
            location="{{ $hotel['location'] }}"
            :price="$hotel['price']"
            :rating="$hotel['rating']"
            image="{{ $hotel['image'] }}"
            :features="$hotel['features']"
            :url="route('client.hotel-details') . '?hotel=' . strtolower(str_replace(' ', '-', $hotel['title']))"
          >
            Beautiful property with modern amenities.
          </x-client.hotel-card>
        @endforeach
      </div>
    </div>
  </section>

  <section class="rooms-section" id="rooms">
    <div class="section-container">
      <h2 class="section-title">Rooms</h2>
      <div class="rooms-grid">
        @foreach ([
            ['title' => 'Shangri-La', 'location' => 'Colombo, Sri Lanka', 'image' => 'FiestaResort1.jpg', 'type' => 'single', 'badge' => 'Popular Choice'],
            ['title' => 'Top View', 'location' => 'Hikkaduwa, Sri Lanka', 'image' => 'FiestaResort2.jpg', 'type' => 'double'],
            ['title' => 'Green Villa', 'location' => 'Kandy, Sri Lanka', 'image' => 'FiestaResort3.jpg', 'type' => 'deluxe'],
            ['title' => 'Wodden Pit', 'location' => 'Ambalangoda, Sri Lanka', 'image' => 'FiestaResort4.jpg', 'type' => 'suite'],
            ['title' => 'Boutiqe', 'location' => 'Kandy, Sri Lanka', 'image' => 'FiestaResort5.jpg', 'type' => 'single'],
            ['title' => 'Modern', 'location' => 'Nuwereeliya, Sri Lanka', 'image' => 'FiestaResort1.jpg', 'type' => 'double'],
            ['title' => 'Silver Rain', 'location' => 'Dehiwala, Sri Lanka', 'image' => 'FiestaResort2.jpg', 'type' => 'deluxe'],
            ['title' => 'Cashville', 'location' => 'Ampara, Sri Lanka', 'image' => 'FiestaResort3.jpg', 'type' => 'suite', 'badge' => 'Popular Choice'],
        ] as $room)
          <x-client.hotel-card 
            title="{{ $room['title'] }}"
            location="{{ $room['location'] }}"
            :price="0"
            :rating="0"
            image="{{ $room['image'] }}"
            badge="{{ $room['badge'] ?? null }}"
            :url="route('client.room-details') . '?room=' . $room['type'] . '&hotel=' . urlencode($room['title'])"
            :data-attributes="['room-type' => $room['type'], 'room-name' => $room['title']]"
          />
        @endforeach
      </div>
    </div>
  </section>

  <section class="about-section" id="about">
    <div class="section-container">
      <h2 class="section-title">About Us</h2>
      <div class="about-intro-grid">
        <div class="about-intro-image">
          <img src="{{ asset('assets/FiestaResort1.jpg') }}" alt="Fiesta Resort Pool" />
        </div>
        <div class="about-intro-content">
          <p class="about-intro-text">
            Welcome to Fiesta Resort, Surigao City. Nestled along the scenic
            coast of Surigao City, Fiesta Resort is your perfect escape for
            relaxation, adventure, and authentic island hospitality.
          </p>
        </div>
      </div>

      <div class="about-subsection">
        <h3 class="subsection-title">Our Resort Experience</h3>
        <p class="subsection-text">
          At Fiesta Resort, we take pride in creating a warm and relaxing
          atmosphere for every guest.
        </p>
        <p class="subsection-text">
          Guests can indulge in local Surigaonon cuisine at
          our on-site restaurant, often complemented by a free breakfast to
          start your day right.
        </p>
      </div>

      <div class="treasures-subsection">
        <h3 class="subsection-title">Discover Surigao's Natural Treasures</h3>
        <div class="treasures-grid">
          <div class="treasures-content">
            <p class="treasures-intro">
              Fiesta Resort is more than just a place to stay — it's your
              gateway to Surigao's vibrant eco-tourism scene.
            </p>
            <ul class="treasures-list">
              <li><strong>Island Hopping:</strong> Explore Basul and Hikdop
                Islands for snorkeling, kayaking, and beach adventures.
              </li>
              <li><strong>Mangrove Exploration:</strong> Cruise through the
                waterways of the Day-asan Mangrove Forest.</li>
              <li><strong>Inland Excursions:</strong> Take a refreshing dip at
                Songkoy Cold Spring or visit the Rock and Mineral Museum.</li>
            </ul>
          </div>
          <div class="treasures-image">
            <img src="{{ asset('assets/FiestaResort5.jpg') }}" alt="Surigao Natural Beauty" />
          </div>
        </div>
      </div>

      <div class="local-life-subsection">
        <h3 class="subsection-title">Relax, Explore, and Experience Local Life</h3>
        <p class="subsection-text">
          Whether you're enjoying a peaceful afternoon by the pool, strolling
          along the Surigao City Boulevard, or discovering hidden gems across
          the islands, Fiesta Resort provides a balance of relaxation,
          culture, and adventure.
        </p>
        <p class="subsection-highlight">Your Surigao Getaway Awaits</p>
        <p class="subsection-text">
          At Fiesta Resort, every day feels like a celebration. Let us be your
          home as you discover the beauty, culture, and charm of Surigao City.
        </p>
        <div class="sunset-image">
          <img src="{{ asset('assets/FiestaResort4.jpg') }}" alt="Surigao Sunset" />
        </div>
      </div>
    </div>
  </section>

  <section class="contact-section" id="contact">
    <div class="section-container">
      <h2 class="section-title contact-title">Contact us</h2>
      <div class="contact-grid">
        <div class="contact-info">
          <h3 class="contact-subtitle">Get in Touch</h3>
          <p class="contact-intro">
            We're here to help and answer any question you might have.
          </p>
          <div class="contact-block">
            <h4 class="contact-heading">Address</h4>
            <p class="contact-detail">123 Resort Avenue</p>
            <p class="contact-detail">456 Brgy Ipil</p>
          </div>
          <div class="contact-block">
            <h4 class="contact-heading">Phone</h4>
            <p class="contact-detail">09123456789</p>
            <p class="contact-detail">09987654321</p>
          </div>
          <div class="contact-block">
            <h4 class="contact-heading">Email</h4>
            <p class="contact-detail">info@fiestaresort.com</p>
            <p class="contact-detail">bookings@fiestaresort.com</p>
          </div>
          <div class="contact-block">
            <h4 class="contact-heading">Business Hours</h4>
            <p class="contact-detail">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p class="contact-detail">Saturday - Sunday: 10:00 AM - 4:00 PM</p>
          </div>
        </div>

        <div class="contact-form-wrapper">
          <h3 class="contact-subtitle">Send us a Message</h3>
          <form class="contact-form" id="contactForm">
            <div class="form-field">
              <label class="field-label">Full Name</label>
              <input type="text" class="field-input" id="fullName" name="fullName" required />
            </div>
            <div class="form-field">
              <label class="field-label">Email Address</label>
              <input type="email" class="field-input" id="emailAddress" name="emailAddress" required />
            </div>
            <div class="form-field">
              <label class="field-label">Phone Number</label>
              <input type="tel" class="field-input" id="phoneNumber" name="phoneNumber" required />
            </div>
            <div class="form-field">
              <label class="field-label">Subject</label>
              <input type="text" class="field-input" id="subject" name="subject" required />
            </div>
            <div class="form-field">
              <label class="field-label">Message</label>
              <textarea class="field-textarea" id="message" name="message" rows="6" required></textarea>
            </div>
            <button type="submit" class="send-message-btn">
              Send a Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
@endsection

