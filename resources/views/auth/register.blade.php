@extends('layouts.auth')

@section('title', 'Sign Up - Fiesta Resort')

@push('styles')
  @vite('resources/css/auth/signup.css')
@endpush

@push('scripts')
  @vite('resources/js/auth/signup.js')
@endpush

@section('content')
  <div class="signup-container">
    <div class="signup-left" aria-hidden="true"></div>
    <div class="signup-right">
      <div class="signup-card">
        <h1>Get Started Now</h1>

        <form id="signupForm" class="signup-form" method="POST" action="{{ route('register') }}">
        @csrf

          <div class="form-group">
            <label for="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value="{{ old('name') }}"
              required
              autocomplete="name"
            />
            <span class="error-message {{ $errors->has('name') ? 'show' : '' }}" id="nameError">
              {{ $errors->first('name') }}
            </span>
        </div>

          <div class="form-group">
            <label for="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value="{{ old('email') }}"
              required
              autocomplete="username"
            />
            <span class="error-message {{ $errors->has('email') ? 'show' : '' }}" id="emailError">
              {{ $errors->first('email') }}
            </span>
        </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
                            type="password"
              id="password"
                            name="password"
              placeholder="Enter your password"
              required
              autocomplete="new-password"
            />
            <span class="error-message {{ $errors->has('password') ? 'show' : '' }}" id="passwordError">
              {{ $errors->first('password') }}
            </span>
        </div>

          <div class="form-group">
            <label for="password_confirmation">Confirm Password</label>
            <input
                            type="password"
              id="password_confirmation"
              name="password_confirmation"
              placeholder="Confirm your password"
              required
              autocomplete="new-password"
            />
            <span class="error-message {{ $errors->has('password_confirmation') ? 'show' : '' }}" id="passwordConfirmationError">
              {{ $errors->first('password_confirmation') }}
            </span>
          </div>

          <div class="form-checkbox">
            <input
              type="checkbox"
              id="agreeTerms"
              name="terms"
              value="1"
              {{ old('terms') ? 'checked' : '' }}
              required
            />
            <label for="agreeTerms">
              I agree to the <a href="#" class="terms-link">terms & policy</a>
            </label>
            <span class="error-message" id="termsError"></span>
        </div>

          <button type="submit" class="signup-btn">
            Signup
          </button>

          <div class="signin-link">
            Already have an account?
            <a href="{{ route('login') }}" class="signin-text" data-auth-transition>Sign In</a>
        </div>
    </form>
      </div>
    </div>
  </div>
@endsection
