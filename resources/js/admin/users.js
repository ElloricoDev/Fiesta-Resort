const usersTableBody = document.getElementById("usersTableBody");

if (usersTableBody) {
  let users = [];
  let searchQuery = "";
  let editingId = null;

  const searchInput = document.getElementById("searchInput");
  const emptyState = document.getElementById("emptyState");
  const addUserBtn = document.getElementById("addUserBtn");
  const userModal = document.getElementById("userModal");
  const modalTitle = document.getElementById("modalTitle");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelModalBtn = document.getElementById("cancelModalBtn");
  const userForm = document.getElementById("userForm");

  // API base URL
  const apiBaseUrl = "/admin/api/users";

  // Get CSRF token from meta tag
  function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute("content") : "";
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function formatRole(role) {
    const roleMap = {
      admin: "Admin",
      staff: "Staff",
      user: "User",
    };
    return roleMap[role] || role;
  }

  function formatStatus(status) {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Active";
  }

  // Fetch users from API
  async function fetchUsers() {
    try {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`${apiBaseUrl}?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const result = await response.json();
      users = result.data || [];
      renderUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
      if (window.showError) {
        window.showError("Failed to load users. Please refresh the page.");
      }
    }
  }

  function renderUsers() {
    if (users.length === 0) {
      usersTableBody.innerHTML = "";
      if (emptyState) {
        emptyState.style.display = "block";
      }
      return;
    }

    if (emptyState) {
      emptyState.style.display = "none";
    }

    usersTableBody.innerHTML = users
      .map(
        (user) => `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-avatar">${getInitials(user.name)}</div>
            <div class="user-info">
              <div class="user-name">${escapeHtml(user.name)}</div>
              <div class="user-email">${escapeHtml(user.email)}</div>
            </div>
          </div>
        </td>
        <td>${formatRole(user.role)}</td>
        <td>
          <span class="status-badge ${user.status || 'active'}">
            ${formatStatus(user.status)}
          </span>
        </td>
        <td>
          <div class="actions-cell">
            <button class="action-btn edit-btn" data-action="edit" data-id="${user.id}">
              Edit
            </button>
            <button class="action-btn delete-btn" data-action="delete" data-id="${user.id}">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `
      )
      .join("");
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  usersTableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.getAttribute("data-action");
    const idAttr = target.getAttribute("data-id");
    if (!action || !idAttr) return;

    const id = Number(idAttr);

    if (action === "edit") {
      editUser(id);
    } else if (action === "delete") {
      showDeleteModal(id);
    }
  });

  function editUser(id) {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    editingId = id;
    if (modalTitle) modalTitle.textContent = "Edit User";
    if (userForm) {
      document.getElementById("userName").value = user.name || "";
      document.getElementById("userEmail").value = user.email || "";
      document.getElementById("role").value = user.role || "user";
      document.getElementById("status").value = user.status || "active";
      document.getElementById("password").value = "";
    }
    if (userModal) userModal.classList.add("show");
  }

  function showDeleteModal(id) {
    const deleteModal = document.getElementById("deleteUserModal");
    const deleteModalConfirmBtn = document.getElementById("deleteUserModalConfirmBtn");
    const deleteModalCancelBtn = document.getElementById("deleteUserModalCancelBtn");

    if (deleteModal) {
      deleteModal.classList.add("show");

      // Remove existing event listeners by cloning
      const newConfirmBtn = deleteModalConfirmBtn.cloneNode(true);
      deleteModalConfirmBtn.parentNode.replaceChild(newConfirmBtn, deleteModalConfirmBtn);

      newConfirmBtn.addEventListener("click", async () => {
        await deleteUser(id);
        deleteModal.classList.remove("show");
      });

      if (deleteModalCancelBtn) {
        deleteModalCancelBtn.addEventListener("click", () => {
          deleteModal.classList.remove("show");
        });
      }

      deleteModal.addEventListener("click", (event) => {
        if (event.target === deleteModal) {
          deleteModal.classList.remove("show");
        }
      });
    }
  }

  async function deleteUser(id) {
    try {
      const response = await fetch(`${apiBaseUrl}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": getCsrfToken(),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete user");
      }

      if (window.showSuccess) {
        window.showSuccess(result.message || "User deleted successfully");
      }

      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      if (window.showError) {
        window.showError(error.message || "Failed to delete user. Please try again.");
      }
    }
  }

  if (addUserBtn) {
    addUserBtn.addEventListener("click", () => {
      editingId = null;
      if (modalTitle) modalTitle.textContent = "Add User";
      if (userForm) {
        userForm.reset();
        document.getElementById("status").value = "active";
      }
      if (userModal) userModal.classList.add("show");
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      if (userModal) userModal.classList.remove("show");
      if (userForm) userForm.reset();
      editingId = null;
    });
  }

  if (cancelModalBtn) {
    cancelModalBtn.addEventListener("click", () => {
      if (userModal) userModal.classList.remove("show");
      if (userForm) userForm.reset();
      editingId = null;
    });
  }

  if (userModal) {
    userModal.addEventListener("click", (event) => {
      if (event.target === userModal) {
        userModal.classList.remove("show");
        if (userForm) userForm.reset();
        editingId = null;
      }
    });
  }

  if (userForm) {
    userForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = {
        name: document.getElementById("userName").value.trim(),
        email: document.getElementById("userEmail").value.trim(),
        role: document.getElementById("role").value,
        status: document.getElementById("status").value,
        password: document.getElementById("password").value,
      };

      // Validation
      if (!formData.name) {
        if (window.showError) window.showError("Name is required.");
        return;
      }

      if (!formData.email) {
        if (window.showError) window.showError("Email is required.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        if (window.showError) window.showError("Please enter a valid email address.");
        return;
      }

      if (!editingId && !formData.password) {
        if (window.showError) window.showError("Password is required for new users.");
        return;
      }

      if (formData.password && formData.password.length < 6) {
        if (window.showError) window.showError("Password must be at least 6 characters.");
        return;
      }

      try {
        const url = editingId ? `${apiBaseUrl}/${editingId}` : apiBaseUrl;
        const method = editingId ? "PUT" : "POST";

        // Don't send password if it's empty (for editing)
        if (editingId && !formData.password) {
          delete formData.password;
        }

        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-TOKEN": getCsrfToken(),
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to save user");
        }

        if (window.showSuccess) {
          window.showSuccess(result.message || "User saved successfully");
        }

        if (userModal) userModal.classList.remove("show");
        if (userForm) userForm.reset();
        editingId = null;

        await fetchUsers();
      } catch (error) {
        console.error("Error saving user:", error);
        if (window.showError) {
          window.showError(error.message || "Failed to save user. Please try again.");
        }
      }
    });
  }

  // Search functionality
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", (event) => {
      searchQuery = event.target.value.trim();
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        fetchUsers();
      }, 300);
    });
  }

  // Initial load
  fetchUsers();
}
