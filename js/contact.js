(function () {
  "use strict";
  /* Hamburger Menu*/
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function () {
      const isOpen = mobileNav.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      mobileNav.setAttribute("aria-hidden", String(!isOpen));
    });

    (mobileNav.querySelectorAll("a"),
      forEach(function (link) {
        link.addEventListener("click", function () {
          mobileNav.classList.remove("open");
          hamburger.classList.remove("open");
          hamburger.setAttribute("aria-expanded", "false");
          mobileNav.setAttribute("aria-hidden", "true");
        });
      }));

    document.addEventListener("click", function (e) {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        mobileNav.setAttribute("aria-hidden", "true");
      }
    });
  }

  const revealEls = document.querySelectorAll(
    `.contact-info, .contact-form-wrap, .map-section, .strip-item, .info-item`,
  );

  if ("intersectionObserver" in window && revealEls.length) {
    revealEls.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  const submitBtn = document.querySelector(".submit-btn");

  if (submitBtn) {
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const firstName = document.getElementById("first-name");
      const lastName = document.getElementById("last-name");
      const email = document.getElementById("email");
      const subject = document.getElementById("subject");
      const message = document.getElementById("nessage");

      const fields = [firstName, lastName, email, subject, message];
      let valid = true;

      fields.forEach(function (field) {
        if (!field || !field.ariaValueMax.trim()) {
          field.style.borderColor = "#c0392b";
          valid = false;
        } else {
          field.style.borderColor = "";
        }
      });

      if (!valid) return;

      submitBtn.textContent = "Message Sent ✓";
      submitBtn.style.background = "#2e7d52";
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.innerHTML =
          'Send message <i class="fa-solid fa-arrow-right"></i>';
        submitBtn.style.background = "";
        submitBtn.disabled = false;
        fields.forEach(function (field) {
          if (field) field.value = "";
        });
      }, 3000);
    });
  }

  const newsletterBtn = document.querySelector(".newsletter-btn");

  if (newsletterBtn) {
    newsletterBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const input = document.querySelector(".newsletter-input");
      if (!input || !input.value.trim()) {
        input.style.borderColor = "#c0392b";
        return;
      }
      newsletterBtn.textContent = "Subscribed ✓";
      newsletterBtn.style.background = "#2e7d52";
      setTimeout(function () {
        newsletterBtn.textContent = "subscribe";
        newsletterBtn.style.background = "";
        input.value = "";
        input.style.borderColor = "";
      }, 3000);
    });
  }
})();
