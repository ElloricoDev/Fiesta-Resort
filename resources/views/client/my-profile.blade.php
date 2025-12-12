@extends('layouts.client')

@section('title', 'My Profile - Fiesta Resort')

@push('styles')
  @vite('resources/css/client/my-profile.css')
@endpush

@push('scripts')
  @vite('resources/js/client/my-profile.js')
@endpush

@section('content')
  <x-client.page-header 
    :title="$user->name ?? 'User'"
    :description="$user->email ?? ''"
    :show-avatar="true"
    title-id="profileName"
    subtitle-id="profileEmail"
  />

  <section class="profile-section">
    <div class="profile-container">
      <div class="profile-sidebar">
        <nav class="profile-nav">
          <button class="profile-nav-item active" data-tab="overview" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Overview
          </button>
          <button class="profile-nav-item" data-tab="personal" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Personal Info
          </button>
          <button class="profile-nav-item" data-tab="security" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Security
          </button>
          <button class="profile-nav-item" data-tab="preferences" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m5.2-13.2l-4.3 4.3m0 5.8l4.3 4.3M23 12h-6m-6 0H1m13.2 5.2l-4.3-4.3m0-5.8l-4.3-4.3"></path>
            </svg>
            Preferences
          </button>
        </nav>
      </div>

      <div class="profile-main">
        <div class="profile-tab active" id="overview-tab">
          <h2 class="tab-title">Account Overview</h2>
          <div class="stats-grid">
            <x-client.stat-card 
              :value="$totalBookings ?? 0"
              label="Total Bookings"
              value-id="totalBookings"
              icon-class="blue"
            >
              <x-slot:icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </x-slot:icon>
            </x-client.stat-card>
            <x-client.stat-card 
              :value="$completedBookings ?? 0"
              label="Completed"
              value-id="completedBookings"
              icon-class="green"
            >
              <x-slot:icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </x-slot:icon>
            </x-client.stat-card>
            <x-client.stat-card 
              :value="$upcomingBookings ?? 0"
              label="Upcoming"
              value-id="upcomingBookings"
              icon-class="orange"
            >
              <x-slot:icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </x-slot:icon>
            </x-client.stat-card>
            <x-client.stat-card 
              :value="'₱' . number_format($totalSpent ?? 0, 0)"
              label="Total Spent"
              value-id="totalSpent"
              icon-class="purple"
            >
              <x-slot:icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </x-slot:icon>
            </x-client.stat-card>
          </div>

          <div class="quick-actions">
            <h3 class="section-subtitle">Quick Actions</h3>
            <div class="actions-grid">
              <a href="{{ route('client.my-bookings') }}" class="action-card" data-auth-transition>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>View My Bookings</span>
              </a>
              <a href="{{ route('client.rooms') }}" class="action-card" data-auth-transition>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>Browse Hotels</span>
              </a>
              <button class="action-card" type="button" onclick="switchTab('personal')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Edit Profile</span>
              </button>
              <button class="action-card" type="button" onclick="switchTab('security')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Change Password</span>
              </button>
            </div>
          </div>

          <div class="recent-activity">
            <h3 class="section-subtitle">Recent Bookings</h3>
            <div id="recentBookingsList">
              @forelse($recentBookings ?? [] as $booking)
                <div class="activity-item">
                  <div class="activity-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div class="activity-info">
                    <h4>{{ $booking->room_type ?? 'Booking' }}</h4>
                    <p>{{ $booking->check_in->format('M d, Y') }} - {{ $booking->check_out->format('M d, Y') }}</p>
                  </div>
                  <div class="activity-status">
                    <span class="status-badge status-{{ strtolower($booking->status) }}">{{ ucfirst($booking->status) }}</span>
                  </div>
                </div>
              @empty
                <p class="empty-message">No recent bookings</p>
              @endforelse
            </div>
          </div>
        </div>

        <div class="profile-tab" id="personal-tab">
          <h2 class="tab-title">Personal Information</h2>
          <form class="profile-form" id="personalInfoForm">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" placeholder="Enter your first name" />
              </div>
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" placeholder="Enter your last name" />
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" readonly />
              <span class="field-note">Email cannot be changed</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" placeholder="+1 (555) 000-0000" />
              </div>
              <div class="form-group">
                <label for="dateOfBirth">Date of Birth</label>
                <input type="date" id="dateOfBirth" name="dateOfBirth" />
              </div>
            </div>

            <div class="form-group">
              <label for="address">Address</label>
              <input type="text" id="address" name="address" placeholder="Street address" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="city">City</label>
                <input type="text" id="city" name="city" placeholder="City" />
              </div>
              <div class="form-group">
                <label for="country">Country</label>
                <input type="text" id="country" name="country" placeholder="Country" />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Save Changes</button>
              <button type="button" class="btn btn-secondary" onclick="resetForm()">Cancel</button>
            </div>
          </form>
        </div>

        <div class="profile-tab" id="security-tab">
          <h2 class="tab-title">Security Settings</h2>
          <div class="security-section">
            <h3 class="section-subtitle">Change Password</h3>
            <form class="profile-form" id="passwordForm">
              <div class="form-group">
                <label for="currentPassword">Current Password</label>
                <input type="password" id="currentPassword" name="currentPassword" placeholder="Enter current password" />
              </div>
              <div class="form-group">
                <label for="newPassword">New Password</label>
                <input type="password" id="newPassword" name="newPassword" placeholder="Enter new password" />
                <span class="field-note">Password must be at least 6 characters</span>
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirm New Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm new password" />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Update Password</button>
              </div>
            </form>
          </div>

          <div class="security-section">
            <h3 class="section-subtitle">Account Security</h3>
            <div class="security-info">
              <div class="security-item">
                <div class="security-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div class="security-item-info">
                  <h4>Account Status</h4>
                  <p>Your account is active and secure</p>
                </div>
              </div>
              <div class="security-item">
                <div class="security-item-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div class="security-item-info">
                  <h4>Last Login</h4>
                  <p id="lastLogin">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-tab" id="preferences-tab">
          <h2 class="tab-title">Preferences</h2>
          <div class="preferences-section">
            <h3 class="section-subtitle">Notifications</h3>
            <div class="preference-item">
              <div class="preference-info">
                <h4>Email Notifications</h4>
                <p>Receive booking confirmations and updates via email</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="emailNotifications" checked />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="preference-item">
              <div class="preference-info">
                <h4>Promotional Emails</h4>
                <p>Receive special offers and promotional content</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="promotionalEmails" checked />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="preference-item">
              <div class="preference-info">
                <h4>Booking Reminders</h4>
                <p>Get reminders before your check-in date</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="bookingReminders" checked />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="preferences-section">
            <h3 class="section-subtitle">Display Settings</h3>
            <div class="form-group">
              <label for="currency">Preferred Currency</label>
              <select id="currency" name="currency">
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="PHP">PHP - Philippine Peso</option>
              </select>
            </div>
            <div class="form-group">
              <label for="language">Language</label>
              <select id="language" name="language">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-primary" type="button" onclick="savePreferences()">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
@endsection

