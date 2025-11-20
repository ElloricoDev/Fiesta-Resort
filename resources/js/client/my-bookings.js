// Direct URLs and asset paths
const assetUrl = (key, fallback = "/assets/FiestaResort1.jpg") => {
  const assets = {
    resort1: "/assets/FiestaResort1.jpg",
    resort2: "/assets/FiestaResort2.jpg",
    resort3: "/assets/FiestaResort3.jpg",
    resort4: "/assets/FiestaResort4.jpg",
    resort5: "/assets/FiestaResort5.jpg",
  };
  return assets[key] || fallback;
};

document.addEventListener("DOMContentLoaded", function () {
  checkAuthentication();
  loadBookings();
  setupFilters();
  setupModal();
});

function checkAuthentication() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    alert("Please login to view your bookings");
    // Navigation handled by HTML - redirect via meta or link
    const loginLink = document.createElement("a");
    loginLink.href = "/login";
    document.body.appendChild(loginLink);
    loginLink.click();
    document.body.removeChild(loginLink);
  }
}

function loadBookings(filter = "all") {
  const bookingsList = document.getElementById("bookingsList");
  const emptyState = document.getElementById("emptyState");
  const userEmail = localStorage.getItem("userEmail");

  let bookings = JSON.parse(localStorage.getItem("userBookings")) || [];

  if (bookings.length === 0) {
    bookings = generateSampleBookings(userEmail);
    localStorage.setItem("userBookings", JSON.stringify(bookings));
  }

  let filteredBookings = bookings;
  if (filter !== "all") {
    filteredBookings = bookings.filter(
      (booking) => booking.status.toLowerCase() === filter
    );
  }

  bookingsList.innerHTML = "";

  if (filteredBookings.length === 0) {
    emptyState.style.display = "block";
    bookingsList.style.display = "none";
  } else {
    emptyState.style.display = "none";
    bookingsList.style.display = "grid";

    filteredBookings.forEach((booking) => {
      const bookingCard = createBookingCard(booking);
      bookingsList.appendChild(bookingCard);
    });
    
    // Attach event listeners to buttons
    attachBookingEventListeners();
  }
}

function createBookingCard(booking) {
  const card = document.createElement("div");
  card.className = "booking-card";
  card.setAttribute("data-booking-id", booking.id);

  const statusClass = booking.status.toLowerCase().replace(/\s+/g, "-");
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );

  card.innerHTML = `
    <div class="booking-card-content">
      <div class="booking-image">
        <img src="${booking.image}" alt="${booking.hotel}" />
      </div>

      <div class="booking-info">
        <div class="booking-header">
          <div>
            <h3 class="booking-title">${booking.hotel}</h3>
            <div class="booking-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              ${booking.location}
            </div>
          </div>
          <span class="booking-status ${statusClass}">${booking.status}</span>
        </div>

        <div class="booking-details-grid">
          <div class="booking-detail">
            <span class="booking-detail-label">Check-in</span>
            <span class="booking-detail-value">${formatDate(
              booking.checkIn
            )}</span>
          </div>
          <div class="booking-detail">
            <span class="booking-detail-label">Check-out</span>
            <span class="booking-detail-value">${formatDate(
              booking.checkOut
            )}</span>
          </div>
          <div class="booking-detail">
            <span class="booking-detail-label">Guests</span>
            <span class="booking-detail-value">${booking.guests} ${
    booking.guests > 1 ? "Guests" : "Guest"
  }</span>
          </div>
          <div class="booking-detail">
            <span class="booking-detail-label">Nights</span>
            <span class="booking-detail-value">${nights} ${
    nights > 1 ? "Nights" : "Night"
  }</span>
          </div>
        </div>

        <div class="booking-id">Booking ID: ${booking.id}</div>
      </div>

      <div class="booking-actions">
        <button class="btn btn-primary view-details-btn" data-booking-id="${
          booking.id
        }" type="button">View Details</button>
        ${
          booking.status === "Upcoming" || booking.status === "Confirmed"
            ? `<button class="btn btn-secondary modify-booking-btn" data-booking-id="${booking.id}" type="button">
                Modify
              </button>
              <button class="btn btn-danger cancel-booking-btn" data-booking-id="${booking.id}" type="button">
                Cancel
              </button>`
            : ""
        }
      </div>
    </div>
  `;

  return card;
}

