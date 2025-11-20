@props([
    'id' => 'emptyState',
    'title' => 'No items found',
    'description' => null,
    'showButton' => false,
    'buttonText' => 'Explore',
    'buttonUrl' => null,
    'buttonId' => null,
])

<div id="{{ $id }}" class="empty-state" style="display: none">
  @isset($icon)
    {{ $icon }}
  @endisset
  <h3 class="empty-title">{{ $title }}</h3>
  @if($description)
    <p class="empty-description">{{ $description }}</p>
  @endif
  @if($showButton && $buttonUrl)
    <a href="{{ $buttonUrl }}" class="explore-btn" data-auth-transition>{{ $buttonText }}</a>
  @endif
  @if($showButton && $buttonId)
    <button class="explore-btn" id="{{ $buttonId }}" type="button">{{ $buttonText }}</button>
  @endif
</div>

