const reservationsTableBody = document.getElementById("reservationsTableBody");

if (reservationsTableBody) {
  // Load reservations from localStorage or use default dummy data
  let storedReservations = localStorage.getItem("adminReservationsData");
  let reservations = storedReservations
    ? JSON.parse(storedReservations).map((r, index) => ({
        id: index + 1,
        guestName: r.guestName,
        guestEmail: r.email,
        checkIn: new Date(r.checkIn).toISOString().split("T")[0],
        checkOut: new Date(r.checkOut).toISOString().split("T")[0],
        room: r.room,
        status: r.status,
      }))
    : [
        {
          id: 1,
          guestName: "Olivia Martin",
          guestEmail: "olivia.martin@gmail.com",
          checkIn: "2024-08-15",
          checkOut: "2024-08-20",
          room: "Deluxe King Suite",
          status: "confirmed",
        },
        {
          id: 2,
          guestName: "Emily Carter",
          guestEmail: "emily.carter@example.com",
          checkIn: "2024-08-12",
          checkOut: "2024-08-16",
          room: "Standard Room",
          status: "checked-in",
        },
        {
          id: 3,
          guestName: "David Lee",
          guestEmail: "david.lee@example.com",
          checkIn: "2024-08-22",
          checkOut: "2024-08-25",
          room: "Executive Suite",
          status: "pending",
        },
        {
          id: 4,
          guestName: "Sophia Cruz",
          guestEmail: "sophia.cruz@example.com",
          checkIn: "2024-09-01",
          checkOut: "2024-09-04",
          room: "Presidential Suite",
          status: "confirmed",
        },
      ];

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

  function getFilteredReservations() {
    return reservations.filter((reservation) => {
      const matchesStatus =
        currentFilter === "all" || reservation.status === currentFilter;

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === "" ||
        reservation.guestName.toLowerCase().includes(query) ||
        reservation.guestEmail.toLowerCase().includes(query) ||
        reservation.room.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }

  function renderReservations() {
    const filteredReservations = getFilteredReservations();

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
            <div class="guest-avatar">${getInitials(reservation.guestName)}</div>
            <div class="guest-info">
              <div class="guest-name">${reservation.guestName}</div>
              <div class="guest-email">${reservation.guestEmail}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="dates-cell">
            <div class="date-line">Check-in: ${reservation.checkIn}</div>
            <div class="date-line">Check-out: ${reservation.checkOut}</div>
          </div>
        </td>
        <td>${reservation.room}</td>
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

  reservationsTableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.getAttribute("data-action");
    const idAttr = target.getAttribute("data-id");
    if (!action || !idAttr) return;

    const id = Number(idAttr);
    if (action === "edit") {
      editReservation(id);
    } else if (action === "delete") {
      deleteReservation(id);
    }
  });

  function editReservation(id) {
    const reservation = reservations.find((r) => r.id === id);
    if (!reservation) return;

    editingId = id;
    modalTitle.textContent = "Edit Reservation";
    document.getElementById("guestName").value = reservation.guestName;
    document.getElementById("guestEmail").value = reservation.guestEmail;
    document.getElementById("checkIn").value = reservation.checkIn;
    document.getElementById("checkOut").value = reservation.checkOut;
    document.getElementById("room").value = reservation.room;
    document.getElementById("status").value = reservation.status;
    reservationModal.classList.add("show");
  }

  function deleteReservation(id) {
    const reservation = reservations.find((r) => r.id === id);
    if (!reservation) return;

    if (
      confirm(
        `Are you sure you want to delete the reservation for ${reservation.guestName}?`
      )
    ) {
      reservations = reservations.filter((r) => r.id !== id);
      renderReservations();
      alert("Reservation deleted successfully!");
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      searchQuery = event.target.value;
      renderReservations();
    });
  }

  if (statusFilterBtn && statusFilterMenu) {
    statusFilterBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      statusFilterMenu.classList.toggle("show");
    });

    document.addEventListener("click", (event) => {
      if (!statusFilterBtn.contains(event.target)) {
        statusFilterMenu.classList.remove("show");
      }
    });

    statusFilterMenu.querySelectorAll(".filter-option").forEach((option) => {
      option.addEventListener("click", () => {
        const status = option.getAttribute("data-status");
        currentFilter = status;
        selectedStatusText.textContent = option.textContent;

        statusFilterMenu
          .querySelectorAll(".filter-option")
          .forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");
        statusFilterMenu.classList.remove("show");
        renderReservations();
      });
    });
  }

  if (addReservationBtn) {
    addReservationBtn.addEventListener("click", () => {
      editingId = null;
      modalTitle.textContent = "Add Reservation";
      reservationForm.reset();
      reservationModal.classList.add("show");
    });
  }

  function closeModal() {
    reservationModal.classList.remove("show");
    reservationForm.reset();
    editingId = null;
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (cancelModalBtn) {
    cancelModalBtn.addEventListener("click", closeModal);
  }

  reservationModal.addEventListener("click", (event) => {
    if (event.target === reservationModal) {
      closeModal();
    }
  });

  if (reservationForm) {
    reservationForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = {
        guestName: document.getElementById("guestName").value.trim(),
        guestEmail: document.getElementById("guestEmail").value.trim(),
        checkIn: document.getElementById("checkIn").value,
        checkOut: document.getElementById("checkOut").value,
        room: document.getElementById("room").value,
        status: document.getElementById("status").value,
      };

      if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
        alert("Check-out date must be after check-in date.");
        return;
      }

      if (editingId) {
        const index = reservations.findIndex((r) => r.id === editingId);
        if (index !== -1) {
          reservations[index] = { ...reservations[index], ...formData };
        }
      } else {
        reservations.unshift({
          id: Date.now(),
          ...formData,
        });
      }

      renderReservations();
      closeModal();
      alert(
        editingId
          ? "Reservation updated successfully!"
          : "Reservation added successfully!"
      );
    });
  }

  renderReservations();
}

