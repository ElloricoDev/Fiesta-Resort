@props([
    'class' => '',
])

<div class="form-row {{ $class }}">
  {{ $slot }}
</div>

