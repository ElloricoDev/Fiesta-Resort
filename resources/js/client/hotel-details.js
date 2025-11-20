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

const hotelsData = {
  "blue-origin-farms": {
    name: "Blue Origin Farms",
    location: "Galle, Sri Lanka",
    mainImage: getAsset("resort1"),
    secondaryImage: getAsset("resort5"),
  },
  "ocean-land": {
    name: "Ocean Land",
    location: "Trincomalee, Sri Lanka",
    mainImage: getAsset("resort2"),
    secondaryImage: getAsset("resort4"),
  },
  "stark-house": {
    name: "Stark House",
    location: "Dehiwala, Sri Lanka",
    mainImage: getAsset("resort3"),
    secondaryImage: getAsset("resort5"),
  },
  "vinna-vill": {
    name: "Vinna Vill",
    location: "Beruwala, Sri Lanka",
    mainImage: getAsset("resort4"),
    secondaryImage: getAsset("resort2"),
  },
  babox: {
    name: "Babox",
    location: "Kandy, Sri Lanka",
    mainImage: getAsset("resort5"),
    secondaryImage: getAsset("resort3"),
  },
};

window.addEventListener("DOMContentLoaded", () => {
  loadHotelDetails();
  // Hotel details are public - just update UI based on login state
  checkAuthentication();
});

function loadHotelDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const hotelId = urlParams.get("hotel");

  if (hotelId && hotelsData[hotelId]) {
    const hotel = hotelsData[hotelId];
    document.getElementById("hotelName").textContent = hotel.name;
    document.getElementById("hotelLocation").textContent = hotel.location;

    const mainImage = document.getElementById("mainImage");
    const secondaryImage = document.getElementById("secondaryImage");

    mainImage.src = hotel.mainImage;
    mainImage.alt = `${hotel.name} - Main View`;

    secondaryImage.src = hotel.secondaryImage;
    secondaryImage.alt = `${hotel.name} - Secondary View`;

    document.title = `${hotel.name} - Fiesta Resort`;
  } else {
    const defaultHotel = hotelsData["blue-origin-farms"];
    document.getElementById("hotelName").textContent = defaultHotel.name;
    document.getElementById("hotelLocation").textContent = defaultHotel.location;
  }
}

// Update UI based on login state (hotel details are public)
function checkAuthentication() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userName = localStorage.getItem("userName") || "User";

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
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    // Navigation handled by HTML links - logout button should be a link
    window.location.reload();
  });
}

// Room card navigation handled by HTML links - no JS routing needed

