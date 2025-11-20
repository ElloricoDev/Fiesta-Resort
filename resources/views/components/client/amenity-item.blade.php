@props([
    'value',
    'label',
    'valueId' => null,
])

<div class="amenity-item">
  <div class="amenity-icon">
    @isset($icon)
      {{ $icon }}
    @endisset
  </div>
  <div class="amenity-details">
    <span class="amenity-value" @if($valueId) id="{{ $valueId }}" @endif>{{ $value }}</span>
    <span class="amenity-label">{{ $label }}</span>
  </div>
</div>

