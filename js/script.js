const menuToggle = document.querySelector(" .menu-toggle");
const navLinks = document.querySelector(" .nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

const darkModeBtn = document.getElementById("darkModeBtn");

darkModeBtn.addEventListener("change", () => {
  const isDark = darkModeBtn.checked;
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("darkMode", isDark);
});

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  darkModeBtn.checked = true;
}
