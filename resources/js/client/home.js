window.addEventListener("DOMContentLoaded", () => {
  // Check Laravel auth first, then fall back to localStorage (for dummy users)
  const isLoggedIn = window.laravelAuth?.isAuthenticated || localStorage.getItem("isLoggedIn") === "true";
  const userEmail = window.laravelAuth?.user?.email || localStorage.getItem("userEmail");
  const userName = window.laravelAuth?.user?.name || localStorage.getItem("userName");
  const userRole = window.laravelAuth?.user?.role || localStorage.getItem("userRole");

  // Prevent admins from accessing client pages (server-side middleware is primary, this is backup)
  if (isLoggedIn && userRole === 'admin') {
    if (window.showError) {
      window.showError("Admins cannot access client pages. Redirecting to admin dashboard...");
    }
    setTimeout(() => {
      window.location.href = "/admin/dashboard";
    }, 1000);
    return;
  }

  updateUIForLoginState(isLoggedIn, userEmail, userRole);
  updateMyBookingsVisibility(isLoggedIn);
  setupSmoothScroll();
  setupUserMenuDropdown();
  setupLogoutHandlers();
  setupSearchHandlers();
  setupNavigationActiveState();
});

function updateMyBookingsVisibility(isLoggedIn) {
  const myBookingsLink = document.getElementById("myBookingsNavLink");
  if (myBookingsLink) {
    myBookingsLink.style.display = isLoggedIn ? "inline-block" : "none";
  }
}

// Rooms link is now handled by setupSmoothScroll via scroll-link class

function updateUIForLoginState(isLoggedIn, userEmail, userRole) {
  const loginBtn = document.getElementById("loginBtn");
  const userMenu = document.getElementById("userMenu");
  const userName = document.getElementById("userName");
  const userDropdown = document.getElementById("userDropdown");

  if (isLoggedIn) {
    if (loginBtn) loginBtn.style.display = "none";
    if (userMenu) userMenu.style.display = "block";

    if (userName) {
      // Use Laravel auth name if available, otherwise use localStorage name, otherwise derive from email
      const name = window.laravelAuth?.user?.name || localStorage.getItem("userName") || (userEmail ? userEmail.split("@")[0] : "User");
      userName.textContent = name;
    }

    if (userRole === "admin" && userDropdown) {
      const adminLinkExists = userDropdown.querySelector('[href*="/admin/dashboard"]');
      if (!adminLinkExists) {
        const adminLink = document.createElement("a");
        adminLink.href = "/admin/dashboard";
        adminLink.className = "dropdown-item";
        adminLink.textContent = "Admin Dashboard";
        userDropdown.insertBefore(adminLink, userDropdown.firstChild);
      }
    }
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (userMenu) userMenu.style.display = "none";
  }
}

function setupSmoothScroll() {
  const scrollLinks = document.querySelectorAll(".scroll-link");
  const currentPath = window.location.pathname;
  const homePath = "/";

  // Function to update active state
  function updateActiveState(section) {
    document.querySelectorAll(".scroll-link").forEach((l) => l.classList.remove("active"));
    const activeLink = document.querySelector(`.scroll-link[data-section="${section}"]`);
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  scrollLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      
      const section = link.getAttribute("data-section") || link.getAttribute("href").split("#")[1];
      
      // If not on home page, navigate to home first then scroll
      if (currentPath !== homePath && currentPath !== "/") {
        window.location.href = homePath + "#" + section;
        return;
      }
      
      // If on home page, smooth scroll to section
      const targetElement = document.getElementById(section);
      if (targetElement) {
        const headerHeight = document.querySelector(".main-header")?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Update active state immediately
        updateActiveState(section);
        
        // Update URL hash without triggering scroll
        history.pushState(null, null, "#" + section);
      }
    });
  });
  
  // Handle hash on page load
  if (window.location.hash) {
    setTimeout(() => {
      const hash = window.location.hash.substring(1);
      const targetElement = document.getElementById(hash);
      if (targetElement) {
        const headerHeight = document.querySelector(".main-header")?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
        
        // Update active state
        updateActiveState(hash);
      }
    }, 100);
  } else {
    // If no hash, set home as active if on home page
    if (currentPath === homePath || currentPath === "/") {
      updateActiveState("home");
    }
  }
  
  // Active state on scroll is handled by setupNavigationActiveState()
}

