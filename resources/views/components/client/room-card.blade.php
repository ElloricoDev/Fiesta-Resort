@props([
    'name',
    'price',
    'image',
    'badge' => null,
    'url' => null,
    'dataAttributes' => [],
])

@php
  $cardTag = $url ? 'a' : 'div';
  $cardAttributes = $url ? 'href="' . $url . '" class="room-card clickable" style="text-decoration: none; color: inherit; display: block;"' : 'class="room-card"';
  foreach($dataAttributes as $key => $value) {
    $cardAttributes .= ' data-' . $key . '="' . $value . '"';
  }
@endphp

<{{ $cardTag }} {!! $cardAttributes !!}>
  <div class="room-image">
    <img src="{{ asset('assets/' . $image) }}" alt="{{ $name }}" />
    @if($badge)
      <div class="room-badge">{{ $badge }}</div>
    @endif
  </div>
  <div class="room-info">
    <h3 class="room-name">{{ $name }}</h3>
    <p class="room-price">{{ $price }}</p>
  </div>
</{{ $cardTag }}>

