@props([
    'label',
    'id',
    'type' => 'text',
    'placeholder' => '',
    'required' => false,
    'value' => '',
    'class' => '',
    'min' => null,
    'max' => null,
    'step' => null,
    'minlength' => null,
    'maxlength' => null,
])

<div class="form-group {{ $class }}">
  <label class="form-label" for="{{ $id }}">{{ $label }}</label>
  <input 
    type="{{ $type }}" 
    class="form-input" 
    id="{{ $id }}" 
    name="{{ $id }}"
    placeholder="{{ $placeholder }}"
    value="{{ $value }}"
    @if($required) required @endif
    @if($min !== null) min="{{ $min }}" @endif
    @if($max !== null) max="{{ $max }}" @endif
    @if($step !== null) step="{{ $step }}" @endif
    @if($minlength !== null) minlength="{{ $minlength }}" @endif
    @if($maxlength !== null) maxlength="{{ $maxlength }}" @endif
  />
  @if(isset($slot) && $slot->isNotEmpty())
    <div class="form-help-text">{{ $slot }}</div>
  @endif
</div>

