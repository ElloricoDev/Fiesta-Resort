// Direct URLs and asset paths
const fallbackImage = "/assets/FiestaResort1.jpg";

document.addEventListener("DOMContentLoaded", function () {
  checkAuthentication();
  loadBookingData();
  initializeDatePicker();
  setupEventListeners();
});

function checkAuthentication() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    alert("Please login to continue with booking");
    sessionStorage.setItem("redirectAfterLogin", window.location.href);
    // Navigation handled by HTML - redirect via meta or let user navigate
    const loginLink = document.createElement("a");
    loginLink.href = "/login";
    loginLink.click();
  }
}

function loadBookingData() {
  const bookingData = JSON.parse(sessionStorage.getItem("pendingBooking"));

  if (!bookingData) {
    alert("No booking information found. Please go to home page.");
    // Navigation handled by HTML links
    return;
  }

  document.getElementById("hotelPreviewName").textContent =
    bookingData.hotel || "Blue Origin Fams";
  document.getElementById("hotelPreviewLocation").textContent =
    bookingData.room?.location || "Galle, Sri Lanka";
  document.getElementById("hotelPreviewImage").src =
    bookingData.room?.image || fallbackImage;

  const pricePerNight = bookingData.room?.price || 200;
  window.bookingPrice = pricePerNight;
  updateTotalPrice();
}

function initializeDatePicker() {
  const dateInput = document.getElementById("dateRange");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const startDate = formatDate(tomorrow);
  const endDate = formatDate(dayAfter);

  dateInput.value = `${startDate} - ${endDate}`;
  window.checkInDate = tomorrow;
  window.checkOutDate = dayAfter;
}

function formatDate(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  return `${day} ${month}`;
}

function updateTotalPrice() {
  const days = parseInt(document.getElementById("daysCount").textContent, 10);
  const pricePerNight = window.bookingPrice || 200;
  const total = days * pricePerNight;

  document.getElementById("totalPrice").textContent = total.toLocaleString();
  document.getElementById("priceDays").textContent = `${days} Days`;

  window.totalAmount = total;
  window.numberOfDays = days;
}

function setupEventListeners() {
  document.getElementById("decreaseDays").addEventListener("click", () => {
    const daysElement = document.getElementById("daysCount");
    let days = parseInt(daysElement.textContent, 10);
    if (days > 1) {
      days--;
      daysElement.textContent = days;
      updateDateRange(days);
      updateTotalPrice();
    }
  });

  document.getElementById("increaseDays").addEventListener("click", () => {
    const daysElement = document.getElementById("daysCount");
    let days = parseInt(daysElement.textContent, 10);
    if (days < 30) {
      days++;
      daysElement.textContent = days;
      updateDateRange(days);
      updateTotalPrice();
    }
  });

  document
    .getElementById("continueToPayment")
    .addEventListener("click", () => {
      goToStep(2);
      updatePaymentInfo();
    });

  const cancelBtn = document.getElementById("cancelBooking");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to cancel this booking?")) {
        sessionStorage.removeItem("pendingBooking");
        // Navigation handled by HTML - convert button to link or reload
        window.location.reload();
      }
    });
  }

  document.getElementById("backToBooking").addEventListener("click", () => {
    goToStep(1);
  });

  document.getElementById("completePayment").addEventListener("click", () => {
    if (validatePaymentForm()) {
      processPayment();
    }
  });
}

function updateDateRange(days) {
  const startDate = window.checkInDate || new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);

  window.checkOutDate = endDate;

  const dateInput = document.getElementById("dateRange");
  dateInput.value = `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function goToStep(stepNumber) {
  document.querySelectorAll(".booking-step").forEach((step) => {
    step.classList.add("hidden");
  });

  document.getElementById(`step${stepNumber}`).classList.remove("hidden");
  updateProgress(stepNumber);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress(currentStep) {
  const steps = document.querySelectorAll(".progress-step");
  const lines = document.querySelectorAll(".progress-line");

  steps.forEach((step, index) => {
    const stepNum = index + 1;
    if (stepNum < currentStep) {
      step.classList.add("completed");
      step.classList.remove("active");
    } else if (stepNum === currentStep) {
      step.classList.add("active");
      step.classList.remove("completed");
    } else {
      step.classList.remove("active", "completed");
    }
  });

  lines.forEach((line, index) => {
    if (index + 1 < currentStep) {
      line.classList.add("completed");
    } else {
      line.classList.remove("completed");
    }
  });
}

function updatePaymentInfo() {
  const bookingData = JSON.parse(sessionStorage.getItem("pendingBooking"));
  const days = window.numberOfDays || 2;
  const total = window.totalAmount || 1000;
  const initial = Math.floor(total * 0.75);

  document.getElementById("paymentDays").textContent = days;
  document.getElementById("paymentHotel").textContent =
    bookingData.hotel || "Blue Origin Fams";
  document.getElementById("paymentLocation").textContent =
    bookingData.room?.location || "Galle, Sri Lanka";
  document.getElementById("paymentTotal").textContent = total;
  document.getElementById("paymentInitial").textContent = initial;
}

function validatePaymentForm() {
  const gcashNumber = document.getElementById("gcashNumber").value;
  const bankName = document.getElementById("bankName").value;
  const validationDate = document.getElementById("validationDate").value;

  if (!gcashNumber) {
    alert("Please enter your GCASH number");
    return false;
  }

  if (!bankName) {
    alert("Please select a bank");
    return false;
  }

  if (!validationDate) {
    alert("Please select a validation date");
    return false;
  }

  if (gcashNumber.length < 11) {
    alert("Please enter a valid GCASH number (11 digits)");
    return false;
  }

  return true;
}

function processPayment() {
  const payBtn = document.getElementById("completePayment");
  const originalText = payBtn.textContent;
  payBtn.textContent = "Processing...";
  payBtn.disabled = true;

  setTimeout(() => {
    saveCompletedBooking();
    goToStep(3);
    payBtn.textContent = originalText;
    payBtn.disabled = false;
    sessionStorage.removeItem("pendingBooking");
  }, 2000);
}

function saveCompletedBooking() {
  const bookingData = JSON.parse(sessionStorage.getItem("pendingBooking")) || {};
  const userName = localStorage.getItem("userName") || "Guest";

  const completedBooking = {
    id: Date.now(),
    user: userName,
    hotel: bookingData.hotel,
    room: bookingData.room?.title,
    checkIn: window.checkInDate,
    checkOut: window.checkOutDate,
    days: window.numberOfDays,
    total: window.totalAmount,
    paymentMethod: document.getElementById("bankName").value,
    bookingDate: new Date().toISOString(),
    status: "confirmed",
  };

  let bookings = JSON.parse(localStorage.getItem("myBookings")) || [];
  bookings.push(completedBooking);
  localStorage.setItem("myBookings", JSON.stringify(bookings));
}

updateProgress(1);

