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

  let originalProfile = {};

  function loadProfile() {
    const userEmail = localStorage.getItem("userEmail") || "admin@gmail.com";
    const savedProfile = localStorage.getItem("userProfile");
    const profile = savedProfile
      ? JSON.parse(savedProfile)
      : {
          fullName: "Admin Sample Name",
          email: userEmail,
          phoneNumber: "9123438903",
          countryCode: "+63",
          address: "Sitio Dacuman, Barangay Ipil, Surigao City, 8400, PH",
        };

    fullNameInput.value = profile.fullName;
    emailInput.value = profile.email;
    phoneNumberInput.value = profile.phoneNumber;
    countryCodeSelect.value = profile.countryCode;
    addressInput.value = profile.address;
    originalProfile = { ...profile };
  }

  function saveProfile() {
    const profile = {
      fullName: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      phoneNumber: phoneNumberInput.value.trim(),
      countryCode: countryCodeSelect.value,
      address: addressInput.value.trim(),
    };

    if (!profile.fullName) {
      alert("Full name is required.");
      return false;
    }

    if (!profile.email) {
      alert("Email address is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (!profile.phoneNumber) {
      alert("Phone number is required.");
      return false;
    }

    if (!profile.address) {
      alert("Address is required.");
      return false;
    }

    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all password fields to change your password.");
        return false;
      }

      if (newPassword.length < 6) {
        alert("New password must be at least 6 characters.");
        return false;
      }

      if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match.");
        return false;
      }

      profile.password = newPassword;
      alert("Password changed successfully!");
    }

    localStorage.setItem("userProfile", JSON.stringify(profile));
    localStorage.setItem("userEmail", profile.email);
    originalProfile = { ...profile };
    return true;
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
    fullNameInput.value = originalProfile.fullName;
    emailInput.value = originalProfile.email;
    phoneNumberInput.value = originalProfile.phoneNumber;
    countryCodeSelect.value = originalProfile.countryCode;
    addressInput.value = originalProfile.address;
    currentPasswordInput.value = "";
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
  }

  editBtn.addEventListener("click", () => {
    enableEditMode();
  });

  cancelBtn.addEventListener("click", () => {
    if (
      confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      restoreProfile();
      disableEditMode();
    }
  });

  saveBtn.addEventListener("click", () => {
    if (saveProfile()) {
      disableEditMode();
      alert("Profile updated successfully!");
    }
  });

  window.addEventListener("beforeunload", (event) => {
    if (profileContainer.classList.contains("edit-mode")) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  loadProfile();
}

