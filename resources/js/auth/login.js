const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberMeCheckbox = document.getElementById("rememberMe");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  window.addEventListener("DOMContentLoaded", () => {
    initializeDummyUsers();
    const savedEmail = localStorage.getItem("rememberedEmail");
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    if (rememberMe && savedEmail) {
      emailInput.value = savedEmail;
      rememberMeCheckbox.checked = true;
    }
  });

  function validateEmail(value) {
    if (!value) {
      return "Email address is required";
    }
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  }

  function validatePassword(value) {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  }

  function showError(element, message) {
    element.textContent = message;
    element.classList.add("show");
  }

  function hideError(element) {
    element.textContent = "";
    element.classList.remove("show");
  }

  emailInput.addEventListener("input", () => hideError(emailError));
  passwordInput.addEventListener("input", () => hideError(passwordError));

  // Initialize dummy users if not exists
  function initializeDummyUsers() {
    const existingUsers = localStorage.getItem("dummyUsers");
    if (!existingUsers) {
      const dummyUsers = [
        {
          email: "admin@fiesta.com",
          password: "admin123",
          name: "Admin User",
          role: "admin",
        },
        {
          email: "user@fiesta.com",
          password: "user123",
          name: "John Doe",
          role: "user",
        },
      ];
      localStorage.setItem("dummyUsers", JSON.stringify(dummyUsers));
    }
  }

  // Check dummy user credentials
  function authenticateDummyUser(email, password) {
    const users = JSON.parse(localStorage.getItem("dummyUsers") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    return user;
  }

  loginForm.addEventListener("submit", (event) => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const emailErrorMsg = validateEmail(email);
    const passwordErrorMsg = validatePassword(password);
    let hasError = false;

    if (emailErrorMsg) {
      showError(emailError, emailErrorMsg);
      hasError = true;
    } else {
      hideError(emailError);
    }

    if (passwordErrorMsg) {
      showError(passwordError, passwordErrorMsg);
      hasError = true;
    } else {
      hideError(passwordError);
    }

    if (hasError) {
      event.preventDefault();
      return;
    }

    // Let Laravel handle authentication - don't intercept for dummy users
    // Dummy users are only for testing when Laravel auth is not available
    // Since we have database authentication, always let Laravel handle it
    
    // Store remember me preference for next time
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberMe");
    }
    // Allow form to submit normally for Laravel authentication
    // Don't prevent default - let the form submit to Laravel
  });

  // Initialize dummy users on page load
  window.addEventListener("DOMContentLoaded", () => {
    initializeDummyUsers();
  });

  // data-auth-transition is for CSS transitions only - let links work naturally
  document.querySelectorAll("[data-auth-transition]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) {
        return;
      }
      // Add fade-out animation but don't prevent navigation
      document.body.classList.add("fade-out");
      // Let the browser handle navigation naturally
    });
  });
}

