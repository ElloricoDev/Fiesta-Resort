@props([
    'id',
    'title' => 'Confirm Action',
    'message' => 'Are you sure you want to proceed?',
    'confirmText' => 'Confirm',
    'cancelText' => 'Cancel',
    'confirmButtonClass' => 'logout-modal-btn-confirm',
])

<div id="{{ $id }}" class="logout-modal">
  <div class="logout-modal-content">
    <div class="logout-modal-header">
      <h3 class="logout-modal-title">{{ $title }}</h3>
    </div>
    <div class="logout-modal-body">
      <p>{{ $message }}</p>
    </div>
    <div class="logout-modal-actions">
      <button type="button" class="logout-modal-btn logout-modal-btn-cancel" id="{{ $id }}CancelBtn">{{ $cancelText }}</button>
      <button type="button" class="logout-modal-btn {{ $confirmButtonClass }}" id="{{ $id }}ConfirmBtn">{{ $confirmText }}</button>
    </div>
  </div>
</div>

