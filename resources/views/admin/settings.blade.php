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
      <input type="text" class="settings-input" id="hotelName" value="{{ $settings['hotel_name'] }}" disabled />
    </div>

    <div class="settings-section">
      <label class="section-label" for="address">Address</label>
      <textarea class="settings-textarea" id="address" disabled>{{ $settings['address'] }}</textarea>
    </div>

    <div class="settings-row">
      <div class="settings-section">
        <label class="section-label" for="zipCode">ZIP Code</label>
        <input type="text" class="settings-input" id="zipCode" value="{{ $settings['zip_code'] }}" disabled />
      </div>
      <div class="settings-section">
        <label class="section-label" for="timezone">Timezone</label>
        <select class="settings-select" id="timezone" disabled>
          <option value="pst" {{ $settings['timezone'] === 'pst' ? 'selected' : '' }}>Philippine Standard Time</option>
          <option value="utc" {{ $settings['timezone'] === 'utc' ? 'selected' : '' }}>UTC</option>
          <option value="est" {{ $settings['timezone'] === 'est' ? 'selected' : '' }}>Eastern Standard Time</option>
          <option value="pst" {{ $settings['timezone'] === 'pst' ? 'selected' : '' }}>Pacific Standard Time</option>
        </select>
      </div>
    </div>

    <div class="settings-row">
      <div class="settings-section">
        <label class="section-label" for="language">Language Options</label>
        <select class="settings-select" id="language" disabled>
          <option value="english" {{ $settings['language'] === 'english' ? 'selected' : '' }}>English</option>
          <option value="spanish" {{ $settings['language'] === 'spanish' ? 'selected' : '' }}>Spanish</option>
          <option value="filipino" {{ $settings['language'] === 'filipino' ? 'selected' : '' }}>Filipino</option>
          <option value="french" {{ $settings['language'] === 'french' ? 'selected' : '' }}>French</option>
          <option value="german" {{ $settings['language'] === 'german' ? 'selected' : '' }}>German</option>
        </select>
      </div>
      <div class="settings-section">
        <label class="section-label" for="dateFormat">Date Format</label>
        <select class="settings-select" id="dateFormat" disabled>
          <option value="yyyy-mm-dd" {{ $settings['date_format'] === 'yyyy-mm-dd' ? 'selected' : '' }}>yyyy-mm-dd</option>
          <option value="mm-dd-yyyy" {{ $settings['date_format'] === 'mm-dd-yyyy' ? 'selected' : '' }}>mm-dd-yyyy</option>
          <option value="dd-mm-yyyy" {{ $settings['date_format'] === 'dd-mm-yyyy' ? 'selected' : '' }}>dd-mm-yyyy</option>
        </select>
      </div>
    </div>

    <div class="settings-actions">
      <button class="settings-btn cancel-btn" id="cancelBtn" type="button">Cancel</button>
      <button class="settings-btn save-btn" id="saveBtn" type="button">Save Changes</button>
      <button class="settings-btn edit-btn" id="editBtn" type="button">Edit Settings</button>
    </div>
  </div>

  <!-- Cancel Confirmation Modal -->
  <x-admin.confirmation-modal 
    id="cancelSettingsModal"
    title="Cancel Changes"
    message="Are you sure you want to cancel? Any unsaved changes will be lost."
    confirm-text="Yes, Cancel"
    cancel-text="Keep Editing"
    confirm-button-class="logout-modal-btn-confirm"
  />
@endsection

