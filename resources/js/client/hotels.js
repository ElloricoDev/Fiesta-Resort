// Direct URLs - no routes object needed

document.addEventListener("DOMContentLoaded", function () {
  const priceFilter = document.getElementById("priceFilter");
  const sortFilter = document.getElementById("sortFilter");
  const resetFiltersBtn = document.getElementById("resetFilters");
  const roomsCount = document.getElementById("roomsCount") || document.getElementById("hotelsCount");
  const roomCards = Array.from(document.querySelectorAll(".hotel-card"));

  // Check authentication
  checkAuthentication();

  // Apply filters from URL parameters
  applyUrlFilters();

  if (priceFilter) {
    priceFilter.addEventListener("change", applyFilters);
  }
  if (sortFilter) {
    sortFilter.addEventListener("change", applyFilters);
  }
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", resetFilters);
  }

  function checkAuthentication() {
    const isLoggedIn = window.laravelAuth?.isAuthenticated || localStorage.getItem("isLoggedIn") === "true";
    const userRole = window.laravelAuth?.user?.role || localStorage.getItem("userRole");

    // Prevent admins from accessing client pages
    if (isLoggedIn && userRole === 'admin') {
      if (window.showError) window.showError("Admins cannot access client pages. Redirecting to admin dashboard...");
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 1000);
      return;
    }
  }

  function applyUrlFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const checkIn = urlParams.get("check_in");
    const checkOut = urlParams.get("check_out");

    // Apply filters if URL parameters exist
    if (checkIn || checkOut) {
      applyFilters();
    }
  }

  function applyFilters() {
    if (!priceFilter || !sortFilter) return;

    const selectedPriceRange = priceFilter.value;
    const selectedSort = sortFilter.value;

    let visibleCount = 0;

    roomCards.forEach((card) => {
      const price = parseInt(card.getAttribute("data-price"), 10);

      let showCard = true;

      // Price filter
      if (selectedPriceRange && showCard) {
        if (selectedPriceRange === "0-2000" && (price < 0 || price > 2000)) {
          showCard = false;
        } else if (selectedPriceRange === "2000-3000" && (price < 2000 || price > 3000)) {
          showCard = false;
        } else if (selectedPriceRange === "3000-4000" && (price < 3000 || price > 4000)) {
          showCard = false;
        } else if (selectedPriceRange === "4000+" && price < 4000) {
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

    if (roomsCount) {
      roomsCount.textContent = visibleCount;
    }
    applySorting(selectedSort);
  }

  function applySorting(sortType) {
    const roomsGrid = document.querySelector(".hotels-grid");
    if (!roomsGrid) return;

    const visibleCards = roomCards.filter((card) => !card.classList.contains("hidden"));

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
      case "featured":
      default:
        sortedCards = visibleCards;
        break;
    }

    sortedCards.forEach((card) => {
      roomsGrid.appendChild(card);
    });
  }

  function resetFilters() {
    if (priceFilter) priceFilter.value = "";
    if (sortFilter) sortFilter.value = "featured";

    roomCards.forEach((card) => {
      card.classList.remove("hidden");
    });

    if (roomsCount) {
      roomsCount.textContent = roomCards.length;
    }

    const roomsGrid = document.querySelector(".hotels-grid");
    if (roomsGrid) {
      roomCards.forEach((card) => {
        roomsGrid.appendChild(card);
      });
    }

    // Clear URL parameters
    const url = new URL(window.location);
    url.searchParams.delete("check_in");
    url.searchParams.delete("check_out");
    url.searchParams.delete("persons");
    window.history.replaceState({}, "", url);
  }

  // Book Now buttons are now links, so we don't need the click handler
  // But we can add hover effects
  document.querySelectorAll(".hotel-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.3s ease";
    });
  });
});
