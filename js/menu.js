"use strict";

/* Cart State */
const cart = {};

/* Elements */
const cartBadge = document.getElementById("cartBadge");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartTotal = document.getElementById("cartTotal");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const checkoutBtn = document.getElementById("checkoutBtn");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");
const noResults = document.getElementById("noResults");
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

/* Hamburger */
hamburger.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(isOpen));
  mobileNav.classList.toggle("open", isOpen);
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileNav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

/* Filter Tabs */
const tabBtns = document.querySelectorAll(".tab-btn");
const sections = document.querySelectorAll(".menu-section");
const allCards = document.querySelectorAll(".item-card");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;

    tabBtns.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    sections.forEach((sec) => {
      if (tab === "all" || sec.dataset.section === tab) {
        sec.classList.remove(hidden);
      } else {
        sec.classList.add("hidden");
      }
    });
    clearSearch();
  });
});

/* Live Search */
let searchTimeout;

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(runSearch, 180);
  searchClear.classList.toggle("visible", searchInput.value.length > 0);
});

searchClear.addEventListener("click", () => {
  clearSearch();
  searchInput.focus();
});

function clearSearch() {
  searchInput.value = "";
  searchClear.classList.remove("visible");
  allCards.forEach((c) => c.classList.remove("hidden-item"));
  noResults.classList.remove("visible");

  const activeTab = document.querySelector(".tab-btn.active").dataset.tab;
  sections.forEach((sec) => {
    sec.classList.toggle(
      "hidden",
      activeTab !== "all" && sec.dataset.section !== activeTab,
    );
  });
}

function runSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    clearSearch();
    return;
  }

  sections.forEach((sec) => sec.classList.remove("hidden"));

  let anyVisible = false;

  allCards.forEach((card) => {
    const name = card.dataset.name || "";
    const desc = card.dataset.desc || "";
    const match = name.includes(query) || desc.includes(query);
    if (match) anyVisible = true;
  });

  sections.forEach((sec) => {
    const hasVisible = [...sec.querySelectorAll("item-card")].some(
      (c) => !c.classList.contains("hidden-item"),
    );
    sec.classList.toggle("hidden", !hasVisible);
  });

  (noResults.classList, toggle("visible", !anyVisible));
}

/* Cart */

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});

function getTotalQty() {
  return Object.values(cart).reduce((sum, i) => sum + i.qty, 0);
}

function getTotalPrice() {
  return Object.values(cart).reduce((sum, i) => sum + i.price * i.qty, 0);
}

function renderCart() {
  const qty = getTotalQty();
  const total = getTotalPrice();

  cartBadge.textContent = qty;
  cartBadge.classList.toggle("visible", qty > 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;

  const entries = Object.entries(cart).filter(([, v]) => v.qty > 0);
  if (entries.length === 0) {
    cartItems.innerHTML = "";
    cartItems.appendChild(cartEmpty);
    return;
  }

  if (cartEmpty.parentNode === cartItems) cart.Empty.remove();

  const incoming = new Set(entries.map(([k]) => k));
  cartItems.querySelectorAll(".cart-item").forEach((el) => {
    if (!incoming.has(el.dataset.key)) el.remove();
  });

  entries.forEach(([key, { price, qty }]) => {
    let el = cartItems.querySelector(
      `.cart-item[data-key="${CSS.escape(key)}"]`,
    );
    if (!el) {
      el = document.createElement("div");
      el.className = "cart-item";
      el.dataset.key = key;
      el.innerHTML = `
            <div class="cart-item-info">
            <p class="cart-item-name">${key}</p>
            <p class="cart-item-price">$${price.toFixed(2)} each</p>
            </div>
            <div class="qty-controls">
            <button class="qty-btn minus" aria-label="Remove one ${key}">&minus;</button>
            <span class="qty-num">${qty}</span>
            <button class="qty-btn plus" aria-label="Add one more ${key}">+</button>
            </div>
            `;
      el.querySelector(".minus").addEventListener("click", () =>
        changeQty(key, -1),
      );
      el.querySelector(".plus").addEventListener("click", () =>
        changeQty(key, 1),
      );
      cartItems.appendChild(el);
    } else {
      el.querySelector(".qty-num").textContent = qty;
    }
  });
}

function changeQty(key, delta) {
  if (!cart[key]) return;
  cart[key].qty += delta;
  if (cart[key].qty <= 0) delete cart[key];
  renderCart();
}

/* Add to Cart */

document.querySelectorAll(".add-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.item;
    const price = parseFloat(btn.dataset.price);
    if (cart[name]) {
      cart[name].qty++;
    } else {
      cart[name] = { price, qty: 1 };
    }
    renderCart();
    showToast(`${name} added to your order`);

    btn.textContent = "✓";
    btn.classList.add("added");
    setTimeout(() => {
      btn.textContent = "+";
      btn.classList.remove("added");
    }, 1000);
  });
});

/* Toast */

let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

/* Checkout */

checkoutBtn.addEventListener("click", () => {
  if (getTotalQty() === 0) {
    showToast("Your cart is empty - add something first!");
    return;
  }
  showToast("Thanks for your order! See you soon");
  Object.keys(cart).forEach((k) => delete cart[k]);
  renderCart();
  setTimeout(closeCart, 600);
});

/* Scroll */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${i * 0.06}s`;
        entry.target.style.animationName = "fadeUp";
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);
allCards.forEach((card) => observer.observe(card));

renderCart();
