document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".menu");
  const listNav = document.getElementById("listNav");
  const overlay = document.getElementById("overlay");

  if (menuButton && listNav && overlay) {
    menuButton.addEventListener("click", function () {
      const isActive = listNav.classList.toggle("active");
      menuButton.setAttribute("aria-expanded", isActive ? "true" : "false");

      // Toggle overlay
      if (isActive) {
        overlay.classList.add("show");
      } else {
        overlay.classList.remove("show");
      }
    });

    // Klik overlay untuk menutup nav
    overlay.addEventListener("click", function () {
      listNav.classList.remove("active");
      overlay.classList.remove("show");
      menuButton.setAttribute("aria-expanded", "false");
    });
  }
});
