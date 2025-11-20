@props([
    'label',
    'selectId',
    'options' => [],
    'placeholder' => 'All',
])

<div class="filter-group">
  <label class="filter-label">
    @isset($icon)
      {{ $icon }}
    @endisset
    {{ $label }}
  </label>
  <select class="filter-select" id="{{ $selectId }}">
    <option value="">{{ $placeholder }}</option>
    @foreach($options as $value => $text)
      <option value="{{ $value }}">{{ $text }}</option>
    @endforeach
  </select>
</div>

