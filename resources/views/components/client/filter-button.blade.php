@props([
    'label',
    'filter' => null,
    'isActive' => false,
    'type' => 'button',
])

<button 
  class="filter-btn {{ $isActive ? 'active' : '' }}" 
  data-filter="{{ $filter ?? strtolower($label) }}" 
  type="{{ $type }}"
>
  {{ $label }}
</button>

