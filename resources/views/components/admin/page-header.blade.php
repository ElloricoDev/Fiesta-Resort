@props([
    'title',
    'searchPlaceholder' => 'Search...',
    'searchId' => 'searchInput',
    'addButtonText' => 'Add',
    'addButtonId' => 'addBtn',
    'showSearch' => true,
    'showAddButton' => true,
])

<div class="page-header">
  <h1 class="page-title">{{ $title }}</h1>
  @if($showSearch || $showAddButton)
    <div class="header-actions">
      @if($showSearch)
        <div class="search-container">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" class="search-input" id="{{ $searchId }}" placeholder="{{ $searchPlaceholder }}" />
        </div>
      @endif
      @if($showAddButton)
        <button class="add-btn" id="{{ $addButtonId }}" type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          {{ $addButtonText }}
        </button>
      @endif
    </div>
  @endif
</div>

