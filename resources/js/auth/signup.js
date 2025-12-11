const signupForm = document.getElementById("signupForm");

if (signupForm) {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("password_confirmation");
  const agreeTermsCheckbox = document.getElementById("agreeTerms");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("passwordConfirmationError");
  const termsError = document.getElementById("termsError");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateName(name) {
    if (!name || name.trim() === "") {
      return "Name is required";
    }
    return "";
  }

  function validateEmail(email) {
    if (!email) {
      return "Email address is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  }

  function validatePassword(password) {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  }

  function validatePasswordConfirmation(password, confirmation) {
    if (!confirmation) {
      return "Please confirm your password";
    }
    if (password !== confirmation) {
      return "Passwords do not match";
    }
    return "";
  }

  function validateTerms(checked) {
    if (!checked) {
      return "You must agree to the terms & policy";
    }
    return "";
  }

  function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.add("show");
  }

  function hideError(errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove("show");
  }

  nameInput.addEventListener("input", () => hideError(nameError));
  emailInput.addEventListener("input", () => hideError(emailError));
  passwordInput.addEventListener("input", () => hideError(passwordError));
  confirmPasswordInput.addEventListener("input", () =>
    hideError(confirmPasswordError)
  );
  agreeTermsCheckbox.addEventListener("change", () => hideError(termsError));

  signupForm.addEventListener("submit", (event) => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const agreeTerms = agreeTermsCheckbox.checked;

    const nameErrorMsg = validateName(name);
    const emailErrorMsg = validateEmail(email);
    const passwordErrorMsg = validatePassword(password);
    const confirmPasswordErrorMsg = validatePasswordConfirmation(
      password,
      confirmPassword
    );
    const termsErrorMsg = validateTerms(agreeTerms);

    let hasError = false;

    if (nameErrorMsg) {
      showError(nameError, nameErrorMsg);
      hasError = true;
    } else {
      hideError(nameError);
    }

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

    if (confirmPasswordErrorMsg) {
      showError(confirmPasswordError, confirmPasswordErrorMsg);
      hasError = true;
    } else {
      hideError(confirmPasswordError);
    }

    if (termsErrorMsg) {
      showError(termsError, termsErrorMsg);
      hasError = true;
    } else {
      hideError(termsError);
    }

    if (hasError) {
      event.preventDefault();
      return;
    }

    // Check if this is a dummy user registration (for testing)
    // Only handle dummy users if they're in the dummy users list
    const existingUsers = JSON.parse(localStorage.getItem("dummyUsers") || "[]");
    const userExists = existingUsers.some((u) => u.email === email);
    
    if (userExists) {
      showError(emailError, "This email is already registered");
      event.preventDefault();
      return;
    }

    // For new registrations, let Laravel handle it
    // The form will submit normally and Laravel will create the user
    // Laravel will automatically log them in and redirect
  });

  // Navigation handled by HTML links - no JS routing needed
  // data-auth-transition is for CSS transitions only

  const termsLink = document.querySelector(".terms-link");
  if (termsLink) {
    termsLink.addEventListener("click", (event) => {
      const href = termsLink.getAttribute("href");
      if (!href || href === "#") {
        event.preventDefault();
        if (window.showInfo) {
          window.showInfo("Terms & Policy page will be implemented soon. This would typically show the terms of service and privacy policy.");
        }
      }
    });
  }
}

