// My Profile Page functionality

document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    // Navigation handled by HTML - redirect via meta or link
    const loginLink = document.createElement("a");
    loginLink.href = "/login";
    document.body.appendChild(loginLink);
    loginLink.click();
    document.body.removeChild(loginLink);
    return;
  }

  // Initialize profile data
  loadProfileData();
  setupTabNavigation();
  setupForms();
  loadBookingStats();
  loadRecentBookings();
  loadPreferences();
});

// Load profile data from localStorage
function loadProfileData() {
  const userEmail = localStorage.getItem("userEmail") || "";
  const savedProfile = localStorage.getItem("userProfile");
  
  const profile = savedProfile
    ? JSON.parse(savedProfile)
    : {
        firstName: "",
        lastName: "",
        email: userEmail,
        phone: "",
        dateOfBirth: "",
        address: "",
        city: "",
        country: "",
      };

  // Update header
  const profileNameEl = document.getElementById("profileName");
  const profileEmailEl = document.getElementById("profileEmail");
  
  if (profileNameEl) {
    const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || 
                     userEmail.split("@")[0] || "User";
    profileNameEl.textContent = fullName;
  }
  
  if (profileEmailEl) {
    profileEmailEl.textContent = profile.email || userEmail;
  }

  // Populate personal info form
  const firstNameEl = document.getElementById("firstName");
  const lastNameEl = document.getElementById("lastName");
  const emailEl = document.getElementById("email");
  const phoneEl = document.getElementById("phone");
  const dateOfBirthEl = document.getElementById("dateOfBirth");
  const addressEl = document.getElementById("address");
  const cityEl = document.getElementById("city");
  const countryEl = document.getElementById("country");

  if (firstNameEl) firstNameEl.value = profile.firstName || "";
  if (lastNameEl) lastNameEl.value = profile.lastName || "";
  if (emailEl) emailEl.value = profile.email || userEmail;
  if (phoneEl) phoneEl.value = profile.phone || "";
  if (dateOfBirthEl) dateOfBirthEl.value = profile.dateOfBirth || "";
  if (addressEl) addressEl.value = profile.address || "";
  if (cityEl) cityEl.value = profile.city || "";
  if (countryEl) countryEl.value = profile.country || "";
}

// Setup tab navigation
function setupTabNavigation() {
  const navItems = document.querySelectorAll(".profile-nav-item");
  const tabs = document.querySelectorAll(".profile-tab");

  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Remove active class from all nav items and tabs
      navItems.forEach((nav) => nav.classList.remove("active"));
      tabs.forEach((tab) => tab.classList.remove("active"));

      // Add active class to clicked nav item and corresponding tab
      this.classList.add("active");
      const targetTabEl = document.getElementById(`${targetTab}-tab`);
      if (targetTabEl) {
        targetTabEl.classList.add("active");
      }
    });
  });

  // Make switchTab function available globally
  window.switchTab = function (tabName) {
    const navItem = document.querySelector(`[data-tab="${tabName}"]`);
    if (navItem) {
      navItem.click();
    }
  };
}

// Setup form handlers
function setupForms() {
  // Personal info form
  const personalInfoForm = document.getElementById("personalInfoForm");
  if (personalInfoForm) {
    personalInfoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      savePersonalInfo();
    });
  }

  // Password form
  const passwordForm = document.getElementById("passwordForm");
  if (passwordForm) {
    passwordForm.addEventListener("submit", function (e) {
      e.preventDefault();
      changePassword();
    });
  }

  // Make resetForm available globally
  window.resetForm = function () {
    loadProfileData();
    switchTab("overview");
  };
}

