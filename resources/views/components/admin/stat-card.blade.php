@props([
    'label',
    'value',
    'icon' => null,
])

<div class="stat-card">
  @if($icon)
    <div class="stat-icon">{!! $icon !!}</div>
  @endif
  <div class="stat-label">{{ $label }}</div>
  <div class="stat-value">{{ $value }}</div>
</div>

