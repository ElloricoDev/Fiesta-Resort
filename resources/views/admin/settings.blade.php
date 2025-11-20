@extends('layouts.admin')

@section('title', 'Settings - Fiesta Resort')

@push('styles')
  @vite('resources/css/admin/settings.css')
@endpush

@push('scripts')
  @vite('resources/js/admin/settings.js')
@endpush

@section('content')
  <h1 class="page-title">Settings</h1>

  <div class="settings-container" id="settingsContainer">
    <div class="settings-section">
      <label class="section-label" for="hotelName">Hotel Name</label>
      <input type="text" class="settings-input" id="hotelName" value="Fiesta Resort" disabled />
    </div>

    <div class="settings-section">
      <label class="section-label" for="address">Address</label>
      <textarea class="settings-textarea" id="address" disabled>Sitio Dacuman, Barangay Ipil, Surigao City, 8400, PH</textarea>
    </div>

    <div class="settings-row">
      <div class="settings-section">
        <label class="section-label" for="zipCode">ZIP Code</label>
        <input type="text" class="settings-input" id="zipCode" value="8400" disabled />
      </div>
      <div class="settings-section">
        <label class="section-label" for="timezone">Timezone</label>
        <select class="settings-select" id="timezone" disabled>
          <option value="pst">Philippine Standard Time</option>
        </select>
      </div>
    </div>

    <div class="settings-row">
      <div class="settings-section">
        <label class="section-label" for="language">Language Options</label>
        <select class="settings-select" id="language" disabled>
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="filipino">Filipino</option>
          <option value="french">French</option>
          <option value="german">German</option>
        </select>
      </div>
      <div class="settings-section">
        <label class="section-label" for="dateFormat">Date Format</label>
        <select class="settings-select" id="dateFormat" disabled>
          <option value="yyyy-mm-dd">yyyy-mm-dd</option>
          <option value="mm-dd-yyyy">mm-dd-yyyy</option>
          <option value="dd-mm-yyyy">dd-mm-yyyy</option>
        </select>
      </div>
    </div>

    <div class="settings-actions">
      <button class="settings-btn cancel-btn" id="cancelBtn" type="button">Cancel</button>
      <button class="settings-btn save-btn" id="saveBtn" type="button">Save Changes</button>
      <button class="settings-btn edit-btn" id="editBtn" type="button">Edit Settings</button>
    </div>
  </div>
@endsection

