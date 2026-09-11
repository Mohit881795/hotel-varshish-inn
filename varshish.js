/* =========================================================
   HOTEL VARSHISH INN — MAIN SCRIPT
   Beginner-friendly vanilla JavaScript.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* -------------------------------------------------------
     1. ELEMENT REFERENCES
  ------------------------------------------------------- */
  const header        = document.getElementById("header");
  const navToggle     = document.getElementById("navToggle");
  const navList       = document.getElementById("navList");
  const navLinks      = document.querySelectorAll(".nav-link");
  const backToTop     = document.getElementById("backToTop");
  const revealItems   = document.querySelectorAll(".reveal");
  const galleryItems  = document.querySelectorAll(".gallery-item");
  const roomButtons   = document.querySelectorAll(".room-btn");
  const enquiryBtns   = document.querySelectorAll("[data-enquiry]");

  const enquiryModal    = document.getElementById("enquiryModal");
  const closeModalBtns  = document.querySelectorAll("[data-close-modal]");

  const lightbox      = document.getElementById("lightbox");
  const lightboxImg   = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev  = document.getElementById("lightboxPrev");
  const lightboxNext  = document.getElementById("lightboxNext");

  let currentImageIndex = 0;
  const galleryImages = Array.from(galleryItems).map(function (item) {
    return item.querySelector("img");
  });

  /* -------------------------------------------------------
     2. MOBILE HAMBURGER MENU
  ------------------------------------------------------- */
  function closeMenu() {
    navList.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  function openMenu() {
    navList.classList.add("open");
    navToggle.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      if (navList.classList.contains("open")) closeMenu();
      else openMenu();
    });
  }

  /* Close mobile menu when a nav link is clicked */
  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  /* Close menu when clicking outside (mobile) */
  document.addEventListener("click", function (e) {
    if (!navList.classList.contains("open")) return;
    if (navList.contains(e.target) || navToggle.contains(e.target)) return;
    closeMenu();
  });

  /* -------------------------------------------------------
     3. SMOOTH SCROLLING
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId.length < 2) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;

      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* -------------------------------------------------------
     4. NAVBAR BACKGROUND + BACK TO TOP
  ------------------------------------------------------- */
  function handleScroll() {
    const scrollY = window.pageYOffset;

    if (scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");

    if (scrollY > 500) backToTop.classList.add("show");
    else backToTop.classList.remove("show");

    updateActiveLink();
  }

  window.addEventListener("scroll", handleScroll);

  /* -------------------------------------------------------
     5. BACK TO TOP
  ------------------------------------------------------- */
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -------------------------------------------------------
     6. ACTIVE NAV LINK WHILE SCROLLING
  ------------------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");

  function updateActiveLink() {
    const scrollPos = window.pageYOffset + header.offsetHeight + 80;
    let currentId = "home";

    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href === "#" + currentId) link.classList.add("active");
    });
  }

  /* -------------------------------------------------------
     7. SCROLL REVEAL ANIMATIONS
  ------------------------------------------------------- */
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-delay") || 0;
          setTimeout(function () {
            entry.target.classList.add("visible");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px"
    });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("visible"); });
  }

  /* -------------------------------------------------------
     8. GALLERY LIGHTBOX
  ------------------------------------------------------- */
  function openLightbox(index) {
    currentImageIndex = index;
    const img = galleryImages[index];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "Hotel image";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    openLightbox(currentImageIndex);
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(currentImageIndex);
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener("click", function () { openLightbox(index); });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxNext)  lightboxNext.addEventListener("click", showNextImage);
  if (lightboxPrev)  lightboxPrev.addEventListener("click", showPrevImage);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (lightbox.classList.contains("open")) {
      if (e.key === "Escape")      closeLightbox();
      if (e.key === "ArrowRight")  showNextImage();
      if (e.key === "ArrowLeft")   showPrevImage();
    }
    if (enquiryModal.classList.contains("open") && e.key === "Escape") {
      closeEnquiryModal();
    }
  });

  /* -------------------------------------------------------
     9. ENQUIRY MODAL
  ------------------------------------------------------- */
  function openEnquiryModal() {
    enquiryModal.classList.add("open");
    enquiryModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeEnquiryModal() {
    enquiryModal.classList.remove("open");
    enquiryModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  enquiryBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      closeMenu();
      openEnquiryModal();
    });
  });

  closeModalBtns.forEach(function (btn) {
    btn.addEventListener("click", closeEnquiryModal);
  });

  /* -------------------------------------------------------
     10. ROOM CARD INTERACTIONS
  ------------------------------------------------------- */
  roomButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const card = button.closest(".room-card");
      if (!card) return;

      const roomName = card.getAttribute("data-room") || "this room";
      openEnquiryModal();

      const modalTitle = enquiryModal.querySelector(".modal-title");
      if (modalTitle) modalTitle.textContent = roomName + " — Enquire Now";
    });
  });

  /* -------------------------------------------------------
     11. RESET MODAL TITLE WHEN CLOSED
  ------------------------------------------------------- */
  enquiryModal.addEventListener("transitionend", function () {
    if (!enquiryModal.classList.contains("open")) {
      const modalTitle = enquiryModal.querySelector(".modal-title");
      if (modalTitle) modalTitle.textContent = "Plan Your Stay";
    }
  });

  /* -------------------------------------------------------
     12. INITIAL CALL
  ------------------------------------------------------- */
  handleScroll();

});