@props([
    'title',
    'buttonText' => 'Add',
    'buttonId' => 'addBtn',
])

<div class="section-header">
  <h2 class="section-title">{{ $title }}</h2>
  <button class="add-btn" id="{{ $buttonId }}" type="button">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    {{ $buttonText }}
  </button>
</div>

