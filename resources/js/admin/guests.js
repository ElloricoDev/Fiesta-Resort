const guestsTableBody = document.getElementById("guestsTableBody");

if (guestsTableBody) {
  let guests = [];
  let searchQuery = "";
  let editingId = null;

  const searchInput = document.getElementById("searchInput");
  const emptyState = document.getElementById("emptyState");
  const guestModal = document.getElementById("guestModal");
  const modalTitle = document.getElementById("modalTitle");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelModalBtn = document.getElementById("cancelModalBtn");
  const guestForm = document.getElementById("guestForm");

  // API base URL
  const apiBaseUrl = "/admin/api/guests";

  // Get CSRF token from meta tag
  function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute("content") : "";
  }

  // API helper functions
  async function fetchGuests() {
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
        throw new Error("Failed to fetch guests");
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error("Error fetching guests:", error);
      showError("Failed to load guests. Please try again.");
      return [];
    }
  }

  async function updateGuest(id, data) {
    try {
      const response = await fetch(`${apiBaseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": getCsrfToken(),
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update guest");
      }

      return result.data;
    } catch (error) {
      console.error("Error updating guest:", error);
      throw error;
    }
  }

  async function deleteGuestApi(id) {
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
        throw new Error(result.message || "Failed to delete guest");
      }

      return true;
    } catch (error) {
      console.error("Error deleting guest:", error);
      throw error;
    }
  }

  function showError(message) {
    if (window.showError) {
      window.showError(message);
    } else {
      console.error(message);
    }
  }

  function showSuccess(message) {
    if (window.showSuccess) {
      window.showSuccess(message);
    } else {
      console.log(message);
    }
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function renderGuests() {
    if (guests.length === 0) {
      guestsTableBody.innerHTML = "";
      if (emptyState) {
        emptyState.style.display = "block";
      }
      return;
    }

    if (emptyState) {
      emptyState.style.display = "none";
    }

    guestsTableBody.innerHTML = guests
      .map(
        (guest) => `
      <tr>
        <td>
          <div class="guest-cell">
            <div class="guest-avatar">${getInitials(guest.name)}</div>
            <div class="guest-info">
              <div class="guest-name">${guest.name}</div>
              <div class="guest-id">${guest.email}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="contact-cell">
            <div class="contact-line">${guest.email}</div>
            <div class="contact-line">${guest.phone || "N/A"}</div>
          </div>
        </td>
        <td>${guest.total_stays || 0}</td>
        <td>${guest.start_since || "N/A"}</td>
        <td>
          <div class="actions-cell">
            <button class="action-btn edit-btn" data-action="edit" data-id="${guest.id}">
              Edit
            </button>
            <button class="action-btn delete-btn" data-action="delete" data-id="${guest.id}">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `
      )
      .join("");
  }

  async function loadGuests() {
    guests = await fetchGuests();
    renderGuests();
  }

  function closeModal() {
    if (guestModal) guestModal.classList.remove("show");
    if (guestForm) guestForm.reset();
    editingId = null;
  }

  guestsTableBody.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.getAttribute("data-action");
    const id = target.getAttribute("data-id");

    if (!action || !id) return;

    if (action === "edit") {
      await editGuest(Number(id));
    } else if (action === "delete") {
      await deleteGuestHandler(Number(id));
    }
  });

  async function editGuest(id) {
    const guest = guests.find((g) => g.id === id);
    if (!guest) return;

    editingId = id;
    if (modalTitle) modalTitle.textContent = "Edit Guest";
    document.getElementById("guestName").value = guest.name || "";
    document.getElementById("guestEmail").value = guest.email || "";
    document.getElementById("guestPhone").value = guest.phone || "";
    document.getElementById("startSince").value = guest.start_since || "";
    // Note: total_stays is read-only, calculated from reservations
    if (guestModal) guestModal.classList.add("show");
  }

  let pendingDeleteId = null;
  const deleteModal = document.getElementById("deleteGuestModal");
  const deleteModalConfirmBtn = document.getElementById("deleteGuestModalConfirmBtn");
  const deleteModalCancelBtn = document.getElementById("deleteGuestModalCancelBtn");

  function showDeleteModal(id) {
    const guest = guests.find((g) => g.id === id);
    if (!guest) return;

    pendingDeleteId = id;
    if (deleteModal) {
      const messageEl = deleteModal.querySelector('.logout-modal-body p');
      if (messageEl) {
        messageEl.textContent = `Are you sure you want to delete ${guest.name}? This action cannot be undone.`;
      }
      deleteModal.classList.add("show");
    }
  }

  function hideDeleteModal() {
    if (deleteModal) {
      deleteModal.classList.remove("show");
    }
    pendingDeleteId = null;
  }

  if (deleteModalConfirmBtn) {
    deleteModalConfirmBtn.addEventListener("click", async () => {
      if (pendingDeleteId) {
        try {
          await deleteGuestApi(pendingDeleteId);
          await loadGuests();
          hideDeleteModal();
          showSuccess("Guest deleted successfully!");
        } catch (error) {
          showError(error.message || "Failed to delete guest");
        }
      }
    });
  }

  if (deleteModalCancelBtn) {
    deleteModalCancelBtn.addEventListener("click", hideDeleteModal);
  }

  if (deleteModal) {
    deleteModal.addEventListener("click", (event) => {
      if (event.target === deleteModal) {
        hideDeleteModal();
      }
    });
  }

  async function deleteGuestHandler(id) {
    showDeleteModal(id);
  }

  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", (event) => {
      clearTimeout(searchTimeout);
      searchQuery = event.target.value.trim();
      searchTimeout = setTimeout(async () => {
        await loadGuests();
      }, 300); // Debounce search
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (cancelModalBtn) {
    cancelModalBtn.addEventListener("click", closeModal);
  }

  if (guestModal) {
    guestModal.addEventListener("click", (event) => {
      if (event.target === guestModal) {
        closeModal();
      }
    });
  }

  if (guestForm) {
    guestForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = {
        name: document.getElementById("guestName").value.trim(),
        email: document.getElementById("guestEmail").value.trim(),
        phone: document.getElementById("guestPhone").value.trim() || null,
        start_since: document.getElementById("startSince").value || null,
      };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showError("Please enter a valid email address.");
        return;
      }

      try {
        await updateGuest(editingId, formData);
        closeModal();
        await loadGuests();
        showSuccess("Guest updated successfully!");
      } catch (error) {
        showError(error.message || "Failed to update guest. Please try again.");
      }
    });
  }

  // Load guests on page load
  loadGuests();
}
