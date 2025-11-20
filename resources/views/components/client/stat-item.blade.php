@props([
    'value',
    'label',
])

<div class="stat-item">
  @isset($icon)
    <div class="stat-icon">
      {{ $icon }}
    </div>
  @endisset
  <div class="stat-info">
    <div class="stat-value">{{ $value }}</div>
    <div class="stat-label">{{ $label }}</div>
  </div>
</div>

