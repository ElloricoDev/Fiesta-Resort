@extends('layouts.admin')

@section('title', 'Profile - Fiesta Resort')

@push('styles')
  @vite('resources/css/admin/profile.css')
@endpush

@push('scripts')
  @vite('resources/js/admin/profile.js')
@endpush

@section('content')
  <h1 class="page-title">Profile</h1>

  <div class="profile-container" id="profileContainer">
    <div class="profile-section">
      <label class="section-label" for="fullName">Full Name</label>
      <input type="text" class="profile-input" id="fullName" value="Admin Sample Name" disabled />
    </div>

    <div class="profile-row">
      <div class="profile-section">
        <label class="section-label" for="email">Email Address</label>
        <input type="email" class="profile-input" id="email" value="admin@gmail.com" disabled />
      </div>
      <div class="profile-section">
        <label class="section-label" for="phoneNumber">Phone Number</label>
        <div class="phone-input-group">
          <select class="country-code-select" id="countryCode" disabled>
            <option value="+63">+63 (PH)</option>
            <option value="+1">+1 (US)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+81">+81 (JP)</option>
            <option value="+86">+86 (CN)</option>
          </select>
          <input type="tel" class="profile-input phone-number-input" id="phoneNumber" value="9123438903" disabled />
        </div>
      </div>
    </div>

    <div class="profile-section">
      <label class="section-label" for="address">Address</label>
      <textarea class="profile-textarea" id="address" disabled>Sitio Dacuman, Barangay Ipil, Surigao City, 8400, PH</textarea>
    </div>

    <div class="password-section">
      <h3 style="font-size: 18px; margin-bottom: 20px; color: #1a1a1a">Change Password</h3>

      <div class="profile-section">
        <label class="section-label" for="currentPassword">Current Password</label>
        <input type="password" class="profile-input" id="currentPassword" placeholder="Enter current password" />
      </div>

      <div class="profile-row">
        <div class="profile-section">
          <label class="section-label" for="newPassword">New Password</label>
          <input type="password" class="profile-input" id="newPassword" placeholder="Enter new password" />
          <div class="password-info">Minimum 6 characters</div>
        </div>
        <div class="profile-section">
          <label class="section-label" for="confirmPassword">Confirm New Password</label>
          <input type="password" class="profile-input" id="confirmPassword" placeholder="Confirm new password" />
        </div>
      </div>
    </div>

    <div class="profile-actions">
      <button class="profile-btn cancel-btn" id="cancelBtn" type="button">Cancel</button>
      <button class="profile-btn save-btn" id="saveBtn" type="button">Save Changes</button>
      <button class="profile-btn edit-btn" id="editBtn" type="button">Edit Profile</button>
    </div>
  </div>
@endsection

