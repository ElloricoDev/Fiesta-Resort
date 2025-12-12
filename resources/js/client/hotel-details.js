// Asset paths - using relative paths from public/assets
const getAsset = (key, fallback = "/assets/FiestaResort1.jpg") => {
  const assets = {
    resort1: "/assets/FiestaResort1.jpg",
    resort2: "/assets/FiestaResort2.jpg",
    resort3: "/assets/FiestaResort3.jpg",
    resort4: "/assets/FiestaResort4.jpg",
    resort5: "/assets/FiestaResort5.jpg",
  };
  return assets[key] || fallback;
};

// Hotel data mapping (for backward compatibility)
const hotelsData = {
  "fiesta-resort-main": {
    name: "Fiesta Resort Main",
    location: "Brgy. Ipil, Surigao City",
    mainImage: getAsset("resort1"),
    secondaryImage: getAsset("resort5"),
  },
  "ocean-view-villa": {
    name: "Ocean View Villa",
    location: "Surigao City",
    mainImage: getAsset("resort2"),
    secondaryImage: getAsset("resort4"),
  },
  "mountain-peak-resort": {
    name: "Mountain Peak Resort",
    location: "Surigao del Norte",
    mainImage: getAsset("resort3"),
    secondaryImage: getAsset("resort5"),
  },
  "garden-paradise": {
    name: "Garden Paradise",
    location: "Brgy. Ipil, Surigao City",
    mainImage: getAsset("resort4"),
    secondaryImage: getAsset("resort2"),
  },
  "sunset-bay-resort": {
    name: "Sunset Bay Resort",
    location: "Surigao City",
    mainImage: getAsset("resort5"),
    secondaryImage: getAsset("resort3"),
  },
};

window.addEventListener("DOMContentLoaded", () => {
  loadHotelDetails();
  checkAuthentication();
});

function loadHotelDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const hotelParam = urlParams.get("hotel");
  const roomTypeParam = urlParams.get("room_type");

  // Check if this is a room type details page (new structure)
  if (roomTypeParam) {
    // Room type details page - elements are already set in the view
    const roomTypeNameEl = document.getElementById("roomTypeName");
    const resortLocationEl = document.getElementById("resortLocation");
    
    // Update title if needed
    if (roomTypeNameEl) {
      document.title = `${roomTypeNameEl.textContent} - Fiesta Resort`;
    }
    
    return; // Exit early, no need to process hotel data
  }

  // Legacy hotel details page (for backward compatibility)
  let hotel = null;
  if (hotelParam) {
    const hotelKey = hotelParam.toLowerCase().replace(/\s+/g, "-");
    hotel = hotelsData[hotelKey];
  }

  // Use hotel from data or default
  const hotelName = hotel?.name || hotelParam || "Fiesta Resort";
  const hotelLocation = hotel?.location || "Brgy. Ipil, Surigao City";

  // Try both old and new element IDs for backward compatibility
  const hotelNameEl = document.getElementById("hotelName") || document.getElementById("roomTypeName");
  const hotelLocationEl = document.getElementById("hotelLocation") || document.getElementById("resortLocation");
  const mainImage = document.getElementById("mainImage");
  const secondaryImage = document.getElementById("secondaryImage");

  if (hotelNameEl) {
    hotelNameEl.textContent = hotelName;
  }
  if (hotelLocationEl) {
    hotelLocationEl.textContent = hotelLocation;
  }

  if (mainImage && hotel?.mainImage) {
    mainImage.src = hotel.mainImage;
    mainImage.alt = `${hotelName} - Main View`;
  }

  if (secondaryImage && hotel?.secondaryImage) {
    secondaryImage.src = hotel.secondaryImage;
    secondaryImage.alt = `${hotelName} - Secondary View`;
  }

  document.title = `${hotelName} - Fiesta Resort`;
}

// Update UI based on login state (hotel details are public)
function checkAuthentication() {
  const isLoggedIn = window.laravelAuth?.isAuthenticated || localStorage.getItem("isLoggedIn") === "true";
  const userRole = window.laravelAuth?.user?.role || localStorage.getItem("userRole");
  const userName = window.laravelAuth?.user?.name || localStorage.getItem("userName") || "User";

  // Prevent admins from accessing client pages
  if (isLoggedIn && userRole === 'admin') {
    // Don't redirect on hotel details page, just hide the become owner section
  }

  const loginBtn = document.getElementById("loginBtn");
  const userMenu = document.getElementById("userMenu");
  const userNameSpan = document.getElementById("userName");
  const becomeOwnerSection = document.querySelector(".become-owner-section");

  if (isLoggedIn) {
    if (loginBtn) loginBtn.style.display = "none";
    if (becomeOwnerSection) becomeOwnerSection.style.display = "none";
    if (userMenu) userMenu.style.display = "flex";
    if (userNameSpan) userNameSpan.textContent = userName;
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (becomeOwnerSection) becomeOwnerSection.style.display = "block";
    if (userMenu) userMenu.style.display = "none";
  }
}

const userMenuBtn = document.getElementById("userMenuBtn");
const userDropdown = document.getElementById("userDropdown");

if (userMenuBtn && userDropdown) {
  userMenuBtn.addEventListener("click", () => {
    userDropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove("show");
    }
  });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    
    // If using Laravel auth, submit logout form
    if (window.laravelAuth?.isAuthenticated) {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = window.laravelAuth.logoutUrl || "/logout";
      
      const csrfToken = document.createElement("input");
      csrfToken.type = "hidden";
      csrfToken.name = "_token";
      csrfToken.value = window.laravelAuth.csrfToken || "";
      form.appendChild(csrfToken);
      
      document.body.appendChild(form);
      form.submit();
      return;
    }
    
    // Otherwise, clear localStorage (for dummy users)
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    window.location.reload();
  });
}

// Room card navigation handled by HTML links - no JS routing needed
