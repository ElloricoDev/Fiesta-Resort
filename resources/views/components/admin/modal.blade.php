@props([
    'id',
    'title',
    'formId' => null,
    'submitButtonText' => 'Save',
    'cancelButtonText' => 'Cancel',
    'showCancel' => true,
])

<div class="modal" id="{{ $id }}">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title" id="modalTitle">{{ $title }}</h2>
      <button class="close-btn" id="closeModalBtn" type="button">&times;</button>
    </div>

    @if($formId)
      <form class="modal-form" id="{{ $formId }}">
        {{ $slot }}
        
        <div class="modal-actions">
          @if($showCancel)
            <button type="button" class="modal-btn cancel-btn" id="cancelModalBtn">{{ $cancelButtonText }}</button>
          @endif
          <button type="submit" class="modal-btn submit-btn">{{ $submitButtonText }}</button>
        </div>
      </form>
    @else
      <div class="modal-body">
        {{ $slot }}
      </div>
      
      @if($showCancel)
        <div class="modal-actions">
          <button type="button" class="modal-btn cancel-btn" id="cancelModalBtn">{{ $cancelButtonText }}</button>
        </div>
      @endif
    @endif
  </div>
</div>

