const roomsTableBody = document.getElementById("roomsTableBody");

if (roomsTableBody) {
  let rooms = [
    {
      id: 1,
      roomType: "Deluxe King Suite",
      capacity: 4,
      status: "available",
      basePrice: 350,
    },
    {
      id: 2,
      roomType: "Standard Room",
      capacity: 2,
      status: "occupied",
      basePrice: 250,
    },
    {
      id: 3,
      roomType: "Family Room",
      capacity: 5,
      status: "under-maintenance",
      basePrice: 450,
    },
    {
      id: 4,
      roomType: "Economy Room",
      capacity: 1,
      status: "available",
      basePrice: 150,
    },
    {
      id: 5,
      roomType: "Presidential Suite",
      capacity: 2,
      status: "available",
      basePrice: 550,
    },
  ];

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

  function formatStatus(status) {
    const statusMap = {
      available: "Available",
      occupied: "Occupied",
      "under-maintenance": "Under Maintenance",
    };
    return statusMap[status] || status;
  }

  function getFilteredRooms() {
    return rooms.filter((room) => {
      const query = searchQuery.toLowerCase();
      return (
        query === "" || room.roomType.toLowerCase().includes(query)
      );
    });
  }

  function renderRooms() {
    const filteredRooms = getFilteredRooms();

    if (filteredRooms.length === 0) {
      roomsTableBody.innerHTML = "";
      if (emptyState) {
        emptyState.style.display = "block";
      }
      return;
    }

    if (emptyState) {
      emptyState.style.display = "none";
    }

    roomsTableBody.innerHTML = filteredRooms
      .map(
        (room) => `
      <tr>
        <td>${room.roomType}</td>
        <td>${room.capacity}</td>
        <td>
          <span class="status-badge ${room.status}">
            ${formatStatus(room.status)}
          </span>
        </td>
        <td>₱${room.basePrice.toLocaleString()}</td>
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
    `
      )
      .join("");
  }

  roomsTableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.getAttribute("data-action");
    const idAttr = target.getAttribute("data-id");
    if (!action || !idAttr) return;
    const id = Number(idAttr);

    if (action === "edit") {
      editRoom(id);
    } else if (action === "delete") {
      deleteRoom(id);
    }
  });

  function editRoom(id) {
    const room = rooms.find((r) => r.id === id);
    if (!room) return;

    editingId = id;
    modalTitle.textContent = "Edit Room";
    document.getElementById("roomType").value = room.roomType;
    document.getElementById("capacity").value = room.capacity;
    document.getElementById("basePrice").value = room.basePrice;
    document.getElementById("status").value = room.status;
    roomModal.classList.add("show");
  }

  function deleteRoom(id) {
    const room = rooms.find((r) => r.id === id);
    if (!room) return;

    if (confirm(`Are you sure you want to delete ${room.roomType}?`)) {
      rooms = rooms.filter((r) => r.id !== id);
      renderRooms();
      alert("Room deleted successfully!");
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      searchQuery = event.target.value;
      renderRooms();
    });
  }

  if (addRoomBtn) {
    addRoomBtn.addEventListener("click", () => {
      editingId = null;
      modalTitle.textContent = "Add Room";
      roomForm.reset();
      roomModal.classList.add("show");
    });
  }

  function closeModal() {
    roomModal.classList.remove("show");
    roomForm.reset();
    editingId = null;
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (cancelModalBtn) {
    cancelModalBtn.addEventListener("click", closeModal);
  }

  roomModal.addEventListener("click", (event) => {
    if (event.target === roomModal) {
      closeModal();
    }
  });

  if (roomForm) {
    roomForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = {
        roomType: document.getElementById("roomType").value.trim(),
        capacity: parseInt(document.getElementById("capacity").value, 10),
        basePrice: parseInt(document.getElementById("basePrice").value, 10),
        status: document.getElementById("status").value,
      };

      if (formData.capacity < 1 || formData.capacity > 10) {
        alert("Capacity must be between 1 and 10.");
        return;
      }

      if (formData.basePrice < 0) {
        alert("Base price cannot be negative.");
        return;
      }

      if (editingId) {
        const index = rooms.findIndex((r) => r.id === editingId);
        if (index !== -1) {
          rooms[index] = { ...rooms[index], ...formData };
        }
      } else {
        rooms.push({
          id: Date.now(),
          ...formData,
        });
      }

      renderRooms();
      closeModal();
      alert(
        editingId ? "Room updated successfully!" : "Room added successfully!"
      );
    });
  }

  renderRooms();
}

