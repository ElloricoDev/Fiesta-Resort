// Dashboard pagination functionality
const activitiesTableBody = document.getElementById("activitiesTableBody");
const paginationContainer = document.getElementById("paginationContainer");

if (activitiesTableBody && paginationContainer) {
  const rows = Array.from(activitiesTableBody.querySelectorAll("tr"));
  const itemsPerPage = 10;
  let currentPage = 1;
  const totalPages = Math.ceil(rows.length / itemsPerPage);

  // Only show pagination if there are more than 10 items
  if (rows.length <= itemsPerPage) {
    paginationContainer.style.display = "none";
  } else {
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const paginationPages = document.getElementById("paginationPages");

    function renderPagination() {
      if (!paginationPages) return;

      paginationPages.innerHTML = "";
      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement("button");
        btn.className = `pagination-btn ${i === currentPage ? "active" : ""}`;
        btn.setAttribute("data-page", i);
        btn.textContent = i;
        btn.type = "button";
        btn.addEventListener("click", () => {
          currentPage = i;
          updateDisplay();
          renderPagination();
        });
        paginationPages.appendChild(btn);
      }
    }

    function updateDisplay() {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;

      rows.forEach((row, index) => {
        if (index >= start && index < end) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });

      if (prevBtn) prevBtn.disabled = currentPage === 1;
      if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          updateDisplay();
          renderPagination();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage++;
          updateDisplay();
          renderPagination();
        }
      });
    }

    // Initialize
    updateDisplay();
    renderPagination();
  }
} else {
  // Fallback for existing pagination structure
  const paginationBtns = document.querySelectorAll(
    ".pagination-btn:not(.arrow)"
  );
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  if (paginationBtns.length && prevBtn && nextBtn) {
    let currentPage = 1;
    const totalPages = paginationBtns.length;

    function updatePagination(page) {
      currentPage = page;

      paginationBtns.forEach((btn) => {
        const btnPage = parseInt(btn.getAttribute("data-page"), 10);
        if (btnPage === currentPage) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
    }

    paginationBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const page = parseInt(btn.getAttribute("data-page"), 10);
        updatePagination(page);
      });
    });

    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        updatePagination(currentPage - 1);
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        updatePagination(currentPage + 1);
      }
    });

    updatePagination(1);
  }
}
