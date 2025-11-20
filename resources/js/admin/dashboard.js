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
    console.log("Loading page:", currentPage);
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

