// Room Details Page functionality

document.addEventListener("DOMContentLoaded", function () {
  // Get room data from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("room");
  const hotelName = urlParams.get("hotel");

  // Sample room data (in a real app, this would come from a database/API)
  const roomsData = {
    single: {
      title: "Blue Origin Fams",
      location: "Galle, Sri Lanka",
      price: 200,
      image: "/assets/FiestaResort1.jpg",
      description: [
        "Minimal techno is a minimalist subgenre of techno music. It is characterized by a stripped-down aesthetic that exploits the use of repetition and understated development. Minimal techno is thought to have been originally developed in the early 1990s by Detroit-based producers Robert Hood and Daniel Bell.",
        "Such trends saw the demise of the soul-infused techno that typified the original Detroit sound. Robert Hood has noted that he and Daniel Bell both realized something was missing from techno in the post-rave era.",
      ],
      amenities: {
        bedrooms: 1,
        livingRooms: 1,
        bathrooms: 1,
        diningRooms: 1,
        wifi: 10,
        unitReady: 7,
        refrigerator: 1,
        television: 2,
      },
    },
    double: {
      title: "Ocean View Suite",
      location: "Colombo, Sri Lanka",
      price: 350,
      image: "/assets/FiestaResort2.jpg",
      description: [
        "Experience luxury at its finest in our Ocean View Suite. This spacious room offers breathtaking panoramic views of the Indian Ocean, complemented by modern amenities and elegant furnishings.",
        "Perfect for couples or small families, the suite features a separate living area, premium bedding, and a private balcony where you can enjoy stunning sunsets.",
      ],
      amenities: {
        bedrooms: 2,
        livingRooms: 1,
        bathrooms: 2,
        diningRooms: 1,
        wifi: 50,
        unitReady: 5,
        refrigerator: 1,
        television: 3,
      },
    },
    deluxe: {
      title: "Deluxe Garden Villa",
      location: "Kandy, Sri Lanka",
      price: 500,
      image: "/assets/FiestaResort3.jpg",
      description: [
        "Immerse yourself in tropical paradise with our Deluxe Garden Villa. Surrounded by lush greenery and exotic flowers, this villa offers complete privacy and tranquility.",
        "Features include a private plunge pool, outdoor shower, king-size bed, and a spacious terrace perfect for morning coffee or evening relaxation.",
      ],
      amenities: {
        bedrooms: 3,
        livingRooms: 2,
        bathrooms: 3,
        diningRooms: 1,
        wifi: 100,
        unitReady: 3,
        refrigerator: 2,
        television: 4,
      },
    },
    suite: {
      title: "Presidential Suite",
      location: "Dehiwala, Sri Lanka",
      price: 850,
      image: "/assets/FiestaResort4.jpg",
      description: [
        "The epitome of luxury, our Presidential Suite offers unmatched comfort and sophistication. Spanning over 200 square meters, this suite is designed for discerning guests who expect nothing but the best.",
        "Enjoy exclusive amenities including a private butler service, in-suite dining, home theater system, and panoramic ocean views from every room.",
      ],
      amenities: {
        bedrooms: 4,
        livingRooms: 3,
        bathrooms: 4,
        diningRooms: 2,
        wifi: 200,
        unitReady: 2,
        refrigerator: 2,
        television: 5,
      },
    },
  };

  // Load room data
  function loadRoomData() {
    const room = roomsData[roomId] || roomsData.single;

    // Update page content
    const roomTitleEl = document.getElementById("roomTitle");
    const roomLocationEl = document.getElementById("roomLocation");
    const roomImageEl = document.getElementById("roomImage");
    const priceAmountEl = document.getElementById("priceAmount");

    if (roomTitleEl) roomTitleEl.textContent = room.title;
    if (roomLocationEl) roomLocationEl.textContent = room.location;
    if (roomImageEl) {
      roomImageEl.src = room.image;
      roomImageEl.alt = room.title;
    }
    if (priceAmountEl) priceAmountEl.textContent = `$${room.price}`;

    // Update description
    const aboutTextDiv = document.querySelector(".about-text");
    if (aboutTextDiv) {
      aboutTextDiv.innerHTML = "";
      room.description.forEach((paragraph) => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        aboutTextDiv.appendChild(p);
      });
    }

    // Update amenities
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
      if (el) el.textContent = room.amenities[key];
    });

    // Update page title
    document.title = `${room.title} - Fiesta Resort`;

    // Store room data for booking
    sessionStorage.setItem("selectedRoom", JSON.stringify(room));
  }

  // Load room data on page load
  loadRoomData();

  // Handle Book Now button - check login before allowing navigation
  const bookNowBtn = document.getElementById("bookNowBtn");
  if (bookNowBtn) {
    bookNowBtn.addEventListener("click", function (e) {
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (!isLoggedIn) {
        e.preventDefault();
        alert("Please login to book this room");
        // Store the current page URL to redirect back after login
        sessionStorage.setItem("redirectAfterLogin", window.location.href);
        // Change href to login page
        this.href = "/login";
        this.click();
        return;
      }

      // Get room data and store for booking page
      const roomData = JSON.parse(sessionStorage.getItem("selectedRoom") || "{}");
      const bookingData = {
        room: roomData,
        hotel: hotelName || "Blue Origin Farms",
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

