// Room Details Page functionality

document.addEventListener("DOMContentLoaded", async function () {
  // Get room data from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const roomTypeParam = urlParams.get("room_type") || urlParams.get("room");
  const hotelName = urlParams.get("hotel");

  const fallbackRoom = {
    room_type: roomTypeParam || "Standard Room",
    title: roomTypeParam || "Standard Room",
    location: "Brgy. Ipil, Surigao City",
    price_per_night: 2000,
    image: "/assets/FiestaResort1.jpg",
    amenities: {
      bedrooms: 1,
      livingRooms: 1,
      bathrooms: 1,
      diningRooms: 1,
      wifi: 10,
      unitReady: 1,
      refrigerator: 1,
      television: 1,
    },
    description: [
      "Enjoy a comfortable stay at Fiesta Resort with essential amenities.",
    ],
  };

  let allRooms = [];
  let selectedRoom = null;
  const roomsListUrl = document.querySelector('.room-details-section')?.getAttribute('data-rooms-list-url') || '/rooms/list';

  async function fetchRoomData() {
    if (!roomTypeParam) {
      return fallbackRoom;
    }

    try {
      const response = await fetch(`${roomsListUrl}?room_type=${encodeURIComponent(roomTypeParam)}`, {
        headers: { "Accept": "application/json" },
      });
      const result = await response.json();
      if (!response.ok || !result?.data) {
        return fallbackRoom;
      }

      allRooms = result.data;
      if (!allRooms.length) {
        return fallbackRoom;
      }

      // Use first room for general info display
      const room = allRooms[0];
      return {
        room_type: room.room_type,
        title: room.room_type,
        location: "Brgy. Ipil, Surigao City",
        price_per_night: room.price_per_night || 2000,
        image: "/assets/FiestaResort1.jpg",
        amenities: {
          bedrooms: room.bedrooms || 1,
          livingRooms: room.living_rooms || 1,
          bathrooms: room.bathrooms || 1,
          diningRooms: room.dining_rooms || 1,
          wifi: 10,
          unitReady: 1,
          refrigerator: 1,
          television: 1,
        },
        description: [
          room.description || "Comfortable room at Fiesta Resort.",
        ],
      };
    } catch (e) {
      console.error("Failed to load room data:", e);
      return fallbackRoom;
    }
  }

  function renderRoomsList() {
    const roomsListContainer = document.getElementById("roomsList");
    if (!roomsListContainer) return;

    if (!allRooms || allRooms.length === 0) {
      roomsListContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #64748b;">
          <p>No rooms available for this type at the moment.</p>
        </div>
      `;
      return;
    }

    roomsListContainer.innerHTML = allRooms.map((room, index) => {
      const isSelected = selectedRoom && selectedRoom.id === room.id;
      return `
        <div class="room-item" 
             data-room-id="${room.id}"
             style="
               padding: 1.25rem;
               border: 2px solid ${isSelected ? '#4169e1' : '#e0e0e0'};
               border-radius: 12px;
               background: ${isSelected ? '#f0f4ff' : '#ffffff'};
               cursor: pointer;
               transition: all 0.3s ease;
             "
             onmouseover="this.style.borderColor='#4169e1'; this.style.boxShadow='0 4px 12px rgba(65, 105, 225, 0.15)'"
             onmouseout="this.style.borderColor='${isSelected ? '#4169e1' : '#e0e0e0'}'; this.style.boxShadow='none'">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h4 style="margin: 0 0 0.5rem 0; color: #152c5b; font-size: 1.1rem;">
                Room ${room.room_number}
                ${isSelected ? '<span style="margin-left: 0.5rem; color: #4169e1; font-size: 0.9rem;">✓ Selected</span>' : ''}
              </h4>
              <p style="margin: 0.25rem 0; color: #64748b; font-size: 0.9rem;">
                Max Occupancy: ${room.max_occupancy || 2} ${room.max_occupancy === 1 ? 'person' : 'people'}
              </p>
              ${room.description ? `<p style="margin: 0.5rem 0 0 0; color: #64748b; font-size: 0.85rem;">${room.description.substring(0, 100)}${room.description.length > 100 ? '...' : ''}</p>` : ''}
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.25rem; font-weight: 600; color: #152c5b;">
                ₱${Number(room.price_per_night || 0).toLocaleString()}
              </div>
              <div style="font-size: 0.85rem; color: #64748b;">per night</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Add click handlers
    roomsListContainer.querySelectorAll('.room-item').forEach(item => {
      item.addEventListener('click', function() {
        const roomId = parseInt(this.getAttribute('data-room-id'));
        selectRoom(roomId);
      });
    });
  }

  function selectRoom(roomId) {
    selectedRoom = allRooms.find(r => r.id === roomId);
    if (!selectedRoom) return;

    // Update UI
    const priceAmountEl = document.getElementById("priceAmount");
    const selectedRoomInfoEl = document.getElementById("selectedRoomInfo");
    const selectedRoomNumberEl = document.getElementById("selectedRoomNumber");
    const bookNowBtn = document.getElementById("bookNowBtn");
    const bookingInfoText = document.getElementById("bookingInfoText");

    if (priceAmountEl) {
      priceAmountEl.textContent = `₱${Number(selectedRoom.price_per_night || 0).toLocaleString()}`;
    }

    if (selectedRoomInfoEl && selectedRoomNumberEl) {
      selectedRoomInfoEl.style.display = 'block';
      selectedRoomNumberEl.textContent = `Room ${selectedRoom.room_number} - ₱${Number(selectedRoom.price_per_night || 0).toLocaleString()}/night`;
    }

    if (bookNowBtn) {
      bookNowBtn.style.opacity = '1';
      bookNowBtn.style.pointerEvents = 'auto';
      bookNowBtn.textContent = 'Book Now!';
    }

    if (bookingInfoText) {
      bookingInfoText.textContent = 'You will be redirected to complete your booking';
    }

    // Store selected room for booking
    sessionStorage.setItem("selectedRoom", JSON.stringify({
      id: selectedRoom.id,
      roomType: selectedRoom.room_type,
      roomNumber: selectedRoom.room_number,
      title: selectedRoom.room_type,
      location: "Brgy. Ipil, Surigao City",
      price: selectedRoom.price_per_night,
      image: "/assets/FiestaResort1.jpg",
    }));

    // Re-render list to show selection
    renderRoomsList();
  }

  async function loadRoomData() {
    const room = await fetchRoomData();

    // Update page content
    const roomTitleEl = document.getElementById("roomTitle");
    const roomLocationEl = document.getElementById("roomLocation");
    const roomImageEl = document.getElementById("roomImage");
    const priceAmountEl = document.getElementById("priceAmount");

    if (roomTitleEl) roomTitleEl.textContent = room.title || room.room_type;
    if (roomLocationEl) roomLocationEl.textContent = room.location || "Brgy. Ipil, Surigao City";
    if (roomImageEl) {
      roomImageEl.src = room.image;
      roomImageEl.alt = room.title || room.room_type;
    }
    if (priceAmountEl) priceAmountEl.textContent = `₱${Number(room.price_per_night || 0).toLocaleString()} per night`;

    // Update description
    const aboutTextDiv = document.querySelector(".about-text");
    if (aboutTextDiv) {
      aboutTextDiv.innerHTML = "";
      (room.description || []).forEach((paragraph) => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        aboutTextDiv.appendChild(p);
      });
    }

    // Update amenities (if present)
    const amenityIds = {
      bedrooms: "bedrooms",
      livingRooms: "livingRooms",
      bathrooms: "bathrooms",
      diningRooms: "diningRooms",
      wifi: "wifi",
      unitReady: "unitReady",
      refrigerator: "refrigerator",
      television: "television",
    };

    Object.keys(amenityIds).forEach((key) => {
      const el = document.getElementById(amenityIds[key]);
      if (el && room.amenities && room.amenities[key] !== undefined) {
        el.textContent = room.amenities[key];
      }
    });

    // Update page title
    document.title = `${room.title || room.room_type} - Fiesta Resort`;

    // Store room data for booking (use actual room_type)
    sessionStorage.setItem("selectedRoom", JSON.stringify({
      roomType: room.room_type,
      title: room.title || room.room_type,
      location: room.location,
      price: room.price_per_night,
      image: room.image,
    }));
  }

  // Load room data on page load
  loadRoomData().then(() => {
    // After loading room data, render the rooms list
    renderRoomsList();
  });

  // Handle Book Now button - check login before allowing navigation
  const bookNowBtn = document.getElementById("bookNowBtn");
  if (bookNowBtn) {
    bookNowBtn.addEventListener("click", function (e) {
      // Check if user is logged in - check both Laravel auth and localStorage
      const isLoggedIn = window.laravelAuth?.isAuthenticated || localStorage.getItem("isLoggedIn") === "true";
      const userRole = window.laravelAuth?.user?.role || localStorage.getItem("userRole");

      // Prevent admins from booking
      if (isLoggedIn && userRole === 'admin') {
        e.preventDefault();
        if (window.showError) {
          window.showError("Admins cannot make bookings. Please use a regular user account.");
        } else {
          alert("Admins cannot make bookings. Please use a regular user account.");
        }
        return;
      }

      if (!isLoggedIn) {
        e.preventDefault();
        if (window.showError) {
          window.showError("Please login to book this room");
        } else {
          alert("Please login to book this room");
        }
        // Store the current page URL to redirect back after login
        sessionStorage.setItem("redirectAfterLogin", window.location.href);
        // Redirect to login page
        window.location.href = "/login";
        return;
      }

      // User is logged in, check if room is selected
      if (!selectedRoom) {
        e.preventDefault();
        if (window.showError) {
          window.showError("Please select a room from the list below before booking");
        } else {
          alert("Please select a room from the list below before booking");
        }
        // Scroll to rooms list
        const roomsList = document.getElementById("roomsList");
        if (roomsList) {
          roomsList.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // User is logged in and room is selected, proceed with booking
      // Get room data and store for booking page
      const roomData = JSON.parse(sessionStorage.getItem("selectedRoom") || "{}");
      const bookingData = {
        room: roomData,
        hotel: hotelName || "Fiesta Resort",
        date: new Date().toISOString(),
      };
      sessionStorage.setItem("pendingBooking", JSON.stringify(bookingData));
      // Let the link navigate naturally
    });
  }

  // Add image zoom effect on hover
  const roomImage = document.getElementById("roomImage");
  if (roomImage) {
    roomImage.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
      this.style.transition = "transform 0.5s ease";
    });

    roomImage.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  }

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe amenity items
  document.querySelectorAll(".amenity-item").forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";
    item.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(item);
  });
});

