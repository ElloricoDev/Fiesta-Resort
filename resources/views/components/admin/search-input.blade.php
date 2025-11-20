@props([
    'id' => 'searchInput',
    'placeholder' => 'Search...',
    'class' => '',
])

<div class="search-container {{ $class }}">
  <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
  <input type="text" class="search-input" id="{{ $id }}" placeholder="{{ $placeholder }}" />
</div>

