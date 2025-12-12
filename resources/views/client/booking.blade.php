@extends('layouts.client')

@section('title', 'Booking - Fiesta Resort')

@push('styles')
  @vite('resources/css/client/booking.css')
@endpush

@push('scripts')
  @vite('resources/js/client/booking.js')
@endpush

@section('content')
  <header class="booking-header">
    <div class="booking-header-container">
      <div class="logo">
        <span class="fiesta-text">Fiesta</span><span class="resort-text">Resort</span>
      </div>
    </div>
  </header>

  <section class="progress-section">
    <div class="progress-container">
      <x-client.progress-step :step="1" :is-active="true" :is-completed="true" />
      <x-client.progress-line />
      <x-client.progress-step :step="2" />
      <x-client.progress-line />
      <x-client.progress-step :step="3" />
    </div>
  </section>

  <main class="booking-main">
    <section class="booking-step" id="step1">
      <div class="step-container">
        <h1 class="step-title">Booking Information</h1>
        <p class="step-description">Please fill up the blank fields below</p>
        <div class="booking-content-grid">
          <div class="hotel-preview">
            <div class="hotel-preview-image">
              <img id="hotelPreviewImage" src="{{ asset('assets/FiestaResort1.jpg') }}" alt="Hotel" />
            </div>
            <div class="hotel-preview-info">
              <h3 class="hotel-preview-name" id="hotelPreviewName">Blue Origin Fams</h3>
              <p class="hotel-preview-location" id="hotelPreviewLocation">Brgy. Ipil, Surigao City</p>
            </div>
          </div>

          <div class="booking-form-section">
            <div class="form-group">
              <label class="form-label">How long you will stay?</label>
              <div class="counter-group">
                <button class="counter-btn minus" id="decreaseDays" type="button">-</button>
                <div class="counter-display">
                  <span id="daysCount">2</span> Days
                </div>
                <button class="counter-btn plus" id="increaseDays" type="button">+</button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Pick a Date</label>
              <div class="date-picker-wrapper">
                <div class="date-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <input type="text" class="date-input" id="dateRange" placeholder="Select dates" readonly style="cursor: pointer;" />
                <input type="date" id="checkInDateInput" style="display: none;" />
                <input type="date" id="checkOutDateInput" style="display: none;" />
              </div>
            </div>

            <div class="price-summary">
              <p class="price-text">You will pay</p>
              <p class="price-amount">
                <span class="currency">₱</span>
                <span id="totalPrice">1,000</span>
              </p>
              <p class="price-period">
                per <span id="priceDays">2 Days</span>
              </p>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn-primary" id="continueToPayment" type="button">Book Now</button>
          <button class="btn-secondary" id="cancelBooking" type="button">Cancel</button>
        </div>
      </div>
    </section>

    <section class="booking-step hidden" id="step2">
      <div class="step-container">
        <h1 class="step-title">Payment Information</h1>
        <p class="step-description">Please provide your payment details. Payment will be processed upon arrival at the resort.</p>
        <div class="payment-content-grid">
          <div class="transfer-summary">
            <h3 class="transfer-title">Booking Summary</h3>
            <div class="transfer-details">
              <p class="transfer-info">
                <span id="paymentDays">2</span> Days at
                <span id="paymentHotel">Fiesta Resort</span>,
              </p>
              <p class="transfer-location" id="paymentLocation">Brgy. Ipil, Surigao City</p>
              <div class="transfer-pricing">
                <p class="transfer-total">
                  Total Amount: <strong id="paymentTotal">2000</strong>
                </p>
                <p class="transfer-note" style="font-size: 14px; color: #64748b; margin-top: 10px;">
                  <em>Note: Payment will be collected upon check-in at the resort. This form is for reservation purposes only.</em>
                </p>
              </div>
            </div>
          </div>

          <div class="payment-form-section">
            <form id="paymentForm">
              <div class="form-group">
                <label class="form-label">Preferred Payment Method (Optional)</label>
                <select class="form-input" id="bankName">
                  <option value="">Select Payment Method (Optional)</option>
                  <option value="Cash">Cash (Pay on Arrival)</option>
                  <option value="GCASH">GCASH</option>
                  <option value="PayMaya">PayMaya</option>
                  <option value="BDO">BDO</option>
                  <option value="BPI">BPI</option>
                  <option value="Metrobank">Metrobank</option>
                </select>
                <small style="display: block; margin-top: 5px; color: #64748b; font-size: 13px;">
                  This is for reference only. Actual payment will be processed at the resort.
                </small>
              </div>
              <div class="form-group">
                <label class="form-label">Contact Number (Optional)</label>
                <input type="text" class="form-input" id="gcashNumber" placeholder="Enter your contact number (e.g., 09XXXXXXXXX)" />
              </div>
              <div class="form-group">
                <label class="form-label">Special Requests or Notes (Optional)</label>
                <textarea class="form-input" id="validationDate" rows="3" placeholder="Any special requests or notes for your stay..."></textarea>
              </div>
            </form>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn-primary" id="completePayment" type="button">Submit Reservation</button>
          <button class="btn-secondary" id="backToBooking" type="button">Cancel</button>
        </div>
      </div>
    </section>

    <section class="booking-step hidden" id="step3">
      <div class="step-container success-container">
        <h1 class="step-title success-title">Yay! Payment Completed</h1>
        <div class="success-illustration">
          <svg viewBox="0 0 200 200" class="success-icon">
            <rect x="40" y="60" width="120" height="80" rx="8" fill="#E8EDF5" />
            <rect x="40" y="60" width="120" height="20" rx="8" fill="#CBD5E1" />
            <rect x="40" y="80" width="120" height="60" rx="0" fill="#E8EDF5" />
            <circle cx="65" cy="105" r="8" fill="#4169E1" />
            <rect x="56" y="112" width="18" height="6" rx="3" fill="#4169E1" />
            <rect x="85" y="95" width="60" height="6" rx="3" fill="#CBD5E1" />
            <rect x="85" y="105" width="45" height="6" rx="3" fill="#CBD5E1" />
            <rect x="85" y="115" width="50" height="6" rx="3" fill="#CBD5E1" />
            <rect x="50" y="95" width="30" height="25" rx="4" fill="#CBD5E1" />
            <rect x="120" y="95" width="30" height="25" rx="4" fill="#CBD5E1" />
            <circle cx="145" cy="115" r="15" fill="#3EC1C9" />
            <polyline points="137,115 142,120 153,109" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <p class="success-message">
          Please check your email &amp; phone message.<br />
          We have sent all the information
        </p>
        <div class="step-actions">
          <a href="{{ route('client.home') }}" class="btn-link" data-auth-transition>Go to home</a>
        </div>
      </div>
    </section>
  </main>

  <!-- Cancel Booking Confirmation Modal -->
  <x-client.confirmation-modal 
    id="cancelBookingModal"
    title="Cancel Booking"
    message="Are you sure you want to cancel this booking? This action cannot be undone."
    confirm-text="Yes, Cancel"
    cancel-text="Keep Booking"
    confirm-button-class="logout-modal-btn-delete"
  />
@endsection

