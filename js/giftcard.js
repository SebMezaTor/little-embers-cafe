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
function updatePreview() {
  const amtDisplay = state.amount === "custom" ? "?" : `$${state.amount}`;
  document.getElementById("cardAmount").textContent = amtDisplay;
  document.getElementById("summaryValue").textContent =
    state.amount === "custom" ? "-" : formatMoney(state.amount);
  document.getElementById("summaryTotal").textContent =
    state.amount === "custom" ? "-" : formatMoney(state.amount);

  const card = document.getElementBtId("giftCard");
  card.className = `gift-card theme-${state.theme}`;

  document.getElementById(cardRecipient).textContent =
    state.recipient.trim() || "Someone Special";
  document.getElementById("cardFrom").textContent = state.sender.trim()
    ? `From ${state.sender}`
    : `From a friend`;

  const msg = state.message.trim();
  document.getElementById("cardMessage").textContent =
    msg || "Enjoy your next coffee break!";
}

const amountBtns = document.querySelectorAll(".amount-btn");
const customRow = document.getElementById("customRow");
const customAmt = document.getElementById("customAmount");

amountBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    amountBtns.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    const val = btn.dataset.amount;
    if (val === "custom") {
      state.amount = "custom";
      customRow.style.display = "flex";
      customAmt.focus();
    } else {
      state.amount = parseInt(val);
      customRow.style.display = "none";
    }
    updatePreview();
  });
});

customAmt.addEventListener("input", () => {
  const v = parseFloat(customAmt.value);
  state.amount = isNaN(v) ? "custom" : v;
  document.getElementById("cardAmount").textContent = isNaN(v) ? "?" : `$${v}`;
  document.getElementById("summaryValue").textContent = isNaN(v)
    ? "-"
    : formatMoney(v);
  document.getElementById("summaryTotal").textContent = isNaN(v)
    ? "-"
    : formatMoney(v);
});

const themeBtns = document.querySelectorAll(".theme-btn");
themeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    themeBtns.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    state.theme = btn.dataset.theme;
    updatePreview();
  });
});

document.getElementById("recipientName").addEventListener("input", (e) => {
  state.recipient = e.target.value;
  updatePreview();
});

document.getElementById("senderName").addEventListener("input", (e) => {
  state.sender = e.target.value;
  updatePreview();
});

document.getElementById("giftMessage").addEventListener("input", (e) => {
  state.message = e.target.value;
  updatePreview();
});

const deliveryBtns = document.querySelectorAll(".delivery-btn");
const deliveryEmail = document.getElementById("deliveryEmailField");

deliveryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    deliveryBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.delivery = btn.dataset.delivery;
    deliveryEmail.style.display = state.delivery === "email" ? "block" : "none";
  });
});

const dateInput = document.getElementById("sendDate");
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
dateInput.value = tomorrow.toISOString().split("T")[0];
dateInput.min = new Date().toISOString().split("T")[0];

const purchaseBtn = document.getElementById("purchaseBtn");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalMsg = document.getElementById("modalMessage");
const modalCode = document.getElementById("modalCode");

purchaseBtn.addEventListener("click", () => {
  const recipientEl = document.getElementById("recipientName");
  if (!recipientEl.value.trim()) {
    recipientEl.focus();
    recipientEl.style.borderColor = "#c0392b";
    setTimeout(() => {
      recipientEl.style.borderColor = "";
    }, 2000);
    return;
  }
  if (state.delivery === "email") {
    const emailEl = document.getElementById("recipientEmail");
    if (!emailEl.value.trim()) {
      emailEl.focus();
      emailEl.style.borderColor = "#c0392b";
      setTimeout(() => {
        emailEl.style.borderColor = "";
      }, 2000);
      return;
    }
  }

  const code = generateCode();
  document.getElementById("cardCode").textContent = code;
  modalCode.textContent = code;

  const amtStr =
    state.amount === "custom"
      ? formatMoney(parseFloat(customAmt.value))
      : formatMoney(state.amount);
  const recip = state.recipient.trim() || "your recipient";
  modalMsg.textContent = `Your ${amtStr} gift card for ${recip} is ready. Show the code at the counter or redeem it online anytime.`;
  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
});

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

function closeModal() {
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

const revealEls = document.querySelectorAll(".reveal");
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);
revealEls.forEach((el) => revealObs.observe(el));

updatePreview();
