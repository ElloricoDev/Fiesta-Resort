const settingsContainer = document.getElementById("settingsContainer");

if (settingsContainer) {
  const hotelNameInput = document.getElementById("hotelName");
  const addressInput = document.getElementById("address");
  const zipCodeInput = document.getElementById("zipCode");
  const timezoneSelect = document.getElementById("timezone");
  const languageSelect = document.getElementById("language");
  const dateFormatSelect = document.getElementById("dateFormat");
  const editBtn = document.getElementById("editBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");

  // API base URL
  const apiBaseUrl = "/admin/api/settings";

  // Get CSRF token from meta tag
  function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute("content") : "";
  }

  let originalSettings = {};

  // Load settings from API
  async function loadSettings() {
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
        throw new Error("Failed to fetch settings");
      }

      const result = await response.json();
      const settings = result.data;

      hotelNameInput.value = settings.hotel_name || "";
      addressInput.value = settings.address || "";
      zipCodeInput.value = settings.zip_code || "";
      timezoneSelect.value = settings.timezone || "pst";
      languageSelect.value = settings.language || "english";
      dateFormatSelect.value = settings.date_format || "yyyy-mm-dd";

      originalSettings = { ...settings };
    } catch (error) {
      console.error("Error loading settings:", error);
      if (window.showError) {
        window.showError("Failed to load settings. Please refresh the page.");
      }
    }
  }

  // Save settings via API
  async function saveSettings() {
    const settings = {
      hotel_name: hotelNameInput.value.trim(),
      address: addressInput.value.trim(),
      zip_code: zipCodeInput.value.trim(),
      timezone: timezoneSelect.value,
      language: languageSelect.value,
      date_format: dateFormatSelect.value,
    };

    if (!settings.hotel_name) {
      if (window.showError) window.showError("Hotel name is required.");
      return false;
    }

    if (!settings.address) {
      if (window.showError) window.showError("Address is required.");
      return false;
    }

    if (!settings.zip_code) {
      if (window.showError) window.showError("ZIP code is required.");
      return false;
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
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save settings");
      }

      originalSettings = { ...settings };
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      if (window.showError) {
        window.showError(error.message || "Failed to save settings. Please try again.");
      }
      return false;
    }
  }

  function enableEditMode() {
    settingsContainer.classList.add("edit-mode");
    hotelNameInput.disabled = false;
    addressInput.disabled = false;
    zipCodeInput.disabled = false;
    timezoneSelect.disabled = false;
    languageSelect.disabled = false;
    dateFormatSelect.disabled = false;
  }

  function disableEditMode() {
    settingsContainer.classList.remove("edit-mode");
    hotelNameInput.disabled = true;
    addressInput.disabled = true;
    zipCodeInput.disabled = true;
    timezoneSelect.disabled = true;
    languageSelect.disabled = true;
    dateFormatSelect.disabled = true;
  }

  function restoreSettings() {
    hotelNameInput.value = originalSettings.hotel_name || "";
    addressInput.value = originalSettings.address || "";
    zipCodeInput.value = originalSettings.zip_code || "";
    timezoneSelect.value = originalSettings.timezone || "pst";
    languageSelect.value = originalSettings.language || "english";
    dateFormatSelect.value = originalSettings.date_format || "yyyy-mm-dd";
  }

  editBtn.addEventListener("click", () => {
    enableEditMode();
  });

  const cancelModal = document.getElementById("cancelSettingsModal");
  const cancelModalConfirmBtn = document.getElementById("cancelSettingsModalConfirmBtn");
  const cancelModalCancelBtn = document.getElementById("cancelSettingsModalCancelBtn");

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
      restoreSettings();
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
    const saved = await saveSettings();
    if (saved) {
      disableEditMode();
      if (window.showSuccess) window.showSuccess("Settings saved successfully!");
    }
  });

  window.addEventListener("beforeunload", (event) => {
    if (settingsContainer.classList.contains("edit-mode")) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  // Load settings on page load
  loadSettings();
}
