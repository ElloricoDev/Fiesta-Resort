const usersTableBody = document.getElementById("usersTableBody");

if (usersTableBody) {
  // Load users from localStorage or use default dummy data
  let storedUsers = localStorage.getItem("adminUsersData");
  let users = storedUsers
    ? JSON.parse(storedUsers).map((u, index) => ({
        id: index + 1,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
      }))
    : [
        {
          id: 1,
          name: "Olivia Martin",
          email: "olivia.martin@gmail.com",
          role: "admin",
          status: "active",
        },
        {
          id: 2,
          name: "Emily Carter",
          email: "emily.carter@example.com",
          role: "staff",
          status: "inactive",
        },
        {
          id: 3,
          name: "David Lee",
          email: "david.lee@example.com",
          role: "admin",
          status: "active",
        },
        {
          id: 4,
          name: "Sophia Cruz",
          email: "sophia.cruz@example.com",
          role: "staff",
          status: "active",
        },
      ];

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
    };
    return roleMap[role] || role;
  }

  function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  function getFilteredUsers() {
    return users.filter((user) => {
      const query = searchQuery.toLowerCase();
      return (
        query === "" ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    });
  }

  function renderUsers() {
    const filteredUsers = getFilteredUsers();

    if (filteredUsers.length === 0) {
      usersTableBody.innerHTML = "";
      if (emptyState) {
        emptyState.style.display = "block";
      }
      return;
    }

    if (emptyState) {
      emptyState.style.display = "none";
    }

    usersTableBody.innerHTML = filteredUsers
      .map(
        (user) => `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-avatar">${getInitials(user.name)}</div>
            <div class="user-info">
              <div class="user-name">${user.name}</div>
              <div class="user-email">${user.email}</div>
            </div>
          </div>
        </td>
        <td>${formatRole(user.role)}</td>
        <td>
          <span class="status-badge ${user.status}">
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
      deleteUser(id);
    }
  });

  function editUser(id) {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    editingId = id;
    modalTitle.textContent = "Edit User";
    document.getElementById("userName").value = user.name;
    document.getElementById("userEmail").value = user.email;
    document.getElementById("role").value = user.role;
    document.getElementById("status").value = user.status;
    const passwordInput = document.getElementById("password");
    passwordInput.value = "";
    passwordInput.required = false;
    userModal.classList.add("show");
  }

  function deleteUser(id) {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      users = users.filter((u) => u.id !== id);
      renderUsers();
      alert("User deleted successfully!");
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      searchQuery = event.target.value;
      renderUsers();
    });
  }

  if (addUserBtn) {
    addUserBtn.addEventListener("click", () => {
      editingId = null;
      modalTitle.textContent = "Add User";
      userForm.reset();
      const passwordInput = document.getElementById("password");
      passwordInput.required = true;
      userModal.classList.add("show");
    });
  }

  function closeModal() {
    userModal.classList.remove("show");
    userForm.reset();
    editingId = null;
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (cancelModalBtn) {
    cancelModalBtn.addEventListener("click", closeModal);
  }

  userModal.addEventListener("click", (event) => {
    if (event.target === userModal) {
      closeModal();
    }
  });

  if (userForm) {
    userForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const passwordInput = document.getElementById("password");
      const formData = {
        name: document.getElementById("userName").value.trim(),
        email: document.getElementById("userEmail").value.trim(),
        role: document.getElementById("role").value,
        status: document.getElementById("status").value,
        password: passwordInput.value,
      };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address.");
        return;
      }

      if (!editingId && formData.password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }

      if (editingId) {
        const index = users.findIndex((u) => u.id === editingId);
        if (index !== -1) {
          users[index] = {
            ...users[index],
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: formData.status,
          };
          if (formData.password) {
            users[index].password = formData.password;
          }
        }
      } else {
        users.push({
          id: Date.now(),
          ...formData,
        });
      }

      renderUsers();
      closeModal();
      alert(editingId ? "User updated successfully!" : "User added successfully!");
    });
  }

  renderUsers();
}

