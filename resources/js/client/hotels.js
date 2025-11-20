// Direct URLs - no routes object needed

document.addEventListener("DOMContentLoaded", function () {
  const locationFilter = document.getElementById("locationFilter");
  const priceFilter = document.getElementById("priceFilter");
  const sortFilter = document.getElementById("sortFilter");
  const resetFiltersBtn = document.getElementById("resetFilters");
  const hotelsCount = document.getElementById("hotelsCount");
  const hotelCards = Array.from(document.querySelectorAll(".hotel-card"));

  locationFilter.addEventListener("change", applyFilters);
  priceFilter.addEventListener("change", applyFilters);
  sortFilter.addEventListener("change", applyFilters);
  resetFiltersBtn.addEventListener("click", resetFilters);

  function applyFilters() {
    const selectedLocation = locationFilter.value.toLowerCase();
    const selectedPriceRange = priceFilter.value;
    const selectedSort = sortFilter.value;

    let visibleCount = 0;

    hotelCards.forEach((card) => {
      const location = card.getAttribute("data-location");
      const price = parseInt(card.getAttribute("data-price"), 10);

      let showCard = true;

      if (selectedLocation && location !== selectedLocation) {
        showCard = false;
      }

      if (selectedPriceRange) {
        if (selectedPriceRange === "0-50" && (price < 0 || price > 50)) {
          showCard = false;
        } else if (selectedPriceRange === "50-100" && (price < 50 || price > 100)) {
          showCard = false;
        } else if (selectedPriceRange === "100-500" && (price < 100 || price > 500)) {
          showCard = false;
        } else if (selectedPriceRange === "500+" && price < 500) {
          showCard = false;
        }
      }

      if (showCard) {
        card.classList.remove("hidden");
        visibleCount++;
      } else {
        card.classList.add("hidden");
      }
    });

    hotelsCount.textContent = visibleCount;
    applySorting(selectedSort);
  }

  function applySorting(sortType) {
    const hotelsGrid = document.querySelector(".hotels-grid");
    const visibleCards = hotelCards.filter((card) => !card.classList.contains("hidden"));

    let sortedCards = [...visibleCards];

    switch (sortType) {
      case "price-low":
        sortedCards.sort(
          (a, b) => parseInt(a.getAttribute("data-price"), 10) - parseInt(b.getAttribute("data-price"), 10)
        );
        break;
      case "price-high":
        sortedCards.sort(
          (a, b) => parseInt(b.getAttribute("data-price"), 10) - parseInt(a.getAttribute("data-price"), 10)
        );
        break;
      case "rating":
        sortedCards.sort((a, b) => {
          const ratingA = parseFloat(a.querySelector(".card-rating span").textContent);
          const ratingB = parseFloat(b.querySelector(".card-rating span").textContent);
          return ratingB - ratingA;
        });
        break;
      case "featured":
      default:
        sortedCards = visibleCards;
        break;
    }

    sortedCards.forEach((card) => {
      hotelsGrid.appendChild(card);
    });
  }

  function resetFilters() {
    locationFilter.value = "";
    priceFilter.value = "";
    sortFilter.value = "featured";

    hotelCards.forEach((card) => {
      card.classList.remove("hidden");
    });

    hotelsCount.textContent = hotelCards.length;

    const hotelsGrid = document.querySelector(".hotels-grid");
    hotelCards.forEach((card) => {
      hotelsGrid.appendChild(card);
    });
  }

  const bookButtons = document.querySelectorAll(".book-now-btn");
  bookButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const hotelCard = this.closest(".hotel-card");
      const hotelName = hotelCard.querySelector(".card-title").textContent;
      const hotelPrice = hotelCard.querySelector(".card-price").textContent;

      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (!isLoggedIn) {
        alert("Please login to book a hotel");
        // Navigation handled by HTML - redirect to login
        const loginLink = document.createElement("a");
        loginLink.href = "/login";
        document.body.appendChild(loginLink);
        loginLink.click();
        document.body.removeChild(loginLink);
      } else {
        alert(`Booking ${hotelName} at ${hotelPrice}. This feature will be implemented soon!`);
      }
    });
  });

  document.querySelectorAll(".hotel-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.3s ease";
    });
  });
});

