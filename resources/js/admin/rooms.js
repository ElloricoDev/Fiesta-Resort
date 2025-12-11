const roomsTableBody = document.getElementById("roomsTableBody");

if (roomsTableBody) {
  let rooms = [];
  let groupedRooms = {};
  let searchQuery = "";
  let editingId = null;

  const searchInput = document.getElementById("searchInput");
  const emptyState = document.getElementById("emptyState");
  const addRoomBtn = document.getElementById("addRoomBtn");
  const roomModal = document.getElementById("roomModal");
  const modalTitle = document.getElementById("modalTitle");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelModalBtn = document.getElementById("cancelModalBtn");
  const roomForm = document.getElementById("roomForm");

  // API base URL
  const apiBaseUrl = "/admin/api/rooms";

  // Get CSRF token from meta tag
  function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute("content") : "";
  }

  // API helper functions
  async function fetchRooms() {
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
        throw new Error("Failed to fetch rooms");
      }

      const result = await response.json();
      rooms = result.data || [];
      groupedRooms = result.grouped || {};
      return rooms;
    } catch (error) {
      console.error("Error fetching rooms:", error);
      showError("Failed to load rooms. Please try again.");
      return [];
    }
  }

  async function createRoom(data) {
    try {
      const response = await fetch(apiBaseUrl, {
        method: "POST",
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
        throw new Error(result.message || "Failed to create room");
      }

      return result.data;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  }

  async function updateRoom(id, data) {
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
        throw new Error(result.message || "Failed to update room");
      }

      return result.data;
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  }

  async function deleteRoomHandler(id) {
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
        throw new Error(result.message || "Failed to delete room");
      }

      return true;
    } catch (error) {
      console.error("Error deleting room:", error);
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

  function formatStatus(status) {
    const statusMap = {
      available: "Available",
      occupied: "Occupied",
      maintenance: "Under Maintenance",
      reserved: "Reserved",
    };
    return statusMap[status] || status;
  }

  function renderRooms() {
    if (Object.keys(groupedRooms).length === 0) {
      roomsTableBody.innerHTML = "";
      if (emptyState) {
        emptyState.style.display = "block";
      }
      return;
    }

    if (emptyState) {
      emptyState.style.display = "none";
    }

    // Render grouped by room type with availability
    let html = "";
    for (const [roomType, group] of Object.entries(groupedRooms)) {
      // Add header row for room type
      html += `
        <tr class="room-type-header">
          <td colspan="5" style="background-color: #f5f9ff; font-weight: 600; padding: 12px;">
            ${roomType} - ${group.available}/${group.total} Available
          </td>
        </tr>
      `;
      
      // Add rooms for this type
      group.rooms.forEach((room) => {
        html += `
          <tr>
            <td>${room.room_number}</td>
            <td>${room.max_occupancy}</td>
            <td>
              <span class="status-badge ${room.status}">
                ${formatStatus(room.status)}
              </span>
            </td>
            <td>$${parseFloat(room.price_per_night).toFixed(2)}</td>
            <td>
              <div class="actions-cell">
                <button class="action-btn edit-btn" data-action="edit" data-id="${room.id}">
                  Edit
                </button>
                <button class="action-btn delete-btn" data-action="delete" data-id="${room.id}">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        `;
      });
    }

    roomsTableBody.innerHTML = html;
  }

  async function loadRooms() {
    await fetchRooms();
    renderRooms();
  }

  roomsTableBody.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.getAttribute("data-action");
    const idAttr = target.getAttribute("data-id");
    if (!action || !idAttr) return;

    const id = Number(idAttr);
    if (action === "edit") {
      await editRoom(id);
    } else if (action === "delete") {
      await deleteRoom(id);
    }
  });

  async function editRoom(id) {
    const room = rooms.find((r) => r.id === id);
    if (!room) return;

    editingId = id;
    if (modalTitle) modalTitle.textContent = "Edit Room";
    document.getElementById("roomNumber").value = room.room_number;
    document.getElementById("roomType").value = room.room_type;
    document.getElementById("capacity").value = room.max_occupancy;
    document.getElementById("basePrice").value = room.price_per_night;
    document.getElementById("status").value = room.status;
    if (roomModal) roomModal.classList.add("show");
  }

  let pendingDeleteId = null;
  const deleteModal = document.getElementById("deleteRoomModal");
  const deleteModalConfirmBtn = document.getElementById("deleteRoomModalConfirmBtn");
  const deleteModalCancelBtn = document.getElementById("deleteRoomModalCancelBtn");

  function showDeleteModal(id) {
    const room = rooms.find((r) => r.id === id);
    if (!room) return;

    pendingDeleteId = id;
    if (deleteModal) {
      const messageEl = deleteModal.querySelector('.logout-modal-body p');
      if (messageEl) {
        messageEl.textContent = `Are you sure you want to delete room ${room.room_number}? This action cannot be undone.`;
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
          await deleteRoomHandler(pendingDeleteId);
          await loadRooms();
          hideDeleteModal();
          showSuccess("Room deleted successfully!");
        } catch (error) {
          showError(error.message || "Failed to delete room");
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

  async function deleteRoom(id) {
    showDeleteModal(id);
  }

  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", (event) => {
      clearTimeout(searchTimeout);
      searchQuery = event.target.value;
      searchTimeout = setTimeout(() => {
        loadRooms();
      }, 300);
    });
  }

  if (addRoomBtn) {
    addRoomBtn.addEventListener("click", () => {
      editingId = null;
      if (modalTitle) modalTitle.textContent = "Add Room";
      if (roomForm) roomForm.reset();
      if (roomModal) roomModal.classList.add("show");
    });
  }

  function closeModal() {
    if (roomModal) roomModal.classList.remove("show");
    if (roomForm) roomForm.reset();
    editingId = null;
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (cancelModalBtn) {
    cancelModalBtn.addEventListener("click", closeModal);
  }

  if (roomModal) {
    roomModal.addEventListener("click", (event) => {
      if (event.target === roomModal) {
        closeModal();
      }
    });
  }

  if (roomForm) {
    roomForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = {
        room_number: document.getElementById("roomNumber").value.trim(),
        room_type: document.getElementById("roomType").value.trim(),
        max_occupancy: parseInt(document.getElementById("capacity").value, 10),
        price_per_night: parseFloat(document.getElementById("basePrice").value),
        status: document.getElementById("status").value,
      };

      // Client-side validation
      if (formData.max_occupancy < 1 || formData.max_occupancy > 10) {
        showError("Capacity must be between 1 and 10.");
        return;
      }

      if (formData.price_per_night < 0) {
        showError("Base price cannot be negative.");
        return;
      }

      try {
        if (editingId) {
          await updateRoom(editingId, formData);
          showSuccess("Room updated successfully!");
        } else {
          await createRoom(formData);
          showSuccess("Room added successfully!");
        }

        await loadRooms();
        closeModal();
      } catch (error) {
        showError(error.message || "Failed to save room. Please check the form and try again.");
      }
    });
  }

  // Load rooms on page load
  loadRooms();
}
