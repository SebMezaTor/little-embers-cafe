"use strict";

/* Hamburger */
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

hamburger.addEventListener("click", () => {
  const open = hamburger.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(open));
  mobileNav.classList.toggle("open", open);
});
mobileNav.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileNav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

/* State */
let state = {
  amount: 10,
  theme: "ember",
  recipient: "",
  sender: "",
  message: "",
  delivery: "email",
};

function generateCode() {
  const seg = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LEP-${seg()}-${seg()}`;
}

function formatMoney(n) {
  return isNaN(n) ? "$0.00" : `$${parseFloat(n).toFixed(2)}`;
}

/* Live Card Preview */
function updatePreview() {}
