const reservationsTableBody = document.getElementById("reservationsTableBody");

if (reservationsTableBody) {
  let reservations = [];
  let currentFilter = "all";
  let searchQuery = "";
  let editingId = null;

  const searchInput = document.getElementById("searchInput");
  const statusFilterBtn = document.getElementById("statusFilterBtn");
  const statusFilterMenu = document.getElementById("statusFilterMenu");
  const selectedStatusText = document.getElementById("selectedStatus");
  const emptyState = document.getElementById("emptyState");
  const addReservationBtn = document.getElementById("addReservationBtn");
  const reservationModal = document.getElementById("reservationModal");
  const modalTitle = document.getElementById("modalTitle");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelModalBtn = document.getElementById("cancelModalBtn");
  const reservationForm = document.getElementById("reservationForm");

  // API base URL
  const apiBaseUrl = "/admin/api/reservations";

  // Get CSRF token from meta tag
  function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute("content") : "";
  }

  // API helper functions
  async function fetchReservations() {
    try {
      const params = new URLSearchParams();
      if (currentFilter !== "all") {
        params.append("status", currentFilter);
      }
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
        throw new Error("Failed to fetch reservations");
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error("Error fetching reservations:", error);
      showError("Failed to load reservations. Please try again.");
      return [];
    }
  }

  async function createReservation(data) {
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
        throw new Error(result.message || "Failed to create reservation");
      }

      return result.data;
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }
  }

  async function updateReservation(id, data) {
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
        throw new Error(result.message || "Failed to update reservation");
      }

      return result.data;
    } catch (error) {
      console.error("Error updating reservation:", error);
      throw error;
    }
  }

  async function deleteReservation(id) {
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
        throw new Error(result.message || "Failed to delete reservation");
      }

      return true;
    } catch (error) {
      console.error("Error deleting reservation:", error);
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

  function formatStatus(status) {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  }

  function renderReservations() {
    // Filter reservations based on current filter and search query
    let filteredReservations = [...reservations];
    
    // Apply status filter
    if (currentFilter !== "all") {
      filteredReservations = filteredReservations.filter(
        (r) => r.status === currentFilter
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredReservations = filteredReservations.filter(
        (r) =>
          r.guest_name.toLowerCase().includes(query) ||
          r.guest_email.toLowerCase().includes(query) ||
          r.room_type.toLowerCase().includes(query) ||
          (r.room && r.room.room_number && r.room.room_number.toLowerCase().includes(query))
      );
    }
    
    if (filteredReservations.length === 0) {
      reservationsTableBody.innerHTML = "";
      if (emptyState) {
        emptyState.style.display = "block";
      }
      return;
    }

    if (emptyState) {
      emptyState.style.display = "none";
    }

    reservationsTableBody.innerHTML = filteredReservations
      .map(
        (reservation) => `
      <tr>
        <td>
          <div class="guest-cell">
            <div class="guest-avatar">${getInitials(reservation.guest_name)}</div>
            <div class="guest-info">
              <div class="guest-name">${reservation.guest_name}</div>
              <div class="guest-email">${reservation.guest_email}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="dates-cell">
            <div class="date-line">Check-in: ${reservation.check_in}</div>
            <div class="date-line">Check-out: ${reservation.check_out}</div>
          </div>
        </td>
        <td>
          ${reservation.room ? `${reservation.room.room_number} - ${reservation.room_type}` : reservation.room_type}
        </td>
        <td>
          <span class="status-badge ${reservation.status}">
            ${formatStatus(reservation.status)}
          </span>
        </td>
        <td>
          <div class="actions-cell">
            <button class="action-btn edit-btn" data-action="edit" data-id="${reservation.id}">
              Edit
            </button>
            <button class="action-btn delete-btn" data-action="delete" data-id="${reservation.id}">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `
      )
      .join("");
  }

  async function loadReservations() {
    reservations = await fetchReservations();
    renderReservations();
  }

  reservationsTableBody.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.getAttribute("data-action");
    const idAttr = target.getAttribute("data-id");
    if (!action || !idAttr) return;

    const id = Number(idAttr);
    if (action === "edit") {
      await editReservation(id);
    } else if (action === "delete") {
      await deleteReservationHandler(id);
    }
  });

  async function editReservation(id) {
    const reservation = reservations.find((r) => r.id === id);
    if (!reservation) return;

    editingId = id;
    if (modalTitle) modalTitle.textContent = "Edit Reservation";
    
    // Format dates for date input (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return as-is if invalid
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    document.getElementById("guestName").value = reservation.guest_name || '';
    document.getElementById("guestEmail").value = reservation.guest_email || '';
    const guestPhoneInput = document.getElementById("guestPhone");
    if (guestPhoneInput) {
      // Try to get phone from guest relationship if available
      guestPhoneInput.value = reservation.guest?.phone || '';
    }
    document.getElementById("checkIn").value = formatDateForInput(reservation.check_in);
    document.getElementById("checkOut").value = formatDateForInput(reservation.check_out);
    document.getElementById("room").value = reservation.room_type || '';
    document.getElementById("status").value = reservation.status || 'pending';
    
    // Enable room number select
    const roomSelect = document.getElementById("roomNumber");
    if (roomSelect) {
      roomSelect.disabled = false;
    }
    
    // Load available rooms for the selected dates
    await loadAvailableRooms(reservation.room_type, formatDateForInput(reservation.check_in), formatDateForInput(reservation.check_out), id);
    
    // Set selected room if exists
    if (roomSelect && reservation.room_id) {
      // Wait a bit for the options to be populated
      setTimeout(() => {
        roomSelect.value = reservation.room_id;
      }, 100);
    }
    
    if (reservationModal) reservationModal.classList.add("show");
  }
  
  async function loadAvailableRooms(roomType, checkIn, checkOut, excludeReservationId = null) {
    try {
      const params = new URLSearchParams({
        room_type: roomType,
        check_in: checkIn,
        check_out: checkOut,
      });
      if (excludeReservationId) {
        params.append('exclude_reservation_id', excludeReservationId);
      }

      const response = await fetch(`/admin/api/rooms/available?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch available rooms");
      }

      const result = await response.json();
      const roomSelect = document.getElementById("roomNumber");
      
      if (roomSelect) {
        roomSelect.innerHTML = '<option value="">Auto-assign (any available room)</option>';
        if (result.data && result.data.length > 0) {
          result.data.forEach(room => {
            const option = document.createElement("option");
            option.value = room.id;
            option.textContent = `${room.room_number} - $${room.price_per_night}/night`;
            roomSelect.appendChild(option);
          });
        } else {
          const option = document.createElement("option");
          option.value = "";
          option.textContent = "No rooms available for selected dates";
          option.disabled = true;
          roomSelect.appendChild(option);
        }
      }
    } catch (error) {
      console.error("Error loading available rooms:", error);
    }
  }

  let pendingDeleteId = null;
  const deleteModal = document.getElementById("deleteReservationModal");
  const deleteModalConfirmBtn = document.getElementById("deleteReservationModalConfirmBtn");
  const deleteModalCancelBtn = document.getElementById("deleteReservationModalCancelBtn");

  function showDeleteModal(id) {
    const reservation = reservations.find((r) => r.id === id);
    if (!reservation) return;

    pendingDeleteId = id;
    if (deleteModal) {
      const messageEl = deleteModal.querySelector('.logout-modal-body p');
      if (messageEl) {
        messageEl.textContent = `Are you sure you want to delete the reservation for ${reservation.guest_name}? This action cannot be undone.`;
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
          await deleteReservation(pendingDeleteId);
          await loadReservations();
          hideDeleteModal();
          showSuccess("Reservation deleted successfully!");
        } catch (error) {
          showError(error.message || "Failed to delete reservation");
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

  async function deleteReservationHandler(id) {
    showDeleteModal(id);
  }

  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", (event) => {
      clearTimeout(searchTimeout);
      searchQuery = event.target.value.trim();
      searchTimeout = setTimeout(async () => {
        await loadReservations();
      }, 300); // Debounce search
    });
  }

  if (statusFilterBtn && statusFilterMenu) {
    statusFilterBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      if (statusFilterMenu) statusFilterMenu.classList.toggle("show");
    });

    document.addEventListener("click", (event) => {
      if (statusFilterBtn && !statusFilterBtn.contains(event.target)) {
        if (statusFilterMenu) statusFilterMenu.classList.remove("show");
      }
    });

    if (statusFilterMenu) {
      // Set up filter option click handlers
      const filterOptions = statusFilterMenu.querySelectorAll(".filter-option");
      filterOptions.forEach((option) => {
        option.addEventListener("click", async (event) => {
          event.preventDefault();
          event.stopPropagation();
          
          const status = option.getAttribute("data-status");
          if (!status) return;
          
          // Update current filter
          currentFilter = status;
          
          // Update UI
          if (selectedStatusText) {
            selectedStatusText.textContent = option.textContent.trim();
          }
          
          // Update selected state
          filterOptions.forEach((opt) => {
            opt.classList.remove("selected");
          });
          option.classList.add("selected");
          
          // Close dropdown
          statusFilterMenu.classList.remove("show");
          
          // Reload reservations with new filter
          await loadReservations();
        });
      });
    }
  }

  if (addReservationBtn) {
    addReservationBtn.addEventListener("click", () => {
      editingId = null;
      if (modalTitle) modalTitle.textContent = "Add Reservation";
      if (reservationForm) reservationForm.reset();
      // Clear room number select
      const roomSelect = document.getElementById("roomNumber");
      if (roomSelect) {
        roomSelect.innerHTML = '<option value="">Select room type and dates first</option>';
        roomSelect.disabled = true;
      }
      if (reservationModal) reservationModal.classList.add("show");
    });
  }
  
  // Load available rooms when room type or dates change
  const roomTypeSelect = document.getElementById("room");
  const checkInInput = document.getElementById("checkIn");
  const checkOutInput = document.getElementById("checkOut");
  const roomNumberSelect = document.getElementById("roomNumber");
  
  function handleRoomTypeOrDateChange() {
    const roomType = roomTypeSelect?.value;
    const checkIn = checkInInput?.value;
    const checkOut = checkOutInput?.value;
    
    if (roomType && checkIn && checkOut && new Date(checkOut) > new Date(checkIn)) {
      loadAvailableRooms(roomType, checkIn, checkOut, editingId);
      if (roomNumberSelect) roomNumberSelect.disabled = false;
    } else {
      if (roomNumberSelect) {
        roomNumberSelect.innerHTML = '<option value="">Select room type and dates first</option>';
        roomNumberSelect.disabled = true;
      }
    }
  }
  
  if (roomTypeSelect) {
    roomTypeSelect.addEventListener("change", handleRoomTypeOrDateChange);
  }
  if (checkInInput) {
    checkInInput.addEventListener("change", handleRoomTypeOrDateChange);
  }
  if (checkOutInput) {
    checkOutInput.addEventListener("change", handleRoomTypeOrDateChange);
  }

  function closeModal() {
    if (reservationModal) reservationModal.classList.remove("show");
    if (reservationForm) reservationForm.reset();
    editingId = null;
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (cancelModalBtn) {
    cancelModalBtn.addEventListener("click", closeModal);
  }

  if (reservationModal) {
    reservationModal.addEventListener("click", (event) => {
      if (event.target === reservationModal) {
        closeModal();
      }
    });
  }

  if (reservationForm) {
    reservationForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = {
        guest_name: document.getElementById("guestName").value.trim(),
        guest_email: document.getElementById("guestEmail").value.trim(),
        guest_phone: document.getElementById("guestPhone")?.value.trim() || null,
        check_in: document.getElementById("checkIn").value,
        check_out: document.getElementById("checkOut").value,
        room_type: document.getElementById("room").value,
        room_id: document.getElementById("roomNumber")?.value || null,
        status: document.getElementById("status").value,
      };

      // Client-side validation
      if (new Date(formData.check_out) <= new Date(formData.check_in)) {
        showError("Check-out date must be after check-in date.");
        return;
      }

      try {
        if (editingId) {
          await updateReservation(editingId, formData);
          showSuccess("Reservation updated successfully!");
        } else {
          await createReservation(formData);
          showSuccess("Reservation added successfully!");
        }

        await loadReservations();
        closeModal();
      } catch (error) {
        showError(error.message || "Failed to save reservation. Please check the form and try again.");
      }
    });
  }

  // Load reservations on page load
  loadReservations();
}
