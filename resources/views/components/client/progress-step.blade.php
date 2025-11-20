@props([
    'step',
    'isActive' => false,
    'isCompleted' => false,
    'label' => null,
])

<div class="progress-step {{ $isActive ? 'active' : '' }} {{ $isCompleted ? 'completed' : '' }}" data-step="{{ $step }}">
  <div class="step-circle">
    @if($isCompleted)
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    @else
      {{ $step }}
    @endif
  </div>
  @if($label)
    <span class="step-label">{{ $label }}</span>
  @endif
</div>

