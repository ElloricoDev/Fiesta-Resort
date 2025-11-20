const body = document.body;

// Check if user is admin on page load
document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");
  
  if (!isLoggedIn || userRole !== "admin") {
    alert("Access denied. Admin privileges required.");
    window.location.href = "/";
    return;
  }
});

const notificationBtn = document.getElementById("notificationBtn");
const notificationMenu = document.getElementById("notificationMenu");
const userBtn = document.getElementById("userBtn");
const userMenu = document.getElementById("userMenu");

if (notificationBtn && notificationMenu) {
  notificationBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    notificationMenu.classList.toggle("show");
    if (userMenu) {
      userMenu.classList.remove("show");
    }
  });
}

if (userBtn && userMenu) {
  userBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    userMenu.classList.toggle("show");
    if (notificationMenu) {
      notificationMenu.classList.remove("show");
    }
  });
}

document.addEventListener("click", (event) => {
  if (
    notificationMenu &&
    notificationMenu.classList.contains("show") &&
    !notificationMenu.contains(event.target) &&
    event.target !== notificationBtn
  ) {
    notificationMenu.classList.remove("show");
  }

  if (
    userMenu &&
    userMenu.classList.contains("show") &&
    !userMenu.contains(event.target) &&
    event.target !== userBtn
  ) {
    userMenu.classList.remove("show");
  }
});

const logoutModal = document.getElementById("logoutModal");
const logoutCancelBtn = document.getElementById("logoutModalCancelBtn");
const logoutConfirmBtn = document.getElementById("logoutModalConfirmBtn");
const logoutButtons = document.querySelectorAll("[data-trigger-logout]");

// Function to show logout modal
function showLogoutModal() {
  if (logoutModal) {
    logoutModal.classList.add("show");
    // Close user menu if open
    if (userMenu) {
      userMenu.classList.remove("show");
    }
  }
}

// Function to hide logout modal
function hideLogoutModal() {
  if (logoutModal) {
    logoutModal.classList.remove("show");
  }
}

// Function to perform logout
function performLogout() {
  // Clear localStorage (dummy data authentication)
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  localStorage.removeItem("lastLogin");
  localStorage.removeItem("rememberedEmail");
  localStorage.removeItem("rememberMe");

  // Redirect to login page
  window.location.href = "/login";
}

// Add click handlers to logout buttons
logoutButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    showLogoutModal();
  });
});

// Cancel button handler
if (logoutCancelBtn) {
  logoutCancelBtn.addEventListener("click", () => {
    hideLogoutModal();
  });
}

// Confirm button handler
if (logoutConfirmBtn) {
  logoutConfirmBtn.addEventListener("click", () => {
    performLogout();
  });
}

// Close modal when clicking outside
if (logoutModal) {
  logoutModal.addEventListener("click", (event) => {
    if (event.target === logoutModal) {
      hideLogoutModal();
    }
  });
}

// Close modal on Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && logoutModal && logoutModal.classList.contains("show")) {
    hideLogoutModal();
  }
});

const dropdownItems = document.querySelectorAll(".dropdown-item");

dropdownItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    if (item.tagName === "A") {
      return;
    }

    const id = item.getAttribute("id");
    if (id === "logoutBtn") {
      return;
    }

    const text = item.textContent.trim();

    if (text === "View all notifications") {
      alert("Notifications page will be implemented soon.");
    } else if (text === "Account Preferences") {
      alert("Account preferences page will be implemented soon.");
    } else {
      console.log("Clicked:", text);
    }

    if (notificationMenu) {
      notificationMenu.classList.remove("show");
    }
    if (userMenu) {
      userMenu.classList.remove("show");
    }
  });
});