function attachBookingEventListeners() {
  // View Details buttons
  const viewDetailsButtons = document.querySelectorAll(".view-details-btn");
  viewDetailsButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const bookingId = btn.getAttribute("data-booking-id");
      viewBookingDetails(bookingId);
    });
  });

  // Modify buttons
  const modifyButtons = document.querySelectorAll(".modify-booking-btn");
  modifyButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const bookingId = btn.getAttribute("data-booking-id");
      modifyBooking(bookingId);
    });
  });

  // Cancel buttons
  const cancelButtons = document.querySelectorAll(".cancel-booking-btn");
  cancelButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const bookingId = btn.getAttribute("data-booking-id");
      cancelBooking(bookingId);
    });
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const filter = button.getAttribute("data-filter");
      loadBookings(filter);
    });
  });
}

function viewBookingDetails(bookingId) {
  const bookings = JSON.parse(localStorage.getItem("userBookings")) || [];
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) return;

  const modal = document.getElementById("bookingModal");
  const modalBody = document.getElementById("modalBody");

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );
  const statusClass = booking.status.toLowerCase().replace(/\s+/g, "-");
  
  // Normalize booking data to handle different structures
  const normalizedBooking = {
    hotel: booking.hotel || "Unknown Hotel",
    location: booking.location || "Unknown Location",
    image: booking.image || assetUrl("resort1"),
    roomType: booking.roomType || booking.room?.title || "Standard Room",
    guestName: booking.guestName || localStorage.getItem("userName") || "Guest",
    guestEmail: booking.guestEmail || localStorage.getItem("userEmail") || "guest@example.com",
    guestPhone: booking.guestPhone || "+1 (555) 000-0000",
    totalPrice: booking.totalPrice || booking.room?.price * (booking.days || nights) || 0,
    ...booking
  };

  modalBody.innerHTML = `
    <div class="modal-image">
      <img src="${normalizedBooking.image}" alt="${normalizedBooking.hotel}" />
    </div>

    <div class="modal-section">
      <h3 class="booking-title">${normalizedBooking.hotel}</h3>
      <div class="booking-location">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        ${normalizedBooking.location}
      </div>
      <span class="booking-status ${statusClass}" style="margin-top: 12px; display: inline-block;">${
    normalizedBooking.status
  }</span>
    </div>

    <div class="modal-section">
      <h4 class="modal-section-title">Booking Information</h4>
      <div class="modal-details-grid">
        <div class="modal-detail">
          <span class="modal-detail-label">Booking ID</span>
          <span class="modal-detail-value">${normalizedBooking.id}</span>
        </div>
        <div class="modal-detail">
          <span class="modal-detail-label">Booking Date</span>
          <span class="modal-detail-value">${formatDate(
            normalizedBooking.bookingDate || normalizedBooking.checkIn
          )}</span>
        </div>
        <div class="modal-detail">
          <span class="modal-detail-label">Check-in</span>
          <span class="modal-detail-value">${formatDate(normalizedBooking.checkIn)}</span>
        </div>
        <div class="modal-detail">
          <span class="modal-detail-label">Check-out</span>
          <span class="modal-detail-value">${formatDate(
            normalizedBooking.checkOut
          )}</span>
        </div>
        <div class="modal-detail">
          <span class="modal-detail-label">Number of Nights</span>
          <span class="modal-detail-value">${nights} ${
    nights > 1 ? "Nights" : "Night"
  }</span>
        </div>
        <div class="modal-detail">
          <span class="modal-detail-label">Guests</span>
          <span class="modal-detail-value">${normalizedBooking.guests} ${
    normalizedBooking.guests > 1 ? "Guests" : "Guest"
  }</span>
        </div>
      </div>
    </div>

    <div class="modal-section">
      <h4 class="modal-section-title">Guest Information</h4>
      <div class="modal-details-grid">
        <div class="modal-detail">
          <span class="modal-detail-label">Full Name</span>
          <span class="modal-detail-value">${normalizedBooking.guestName}</span>
        </div>
        <div class="modal-detail">
          <span class="modal-detail-label">Email</span>
          <span class="modal-detail-value">${normalizedBooking.guestEmail}</span>
        </div>
        <div class="modal-detail">
          <span class="modal-detail-label">Phone</span>
          <span class="modal-detail-value">${normalizedBooking.guestPhone}</span>
        </div>
        <div class="modal-detail">
          <span class="modal-detail-label">Room Type</span>
          <span class="modal-detail-value">${normalizedBooking.roomType}</span>
        </div>
      </div>
    </div>

    <div class="modal-price">
      <span class="modal-price-label">Total Amount</span>
      <span class="modal-price-value">$${parseFloat(normalizedBooking.totalPrice || 0).toFixed(2)}</span>
    </div>

    ${
      (normalizedBooking.status === "Upcoming" || 
       normalizedBooking.status === "Confirmed" || 
       normalizedBooking.status === "upcoming" || 
       normalizedBooking.status === "confirmed")
        ? `<div class="modal-actions">
          <button class="btn btn-secondary modal-modify-btn" data-booking-id="${normalizedBooking.id}" type="button">
            Modify Booking
          </button>
          <button class="btn btn-danger modal-cancel-btn" data-booking-id="${normalizedBooking.id}" type="button">
            Cancel Booking
          </button>
        </div>`
        : ""
    }
  `;

  modal.classList.add("show");
  
  // Attach event listeners to modal buttons
  const modalModifyBtn = modal.querySelector(".modal-modify-btn");
  const modalCancelBtn = modal.querySelector(".modal-cancel-btn");
  
  if (modalModifyBtn) {
    modalModifyBtn.addEventListener("click", () => {
      closeModal();
      modifyBooking(bookingId);
    });
  }
  
  if (modalCancelBtn) {
    modalCancelBtn.addEventListener("click", () => {
      cancelBooking(bookingId);
    });
  }
  
  // Store normalized booking for reference
  modal._normalizedBooking = normalizedBooking;
}

