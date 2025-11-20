@props([
    'label',
    'id',
    'placeholder' => '',
    'required' => false,
    'value' => '',
    'class' => '',
    'rows' => 4,
])

<div class="form-group {{ $class }}">
  <label class="form-label" for="{{ $id }}">{{ $label }}</label>
  <textarea 
    class="form-textarea {{ $class }}" 
    id="{{ $id }}" 
    name="{{ $id }}"
    placeholder="{{ $placeholder }}"
    rows="{{ $rows }}"
    @if($required) required @endif
  >{{ $value }}</textarea>
</div>