function setupUserMenuDropdown() {
  const userMenuBtn = document.getElementById("userMenuBtn");
  const userDropdown = document.getElementById("userDropdown");

  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (
        userDropdown.classList.contains("show") &&
        !userDropdown.contains(e.target) &&
        !userMenuBtn.contains(e.target)
      ) {
        userDropdown.classList.remove("show");
      }
    });

    userDropdown
      .querySelectorAll(".dropdown-item")
      .forEach((item) => {
        if (item.id !== "logoutBtn") {
          item.addEventListener("click", () => {
            userDropdown.classList.remove("show");
          });
        }
      });
  }
}

function setupLogoutHandlers() {
  const logoutBtn = document.getElementById("logoutBtn");
const logoutModal = document.getElementById("logoutModal");
const logoutCancelBtn = document.getElementById("logoutModalCancelBtn");
const logoutConfirmBtn = document.getElementById("logoutModalConfirmBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showLogoutModal();
    });
  }

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
}

function showLogoutModal() {
  const logoutModal = document.getElementById("logoutModal");
  const userDropdown = document.getElementById("userDropdown");
  
  if (logoutModal) {
    logoutModal.classList.add("show");
    // Close user menu if open
    if (userDropdown) {
      userDropdown.classList.remove("show");
    }
  }
}

function hideLogoutModal() {
  const logoutModal = document.getElementById("logoutModal");
  if (logoutModal) {
    logoutModal.classList.remove("show");
  }
}

function performLogout() {
  // If using Laravel auth, submit logout form
  if (window.laravelAuth?.isAuthenticated) {
    // Create a form to submit POST logout request
    const form = document.createElement("form");
    form.method = "POST";
    form.action = window.laravelAuth.logoutUrl || "/logout";
    
    const csrfToken = document.createElement("input");
    csrfToken.type = "hidden";
    csrfToken.name = "_token";
    csrfToken.value = window.laravelAuth.csrfToken || "";
    form.appendChild(csrfToken);
    
    document.body.appendChild(form);
    form.submit();
    return;
  }
  
  // Otherwise, clear localStorage (for dummy users)
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
  localStorage.removeItem("lastLogin");
  localStorage.removeItem("rememberedEmail");
  localStorage.removeItem("rememberMe");
  
  // Update UI immediately
  updateUIForLoginState(false, null, null);
  updateMyBookingsVisibility(false);
  
  // Reload page to update UI
  window.location.reload();
}

