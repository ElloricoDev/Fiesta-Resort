@props([
    'label',
    'id',
    'options' => [],
    'required' => false,
    'selected' => '',
    'placeholder' => 'Select an option',
])

<div class="form-group">
  <label class="form-label" for="{{ $id }}">{{ $label }}</label>
  <select class="form-select" id="{{ $id }}" name="{{ $id }}" @if($required) required @endif>
    <option value="">{{ $placeholder }}</option>
    @foreach($options as $value => $text)
      <option value="{{ $value }}" @if($selected == $value) selected @endif>{{ $text }}</option>
    @endforeach
  </select>
</div>

