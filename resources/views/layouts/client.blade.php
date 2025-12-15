<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Fiesta Resort')</title>
    @vite([
      'resources/css/client/home.css',
      'resources/js/client/home.js',
    ])
    @stack('styles')
    @php
      $userData = auth()->check() ? [
        'email' => auth()->user()->email,
        'name' => auth()->user()->name,
        'role' => auth()->user()->role ?? 'user',
      ] : null;
    @endphp
    <script>
      // Pass Laravel authenticated user data to JavaScript
      window.laravelAuth = {
        isAuthenticated: {{ auth()->check() ? 'true' : 'false' }},
        user: @json($userData),
        logoutUrl: "{{ route('logout') }}",
        csrfToken: "{{ csrf_token() }}",
      };
    </script>
  </head>
  <body>
    @yield('banner')

    <header class="main-header">
      <div class="header-container">
        <div class="logo">
          <a href="{{ url('/') }}" style="text-decoration: none; color: inherit">
            <span class="fiesta-text">Fiesta</span><span class="resort-text">Resort</span>
          </a>
        </div>

        @php
          $homeRoute = url('/');
          $isHomePage = request()->routeIs('home') || request()->path() === '/';
        @endphp

        <nav class="main-nav">
          <a href="{{ $homeRoute }}#home" class="nav-link scroll-link" data-section="home">Home</a>
          <a href="{{ $homeRoute }}#rooms" class="nav-link scroll-link rooms-link" data-section="rooms">Rooms</a>
          <a href="{{ route('client.my-bookings') }}" class="nav-link my-bookings-link {{ request()->routeIs('client.my-bookings') ? 'active' : '' }}" id="myBookingsNavLink" style="display: none;">My Bookings</a>
          <a href="{{ $homeRoute }}#about" class="nav-link scroll-link" data-section="about">About</a>
          <a href="{{ $homeRoute }}#contact" class="nav-link scroll-link" data-section="contact">Contact</a>
        </nav>

        <div class="header-actions">
          @auth
          <div class="user-menu" id="userMenu" style="display: block">
            <button class="user-menu-btn" id="userMenuBtn" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span id="userName">{{ auth()->user()->name }}</span>
            </button>
            <div class="user-dropdown" id="userDropdown">
              <a href="{{ route('client.my-profile') }}" class="dropdown-item">My Profile</a>
              <a href="{{ route('client.my-bookings') }}" class="dropdown-item">My Bookings</a>
              {{-- Admin users are redirected away from client pages, so no admin link needed here --}}
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" id="logoutBtn" type="button">Log Out</button>
            </div>
          </div>
          @else
          <a href="{{ route('login') }}" class="login-btn" id="loginBtn">Login</a>
          <div class="user-menu" id="userMenu" style="display: none">
            <button class="user-menu-btn" id="userMenuBtn" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span id="userName">User</span>
            </button>
            <div class="user-dropdown" id="userDropdown">
              <a href="{{ route('client.my-profile') }}" class="dropdown-item">My Profile</a>
              <a href="{{ route('client.my-bookings') }}" class="dropdown-item">My Bookings</a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" id="logoutBtn" type="button">Log Out</button>
            </div>
          </div>
          @endauth
        </div>
      </div>
    </header>

    <main>
      @yield('content')
    </main>

    @hasSection('footer')
      @yield('footer')
    @else
      <footer class="main-footer">
        <div class="footer-container">
          <p>Copyright {{ now()->year }} • All rights reserved • Fiesta Resort</p>
        </div>
      </footer>
    @endif

    <!-- Logout Confirmation Modal -->
    <x-client.confirmation-modal 
      id="logoutModal"
      title="Confirm Logout"
      message="Are you sure you want to log out?"
      confirm-text="Log Out"
      cancel-text="Cancel"
    />

    <!-- Toast Notification Container -->
    <x-client.toast-notification id="clientToastContainer" />

    @stack('scripts')
    @vite('resources/js/utils/notifications.js')
  </body>
</html>