function setupSearchHandlers() {
  // Only run on home page
  const currentPath = window.location.pathname;
  if (currentPath !== '/' && currentPath !== '/home') {
    return;
  }
  
  console.log('Setting up search handlers...');
  
  // Wait a bit to ensure DOM is fully ready
  const searchBtn = document.getElementById("searchBtn");
  const checkInBtn = document.getElementById("checkInBtn");
  const checkOutBtn = document.getElementById("checkOutBtn");
  const checkInDate = document.getElementById("checkInDate");
  const checkOutDate = document.getElementById("checkOutDate");
  const checkInText = document.getElementById("checkInText");
  const checkOutText = document.getElementById("checkOutText");
  const personDropdown = document.getElementById("personDropdown");
  const personValue = document.getElementById("personValue");
  const personMenu = document.getElementById("personMenu");

  // Check if all required elements exist
  if (!checkInBtn || !checkOutBtn || !checkInDate || !checkOutDate || !searchBtn) {
    // Silently return if elements don't exist (might not be on home page)
    return;
  }

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  checkInDate.min = today;
  checkInDate.value = '';
  checkOutDate.min = today;
  checkOutDate.value = '';
  
  console.log('Search handlers initialized successfully');

  // Check-in date handler - input is now directly clickable
  if (checkInDate) {
    checkInDate.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    
    // Also handle clicks on the button wrapper
    if (checkInBtn) {
      checkInBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        checkInDate.focus();
        if (checkInDate.showPicker && typeof checkInDate.showPicker === 'function') {
          checkInDate.showPicker().catch(() => {
            // Fallback: input is already clickable
          });
        }
      });
    }

    checkInDate.addEventListener("change", () => {
      console.log('Check-in date changed:', checkInDate.value);
      if (checkInDate.value) {
        const date = new Date(checkInDate.value + 'T00:00:00');
        const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        if (checkInText) checkInText.textContent = formatted;
        console.log('Check-in formatted:', formatted);
        
        // Set minimum check-out date to day after check-in
        if (checkOutDate) {
          const nextDay = new Date(checkInDate.value);
          nextDay.setDate(nextDay.getDate() + 1);
          checkOutDate.min = nextDay.toISOString().split('T')[0];
          
          // If check-out is before new minimum, clear it
          if (checkOutDate.value && new Date(checkOutDate.value) < nextDay) {
            checkOutDate.value = '';
            if (checkOutText) checkOutText.textContent = 'Check Out';
          }
        }
      } else {
        if (checkInText) checkInText.textContent = 'Check In';
      }
    });
  }

  // Check-out date handler - input is now directly clickable
  if (checkOutDate) {
    checkOutDate.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    
    // Also handle clicks on the button wrapper
    if (checkOutBtn) {
      checkOutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!checkInDate?.value) {
          const msg = "Please select check-in date first.";
          if (window.showError) {
            window.showError(msg);
          } else {
            alert(msg);
          }
          return;
        }
        
        checkOutDate.focus();
        if (checkOutDate.showPicker && typeof checkOutDate.showPicker === 'function') {
          checkOutDate.showPicker().catch(() => {
            // Fallback: input is already clickable
          });
        }
      });
    }

    checkOutDate.addEventListener("change", () => {
      console.log('Check-out date changed:', checkOutDate.value);
      if (checkOutDate.value) {
        const date = new Date(checkOutDate.value + 'T00:00:00');
        const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        if (checkOutText) checkOutText.textContent = formatted;
        console.log('Check-out formatted:', formatted);
      } else {
        if (checkOutText) checkOutText.textContent = 'Check Out';
      }
    });
  }

  // Person dropdown handler
  if (personDropdown && personMenu && personValue) {
    personDropdown.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Person dropdown clicked');
      const isVisible = personMenu.style.display !== "none";
      personMenu.style.display = isVisible ? "none" : "block";
    });

    const personOptions = personMenu.querySelectorAll(".person-option");
    personOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const value = option.getAttribute("data-value");
        console.log('Person selected:', value);
        personValue.textContent = value;
        personMenu.style.display = "none";
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (personMenu && !personDropdown.contains(e.target) && !personMenu.contains(e.target)) {
        personMenu.style.display = "none";
      }
    });
  } else {
    console.warn('Person dropdown elements not found');
  }

  // Location dropdown handler
  if (locationDropdown && locationMenu && locationValue) {
    locationDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
      locationMenu.style.display = locationMenu.style.display === "none" ? "block" : "none";
    });

    locationMenu.querySelectorAll(".location-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        const value = option.getAttribute("data-value");
        locationValue.textContent = value || "All Locations";
        locationMenu.style.display = "none";
      });
    });

    document.addEventListener("click", () => {
      if (locationMenu) locationMenu.style.display = "none";
    });
  }

  // Search button handler
  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const checkIn = checkInDate?.value;
      const checkOut = checkOutDate?.value;
      const persons = personValue?.textContent || "2";
      
      console.log('Search clicked:', { checkIn, checkOut, persons });
      
      // If dates are provided, validate them
      if (checkIn && checkOut) {
        const checkInDateObj = new Date(checkIn + 'T00:00:00');
        const checkOutDateObj = new Date(checkOut + 'T00:00:00');
        
        if (checkOutDateObj <= checkInDateObj) {
          if (window.showError) {
            window.showError("Check-out date must be after check-in date.");
          } else {
            alert("Check-out date must be after check-in date.");
          }
          return;
        }
      } else if (checkIn || checkOut) {
        // If only one date is selected, show error
        if (window.showError) {
          window.showError("Please select both check-in and check-out dates, or leave both empty to browse all rooms.");
        } else {
          alert("Please select both check-in and check-out dates, or leave both empty to browse all rooms.");
        }
        return;
      }

      // Build search URL
      const params = new URLSearchParams();
      
      if (checkIn && checkOut) {
        params.append('check_in', checkIn);
        params.append('check_out', checkOut);
      }
      
      // Always include persons if it's not the default
      const personsNum = parseInt(persons) || 2;
      if (personsNum !== 2) {
        params.append('persons', personsNum.toString());
      }

      // Redirect to rooms page with search parameters
      const roomsUrl = document.querySelector('[data-rooms-url]')?.getAttribute('data-rooms-url') || '/client/rooms';
      const queryString = params.toString();
      const finalUrl = queryString ? roomsUrl + "?" + queryString : roomsUrl;
      
      console.log('Redirecting to:', finalUrl);
      window.location.href = finalUrl;
    });
  }
}

