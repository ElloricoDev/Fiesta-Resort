@props([
    'value',
    'label',
    'iconClass' => '',
    'valueId' => null,
])

<div class="stat-card">
  @isset($icon)
    <div class="stat-icon {{ $iconClass }}">
      {{ $icon }}
    </div>
  @endisset
  <div class="stat-info">
    <div class="stat-value" @if($valueId) id="{{ $valueId }}" @endif>{{ $value }}</div>
    <div class="stat-label">{{ $label }}</div>
  </div>
</div>