// Save personal information
function savePersonalInfo() {
  const firstName = document.getElementById("firstName")?.value.trim() || "";
  const lastName = document.getElementById("lastName")?.value.trim() || "";
  const email = document.getElementById("email")?.value.trim() || "";
  const phone = document.getElementById("phone")?.value.trim() || "";
  const dateOfBirth = document.getElementById("dateOfBirth")?.value || "";
  const address = document.getElementById("address")?.value.trim() || "";
  const city = document.getElementById("city")?.value.trim() || "";
  const country = document.getElementById("country")?.value.trim() || "";

  if (!firstName || !lastName) {
    alert("First name and last name are required.");
    return;
  }

  if (!email) {
    alert("Email address is required.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  const profile = {
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    address,
    city,
    country,
  };

  localStorage.setItem("userProfile", JSON.stringify(profile));
  
  // Update header
  const profileNameEl = document.getElementById("profileName");
  if (profileNameEl) {
    profileNameEl.textContent = `${firstName} ${lastName}`.trim();
  }

  alert("Profile updated successfully!");
  switchTab("overview");
}

// Change password
function changePassword() {
  const currentPassword = document.getElementById("currentPassword")?.value || "";
  const newPassword = document.getElementById("newPassword")?.value || "";
  const confirmPassword = document.getElementById("confirmPassword")?.value || "";

  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("Please fill in all password fields.");
    return;
  }

  if (newPassword.length < 6) {
    alert("New password must be at least 6 characters.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("New password and confirm password do not match.");
    return;
  }

  // In a real app, this would make an API call
  alert("Password changed successfully!");
  
  // Clear password fields
  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";
}

// Load booking statistics
function loadBookingStats() {
  const bookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
  
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(
    (b) => b.status === "completed"
  ).length;
  const upcomingBookings = bookings.filter(
    (b) => b.status === "upcoming" || b.status === "confirmed"
  ).length;
  const totalSpent = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (parseFloat(b.totalPrice) || 0), 0);

  const totalBookingsEl = document.getElementById("totalBookings");
  const completedBookingsEl = document.getElementById("completedBookings");
  const upcomingBookingsEl = document.getElementById("upcomingBookings");
  const totalSpentEl = document.getElementById("totalSpent");

  if (totalBookingsEl) totalBookingsEl.textContent = totalBookings;
  if (completedBookingsEl) completedBookingsEl.textContent = completedBookings;
  if (upcomingBookingsEl) upcomingBookingsEl.textContent = upcomingBookings;
  if (totalSpentEl) totalSpentEl.textContent = `$${totalSpent.toFixed(2)}`;
}

// Load recent bookings
function loadRecentBookings() {
  const bookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
  const recentBookings = bookings.slice(0, 5);
  const recentBookingsList = document.getElementById("recentBookingsList");

  if (!recentBookingsList) return;

  if (recentBookings.length === 0) {
    recentBookingsList.innerHTML = '<p class="empty-message">No recent bookings</p>';
    return;
  }

  recentBookingsList.innerHTML = recentBookings
    .map((booking) => {
      const checkIn = new Date(booking.checkIn).toLocaleDateString();
      const checkOut = new Date(booking.checkOut).toLocaleDateString();
      return `
        <div class="activity-item">
          <div class="activity-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div class="activity-info">
            <h4>${booking.hotel || booking.room?.title || "Booking"}</h4>
            <p>${checkIn} - ${checkOut}</p>
          </div>
          <div class="activity-status">
            <span class="status-badge status-${booking.status}">${booking.status}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

// Load preferences
function loadPreferences() {
  const preferences = JSON.parse(
    localStorage.getItem("userPreferences") || "{}"
  );

  const emailNotifications = document.getElementById("emailNotifications");
  const promotionalEmails = document.getElementById("promotionalEmails");
  const bookingReminders = document.getElementById("bookingReminders");
  const currency = document.getElementById("currency");
  const language = document.getElementById("language");

  if (emailNotifications)
    emailNotifications.checked = preferences.emailNotifications !== false;
  if (promotionalEmails)
    promotionalEmails.checked = preferences.promotionalEmails !== false;
  if (bookingReminders)
    bookingReminders.checked = preferences.bookingReminders !== false;
  if (currency) currency.value = preferences.currency || "USD";
  if (language) language.value = preferences.language || "en";
}

// Save preferences
window.savePreferences = function () {
  const preferences = {
    emailNotifications: document.getElementById("emailNotifications")?.checked || false,
    promotionalEmails: document.getElementById("promotionalEmails")?.checked || false,
    bookingReminders: document.getElementById("bookingReminders")?.checked || false,
    currency: document.getElementById("currency")?.value || "USD",
    language: document.getElementById("language")?.value || "en",
  };

  localStorage.setItem("userPreferences", JSON.stringify(preferences));
  alert("Preferences saved successfully!");
};

// Update last login time
function updateLastLogin() {
  const lastLogin = localStorage.getItem("lastLogin");
  const lastLoginEl = document.getElementById("lastLogin");
  
  if (lastLoginEl) {
    if (lastLogin) {
      const date = new Date(lastLogin);
      lastLoginEl.textContent = date.toLocaleString();
    } else {
      lastLoginEl.textContent = "Just now";
    }
  }
}

updateLastLogin();

