@props([
    'id' => 'emptyState',
    'message' => 'No items found.',
    'icon' => null,
    'showButton' => false,
    'buttonText' => 'Add New',
    'buttonId' => null,
])

<div id="{{ $id }}" class="empty-state" style="display: none">
  @if($icon)
    <div class="empty-icon">{!! $icon !!}</div>
  @endif
  <p>{{ $message }}</p>
  @if($showButton && $buttonId)
    <button class="add-btn" id="{{ $buttonId }}" type="button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      {{ $buttonText }}
    </button>
  @endif
</div>

