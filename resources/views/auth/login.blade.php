@extends('layouts.auth')

@section('title', 'Login - Fiesta Resort')

@push('styles')
  @vite('resources/css/auth/login.css')
@endpush

@push('scripts')
  @vite('resources/js/auth/login.js')
@endpush

@section('content')
  <div class="login-container">
    <div class="login-card">
      <h1>Welcome To Fiesta Resort!</h1>

      @if (session('status'))
        <div class="session-status">
          {{ session('status') }}
        </div>
      @endif

      @if ($errors->any())
        <div class="alert alert-danger" style="background-color: #fee; color: #c33; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
          <ul style="margin: 0; padding-left: 20px;">
            @foreach ($errors->all() as $error)
              <li>{{ $error }}</li>
            @endforeach
          </ul>
        </div>
      @endif

      <form id="loginForm" class="login-form" method="POST" action="{{ route('login') }}">
        @csrf

        <div class="form-group">
          <label for="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
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
            required
            autocomplete="current-password"
          />
          <span class="error-message {{ $errors->has('password') ? 'show' : '' }}" id="passwordError">
            {{ $errors->first('password') }}
          </span>
        </div>

        <div class="form-options">
          <div class="remember-me">
            <input type="checkbox" id="rememberMe" name="remember" {{ old('remember') ? 'checked' : '' }} />
            <label for="rememberMe">Remember me</label>
          </div>
        </div>

        <button type="submit" class="login-btn">
          Login
        </button>

        <div class="form-links">
          @if (Route::has('password.request'))
            <a href="{{ route('password.request') }}" class="forgot-password" data-auth-transition>Forgot Password?</a>
          @else
            <span></span>
          @endif
          <a href="{{ route('register') }}" class="sign-up" data-auth-transition>Sign Up</a>
        </div>
      </form>
    </div>
  </div>
@endsection
