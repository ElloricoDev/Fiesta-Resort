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
  const searchBtn = document.querySelector(".search-btn");
  const searchFields = document.querySelectorAll(".search-field");
  const searchFieldDropdown = document.querySelector(".search-field-dropdown");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      if (window.showInfo) window.showInfo("Search functionality will be implemented with backend integration.");
    });
  }

  searchFields.forEach((field) => {
    field.addEventListener("click", () => {
      const label = field.querySelector("span")?.textContent || "Field";
      console.log("Search field clicked:", label);
    });
  });

  if (searchFieldDropdown) {
    searchFieldDropdown.addEventListener("click", () => {
      console.log("Person selector clicked");
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
    const hotelsSection = document.getElementById("hotels");
    if (hotelsSection) {
      const headerHeight = document.querySelector(".main-header")?.offsetHeight || 0;
      const targetPosition =
        hotelsSection.getBoundingClientRect().top +
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
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const emailAddress = document.getElementById("emailAddress").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    console.log("Contact Form Submission:", {
      fullName,
      emailAddress,
      phoneNumber,
      subject,
      message,
    });

    if (window.showSuccess) {
      window.showSuccess(`Thank you for contacting us, ${fullName}! We have received your message and will get back to you shortly at ${emailAddress}.`);
    }

    contactForm.reset();
  });
}

