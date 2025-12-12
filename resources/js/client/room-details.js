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

  async function fetchRoomData() {
    if (!roomTypeParam) {
      return fallbackRoom;
    }

    try {
      const response = await fetch(`/rooms/list?room_type=${encodeURIComponent(roomTypeParam)}`, {
        headers: { "Accept": "application/json" },
      });
      const result = await response.json();
      if (!response.ok || !result?.data) {
        return fallbackRoom;
      }

      const rooms = result.data;
      if (!rooms.length) {
        return fallbackRoom;
      }

      const room = rooms[0]; // first available room of that type
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
  loadRoomData();

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

      // User is logged in, proceed with booking
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

