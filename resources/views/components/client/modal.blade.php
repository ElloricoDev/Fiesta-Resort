@props([
    'id',
    'title',
    'closeButtonId' => 'modalClose',
])

<div class="modal" id="{{ $id }}">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">{{ $title }}</h2>
      <button class="modal-close" id="{{ $closeButtonId }}" type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="modal-body" id="modalBody">
      {{ $slot }}
    </div>
  </div>
</div>

