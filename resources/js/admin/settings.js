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

  const defaultSettings = {
    hotelName: "Fiesta Resort",
    address: "Sitio Dacuman, Barangay Ipil, Surigao City, 8400, PH",
    zipCode: "8400",
    timezone: "pst",
    language: "english",
    dateFormat: "yyyy-mm-dd",
  };

  let originalSettings = {};

  function loadSettings() {
    const savedSettings = localStorage.getItem("hotelSettings");
    const settings = savedSettings
      ? JSON.parse(savedSettings)
      : defaultSettings;

    hotelNameInput.value = settings.hotelName;
    addressInput.value = settings.address;
    zipCodeInput.value = settings.zipCode;
    timezoneSelect.value = settings.timezone;
    languageSelect.value = settings.language;
    dateFormatSelect.value = settings.dateFormat;
    originalSettings = { ...settings };
  }

  function saveSettings() {
    const settings = {
      hotelName: hotelNameInput.value.trim(),
      address: addressInput.value.trim(),
      zipCode: zipCodeInput.value.trim(),
      timezone: timezoneSelect.value,
      language: languageSelect.value,
      dateFormat: dateFormatSelect.value,
    };

    if (!settings.hotelName) {
      alert("Hotel name is required.");
      return false;
    }

    if (!settings.address) {
      alert("Address is required.");
      return false;
    }

    if (!settings.zipCode) {
      alert("ZIP code is required.");
      return false;
    }

    localStorage.setItem("hotelSettings", JSON.stringify(settings));
    originalSettings = { ...settings };
    return true;
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
    hotelNameInput.value = originalSettings.hotelName;
    addressInput.value = originalSettings.address;
    zipCodeInput.value = originalSettings.zipCode;
    timezoneSelect.value = originalSettings.timezone;
    languageSelect.value = originalSettings.language;
    dateFormatSelect.value = originalSettings.dateFormat;
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
      restoreSettings();
      disableEditMode();
    }
  });

  saveBtn.addEventListener("click", () => {
    if (saveSettings()) {
      disableEditMode();
      alert("Settings saved successfully!");
    }
  });

  window.addEventListener("beforeunload", (event) => {
    if (settingsContainer.classList.contains("edit-mode")) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  loadSettings();
}