function setupNavigationActiveState() {
  const sections = document.querySelectorAll("section[id]");
  const scrollLinks = document.querySelectorAll(".scroll-link");
  const currentPath = window.location.pathname;
  const homePath = "/";

  // Only run on home page
  if (currentPath !== homePath && currentPath !== "/") {
    return;
  }

  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      let current = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const headerHeight = document.querySelector(".main-header")?.offsetHeight || 0;

        if (window.pageYOffset >= sectionTop - headerHeight - 100) {
          current = section.getAttribute("id");
        }
      });

      // Update active state based on current section
      scrollLinks.forEach((link) => {
        link.classList.remove("active");
        const section = link.getAttribute("data-section");
        if (section === current) {
          link.classList.add("active");
        }
      });
    }, 50);
  });
  
  // Set initial active state on page load
  setTimeout(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const activeLink = document.querySelector(`.scroll-link[data-section="${hash}"]`);
      if (activeLink) {
        scrollLinks.forEach((l) => l.classList.remove("active"));
        activeLink.classList.add("active");
      }
    } else {
      // Set home as active by default
      const homeLink = document.querySelector(`.scroll-link[data-section="home"]`);
      if (homeLink) {
        scrollLinks.forEach((l) => l.classList.remove("active"));
        homeLink.classList.add("active");
      }
    }
  }, 100);
}

const showMoreBtn = document.querySelector(".show-more-btn");
if (showMoreBtn) {
  showMoreBtn.addEventListener("click", () => {
    const roomsSection = document.getElementById("rooms");
    if (roomsSection) {
      const headerHeight = document.querySelector(".main-header")?.offsetHeight || 0;
      const targetPosition =
        roomsSection.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight -
        20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
}

// Hotel card navigation handled by HTML links - no JS routing needed

// Room card navigation handled by HTML links - no JS routing needed

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const emailAddress = document.getElementById("emailAddress").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // Validation
    if (!fullName || !emailAddress || !subject || !message) {
      if (window.showError) window.showError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      if (window.showError) window.showError("Please enter a valid email address.");
      return;
    }

    try {
      // Get CSRF token
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";

      const contactUrl = document.querySelector('[data-contact-url]')?.getAttribute('data-contact-url') || '/contact';
      const response = await fetch(contactUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
          name: fullName,
          email: emailAddress,
          phone: phoneNumber || null,
          subject: subject,
          message: message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send message. Please try again.");
      }

      if (window.showSuccess) {
        window.showSuccess(result.message || `Thank you for contacting us, ${fullName}! We have received your message and will get back to you shortly.`);
      }

      contactForm.reset();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      if (window.showError) {
        window.showError(error.message || "Failed to send message. Please try again.");
      }
    }
  });
}

