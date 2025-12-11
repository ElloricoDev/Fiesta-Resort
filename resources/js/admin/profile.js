const profileContainer = document.getElementById("profileContainer");

if (profileContainer) {
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneNumberInput = document.getElementById("phoneNumber");
  const countryCodeSelect = document.getElementById("countryCode");
  const addressInput = document.getElementById("address");
  const currentPasswordInput = document.getElementById("currentPassword");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const editBtn = document.getElementById("editBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");

  // API base URL
  const apiBaseUrl = "/admin/api/profile";

  // Get CSRF token from meta tag
  function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute("content") : "";
  }

  let originalProfile = {};

  // Load profile from API
  async function loadProfile() {
    try {
      const response = await fetch(apiBaseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const result = await response.json();
      const profile = result.data;

      fullNameInput.value = profile.name || "";
      emailInput.value = profile.email || "";
      phoneNumberInput.value = profile.phone || "";
      countryCodeSelect.value = profile.country_code || "+63";
      addressInput.value = profile.address || "";
      originalProfile = { ...profile };
    } catch (error) {
      console.error("Error loading profile:", error);
      if (window.showError) {
        window.showError("Failed to load profile. Please refresh the page.");
      }
    }
  }

  // Save profile via API
  async function saveProfile() {
    const profile = {
      name: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneNumberInput.value.trim(),
      country_code: countryCodeSelect.value,
      address: addressInput.value.trim(),
    };

    if (!profile.name) {
      if (window.showError) window.showError("Full name is required.");
      return false;
    }

    if (!profile.email) {
      if (window.showError) window.showError("Email address is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      if (window.showError) window.showError("Please enter a valid email address.");
      return false;
    }

    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Add password fields if any password field is filled
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        if (window.showError) window.showError("Please fill in all password fields to change your password.");
        return false;
      }

      if (newPassword.length < 6) {
        if (window.showError) window.showError("New password must be at least 6 characters.");
        return false;
      }

      if (newPassword !== confirmPassword) {
        if (window.showError) window.showError("New password and confirm password do not match.");
        return false;
      }

      profile.current_password = currentPassword;
      profile.new_password = newPassword;
      profile.confirm_password = confirmPassword;
    }

    try {
      const response = await fetch(apiBaseUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": getCsrfToken(),
        },
        body: JSON.stringify(profile),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save profile");
      }

      // Update original profile
      originalProfile = {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        country_code: result.data.country_code,
        address: result.data.address,
      };

      // Clear password fields
      currentPasswordInput.value = "";
      newPasswordInput.value = "";
      confirmPasswordInput.value = "";

      return true;
    } catch (error) {
      console.error("Error saving profile:", error);
      if (window.showError) {
        window.showError(error.message || "Failed to save profile. Please try again.");
      }
      return false;
    }
  }

  function enableEditMode() {
    profileContainer.classList.add("edit-mode");
    fullNameInput.disabled = false;
    emailInput.disabled = false;
    phoneNumberInput.disabled = false;
    countryCodeSelect.disabled = false;
    addressInput.disabled = false;
  }

  function disableEditMode() {
    profileContainer.classList.remove("edit-mode");
    fullNameInput.disabled = true;
    emailInput.disabled = true;
    phoneNumberInput.disabled = true;
    countryCodeSelect.disabled = true;
    addressInput.disabled = true;
    currentPasswordInput.value = "";
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
  }

  function restoreProfile() {
    fullNameInput.value = originalProfile.name || "";
    emailInput.value = originalProfile.email || "";
    phoneNumberInput.value = originalProfile.phone || "";
    countryCodeSelect.value = originalProfile.country_code || "+63";
    addressInput.value = originalProfile.address || "";
    currentPasswordInput.value = "";
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
  }

  editBtn.addEventListener("click", () => {
    enableEditMode();
  });

  const cancelModal = document.getElementById("cancelProfileModal");
  const cancelModalConfirmBtn = document.getElementById("cancelProfileModalConfirmBtn");
  const cancelModalCancelBtn = document.getElementById("cancelProfileModalCancelBtn");

  function showCancelModal() {
    if (cancelModal) {
      cancelModal.classList.add("show");
    }
  }

  function hideCancelModal() {
    if (cancelModal) {
      cancelModal.classList.remove("show");
    }
  }

  if (cancelModalConfirmBtn) {
    cancelModalConfirmBtn.addEventListener("click", () => {
      restoreProfile();
      disableEditMode();
      hideCancelModal();
    });
  }

  if (cancelModalCancelBtn) {
    cancelModalCancelBtn.addEventListener("click", hideCancelModal);
  }

  if (cancelModal) {
    cancelModal.addEventListener("click", (event) => {
      if (event.target === cancelModal) {
        hideCancelModal();
      }
    });
  }

  cancelBtn.addEventListener("click", () => {
    showCancelModal();
  });

  saveBtn.addEventListener("click", async () => {
    const saved = await saveProfile();
    if (saved) {
      disableEditMode();
      if (window.showSuccess) window.showSuccess("Profile updated successfully!");
    }
  });

  window.addEventListener("beforeunload", (event) => {
    if (profileContainer.classList.contains("edit-mode")) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  // Load profile on page load
  loadProfile();
}
