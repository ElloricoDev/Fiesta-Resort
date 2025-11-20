@props([
    'title',
    'description' => null,
    'showAvatar' => false,
    'titleId' => null,
    'subtitleId' => null,
])

<section class="page-header">
  <div class="page-header-container {{ $showAvatar ? 'page-header-content' : '' }}">
    @if($showAvatar)
      <div class="profile-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    @endif
    <h1 class="page-title" @if($titleId) id="{{ $titleId }}" @endif>{{ $title }}</h1>
    @if($description)
      <p class="page-description {{ $showAvatar ? 'page-subtitle' : '' }}" @if($subtitleId) id="{{ $subtitleId }}" @endif>{{ $description }}</p>
    @endif
    {{ $slot }}
  </div>
</section>

