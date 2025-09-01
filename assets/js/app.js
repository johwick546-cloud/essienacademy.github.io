// ====== MOBILE NAVIGATION TOGGLE ======
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
    menuToggle.classList.toggle("active");
  });
}

// ====== THEME TOGGLE ======
const themeToggle = document.getElementById("theme-toggle");

// Check saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.body.setAttribute("data-theme", savedTheme);
  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";

    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
  });
}
