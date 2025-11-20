@props([
    'items' => [],
])

<nav class="breadcrumb">
  @foreach($items as $index => $item)
    @if($index > 0)
      <span class="breadcrumb-separator">/</span>
    @endif
    @if(isset($item['url']) && !$loop->last)
      <a href="{{ $item['url'] }}" class="breadcrumb-link" data-auth-transition>{{ $item['label'] }}</a>
    @else
      <span class="breadcrumb-current">{{ $item['label'] }}</span>
    @endif
  @endforeach
</nav>

