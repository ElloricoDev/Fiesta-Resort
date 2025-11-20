@extends('layouts.admin')

@section('title', 'User Accounts - Fiesta Resort')

@push('styles')
  @vite('resources/css/admin/users.css')
@endpush

@push('scripts')
  @vite('resources/js/admin/users.js')
@endpush

@section('content')
  <x-admin.page-header 
    title="Users"
    search-placeholder="Search user..."
    search-id="searchInput"
    add-button-text="Add User"
    add-button-id="addUserBtn"
  />

  <div class="users-section">
    <table class="users-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="usersTableBody"></tbody>
    </table>

    <x-admin.empty-state 
      id="emptyState"
      message="No users found."
    />
  </div>

  <x-admin.modal 
    id="userModal"
    title="Add User"
    form-id="userForm"
    submit-button-text="Save User"
    cancel-button-text="Cancel"
  >
    <x-admin.form-row>
      <x-admin.form-group 
        label="Full Name"
        id="userName"
        type="text"
        placeholder="Enter full name"
        :required="true"
      />
      <x-admin.form-group 
        label="Email Address"
        id="userEmail"
        type="email"
        placeholder="user@example.com"
        :required="true"
      />
    </x-admin.form-row>

    <x-admin.form-row>
      <x-admin.form-select 
        label="Role"
        id="role"
        :options="['admin' => 'Admin', 'staff' => 'Staff']"
        placeholder="Select role"
        :required="true"
      />
      <x-admin.form-select 
        label="Status"
        id="status"
        :options="['active' => 'Active', 'inactive' => 'Inactive']"
        selected="active"
        :required="true"
      />
    </x-admin.form-row>

    <x-admin.form-group 
      label="Password"
      id="password"
      type="password"
      placeholder="Enter password (min 6 characters)"
      :minlength="6"
      class="full-width"
    >
      <small style="color: #6b7280; font-size: 12px">
        Leave blank to keep current password (for editing)
      </small>
    </x-admin.form-group>
  </x-admin.modal>
@endsection

