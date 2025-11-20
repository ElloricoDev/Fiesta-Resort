const guestsTableBody = document.getElementById("guestsTableBody");

if (guestsTableBody) {
  // Load guests from localStorage or use default dummy data
  let storedGuests = localStorage.getItem("adminGuestsData");
  let guests = storedGuests
    ? JSON.parse(storedGuests).map((g, index) => ({
        id: index + 1,
        guestId: g.id,
        name: g.name,
        email: g.email,
        phone: g.phone,
        totalStays: g.totalBookings || 0,
        startSince: g.lastVisit
          ? new Date(g.lastVisit).toISOString().split("T")[0]
          : "2023-01-01",
      }))
    : [
        {
          id: 1,
          guestId: "#1021",
          name: "Olivia Martin",
          email: "olivia.martin@gmail.com",
          phone: "(555) 123-4567",
          totalStays: 5,
          startSince: "2022-03-10",
        },
        {
          id: 2,
          guestId: "#1022",
          name: "Emily Carter",
          email: "emily.carter@example.com",
          phone: "(555) 987-6543",
          totalStays: 7,
          startSince: "2020-06-19",
        },
        {
          id: 3,
          guestId: "#1023",
          name: "David Lee",
          email: "david.lee@example.com",
          phone: "(555) 456-7890",
          totalStays: 2,
          startSince: "2023-05-20",
        },
      ];

  let searchQuery = "";
  let editingId = null;
  let nextGuestIdNumber = 1024;

  const searchInput = document.getElementById("searchInput");
  const emptyState = document.getElementById("emptyState");
  const addGuestBtn = document.getElementById("addGuestBtn");
  const guestModal = document.getElementById("guestModal");
  const modalTitle = document.getElementById("modalTitle");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cancelModalBtn = document.getElementById("cancelModalBtn");
  const guestForm = document.getElementById("guestForm");

  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function getFilteredGuests() {
    return guests.filter((guest) => {
      const query = searchQuery.toLowerCase();
      return (
        query === "" ||
        guest.name.toLowerCase().includes(query) ||
        guest.email.toLowerCase().includes(query) ||
        guest.phone.toLowerCase().includes(query) ||
        guest.guestId.toLowerCase().includes(query)
      );
    });
  }

  function renderGuests() {
    const filteredGuests = getFilteredGuests();

    if (filteredGuests.length === 0) {
      guestsTableBody.innerHTML = "";
      if (emptyState) {
        emptyState.style.display = "block";
      }
      return;
    }

    if (emptyState) {
      emptyState.style.display = "none";
    }

    guestsTableBody.innerHTML = filteredGuests
      .map(
        (guest) => `
      <tr>
        <td>
          <div class="guest-cell">
            <div class="guest-avatar">${getInitials(guest.name)}</div>
            <div class="guest-info">
              <div class="guest-name">${guest.name}</div>
              <div class="guest-id">Guest ID: ${guest.guestId}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="contact-cell">
            <div class="contact-line">${guest.email}</div>
            <div class="contact-line">${guest.phone}</div>
          </div>
        </td>
        <td>${guest.totalStays}</td>
        <td>${guest.startSince}</td>
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

  function closeModal() {
    guestModal.classList.remove("show");
    guestForm.reset();
    editingId = null;
  }

  guestsTableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const action = target.getAttribute("data-action");
    const id = target.getAttribute("data-id");

    if (!action || !id) return;

    if (action === "edit") {
      editGuest(Number(id));
    } else if (action === "delete") {
      deleteGuest(Number(id));
    }
  });

  function editGuest(id) {
    const guest = guests.find((g) => g.id === id);
    if (!guest) return;

    editingId = id;
    modalTitle.textContent = "Edit Guest";
    document.getElementById("guestName").value = guest.name;
    document.getElementById("guestEmail").value = guest.email;
    document.getElementById("guestPhone").value = guest.phone;
    document.getElementById("startSince").value = guest.startSince;
    document.getElementById("totalStays").value = guest.totalStays;
    guestModal.classList.add("show");
  }

  function deleteGuest(id) {
    const guest = guests.find((g) => g.id === id);
    if (!guest) return;

    if (confirm(`Are you sure you want to delete ${guest.name}?`)) {
      guests = guests.filter((g) => g.id !== id);
      renderGuests();
      alert("Guest deleted successfully!");
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      searchQuery = event.target.value;
      renderGuests();
    });
  }

  if (addGuestBtn) {
    addGuestBtn.addEventListener("click", () => {
      editingId = null;
      modalTitle.textContent = "Add Guest";
      guestForm.reset();
      guestModal.classList.add("show");
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (cancelModalBtn) {
    cancelModalBtn.addEventListener("click", closeModal);
  }

  guestModal.addEventListener("click", (event) => {
    if (event.target === guestModal) {
      closeModal();
    }
  });

  if (guestForm) {
    guestForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = {
        name: document.getElementById("guestName").value.trim(),
        email: document.getElementById("guestEmail").value.trim(),
        phone: document.getElementById("guestPhone").value.trim(),
        startSince: document.getElementById("startSince").value,
        totalStays: parseInt(document.getElementById("totalStays").value, 10),
      };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address.");
        return;
      }

      if (formData.totalStays < 0) {
        alert("Total stays cannot be negative.");
        return;
      }

      if (editingId) {
        const index = guests.findIndex((g) => g.id === editingId);
        if (index !== -1) {
          guests[index] = {
            ...guests[index],
            ...formData,
          };
        }
      } else {
        guests.push({
          id: Date.now(),
          guestId: `#${nextGuestIdNumber}`,
          ...formData,
        });
        nextGuestIdNumber += 1;
      }

      renderGuests();
      closeModal();
      alert(editingId ? "Guest updated successfully!" : "Guest added successfully!");
    });
  }

  renderGuests();
}