function setupModal() {
  const modal = document.getElementById("bookingModal");
  const modalClose = document.getElementById("modalClose");

  modalClose.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });
}

function closeModal() {
  const modal = document.getElementById("bookingModal");
  modal.classList.remove("show");
}

function modifyBooking(bookingId) {
  alert(
    "Modify booking functionality will be implemented soon.\nBooking ID: " +
      bookingId
  );
}

function cancelBooking(bookingId) {
  const confirmed = confirm(
    "Are you sure you want to cancel this booking? This action cannot be undone."
  );

  if (confirmed) {
    let bookings = JSON.parse(localStorage.getItem("userBookings")) || [];
    const bookingIndex = bookings.findIndex((b) => b.id === bookingId);

    if (bookingIndex !== -1) {
      bookings[bookingIndex].status = "Cancelled";
      localStorage.setItem("userBookings", JSON.stringify(bookings));

      closeModal();

      const activeFilter = document.querySelector(".filter-btn.active");
      const currentFilter = activeFilter
        ? activeFilter.getAttribute("data-filter")
        : "all";
      loadBookings(currentFilter);

      alert("Booking cancelled successfully");
    }
  }
}

function generateSampleBookings(userEmail) {
  const today = new Date();
  const userName = userEmail ? userEmail.split("@")[0] : "Guest";
  const capitalizedName =
    userName.charAt(0).toUpperCase() + userName.slice(1).replace(/[._-]/g, " ");

  return [
    {
      id: "BR" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      hotel: "Blue Origin Farms",
      location: "Galle, Sri Lanka",
      image: assetUrl("resort1"),
      roomType: "Deluxe Suite",
      checkIn: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      checkOut: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      guests: 2,
      guestName: capitalizedName,
      guestEmail: userEmail || "guest@example.com",
      guestPhone: "+1 (555) 123-4567",
      totalPrice: 450.0,
      status: "Upcoming",
      bookingDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
    {
      id: "BR" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      hotel: "Ocean Land",
      location: "Trincomalee, Sri Lanka",
      image: assetUrl("resort2"),
      roomType: "Ocean View Room",
      checkIn: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      checkOut: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      guests: 3,
      guestName: capitalizedName,
      guestEmail: userEmail || "guest@example.com",
      guestPhone: "+1 (555) 123-4567",
      totalPrice: 132.0,
      status: "Completed",
      bookingDate: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
    {
      id: "BR" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      hotel: "Stark House",
      location: "Dehiwala, Sri Lanka",
      image: assetUrl("resort3"),
      roomType: "Premium Suite",
      checkIn: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      checkOut: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      guests: 2,
      guestName: capitalizedName,
      guestEmail: userEmail || "guest@example.com",
      guestPhone: "+1 (555) 123-4567",
      totalPrice: 3424.0,
      status: "Confirmed",
      bookingDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  ];
}

window.viewBookingDetails = viewBookingDetails;
window.modifyBooking = modifyBooking;
window.cancelBooking = cancelBooking;
window.closeModal = closeModal;

