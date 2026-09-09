/* =========================================================
   LITTLESTU — script.js
   Vanilla JS. Mendukung mouse, keyboard, dan layar sentuh.
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------
     0. GANTI DI SINI: link WhatsApp, Shopee, TikTok Shop
     --------------------------------------------------- */
  const LINKS = {
    whatsapp: "https://wa.me/6281234567890", // ganti nomor WA toko
    shopee: "https://shopee.co.id/littlestu", // ganti link toko Shopee
    tiktokshop: "https://www.tiktok.com/@littlestu", // ganti link TikTok Shop
  };
  document.getElementById("shopeeHeroBtn")?.setAttribute("href", LINKS.shopee);

  /* ---------------------------------------------------
     1. Header: bayangan saat scroll
     --------------------------------------------------- */
  const header = document.getElementById("siteHeader");
  const backToTop = document.getElementById("backToTop");

  function onScroll() {
    const scrolled = window.scrollY > 8;
    header.classList.toggle("is-scrolled", scrolled);
    backToTop.hidden = window.scrollY < 500;
    backToTop.classList.toggle("is-visible", window.scrollY >= 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------------------------------------------------
     2. Menu hamburger (mobile drawer)
     --------------------------------------------------- */
  const menuToggle = document.getElementById("menuToggle");
  const drawer = document.getElementById("mobileDrawer");
  const drawerBackdrop = document.getElementById("drawerBackdrop");
  const drawerClose = document.getElementById("drawerClose");

  function openDrawer() {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    drawerBackdrop.hidden = false;
    requestAnimationFrame(() => drawerBackdrop.classList.add("is-visible"));
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    drawerClose.focus();
  }
  function closeDrawer() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    drawerBackdrop.classList.remove("is-visible");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    setTimeout(() => {
      drawerBackdrop.hidden = true;
    }, 250);
    menuToggle.focus();
  }
  menuToggle.addEventListener("click", () => {
    drawer.classList.contains("is-open") ? closeDrawer() : openDrawer();
  });
  drawerClose.addEventListener("click", closeDrawer);
  drawerBackdrop.addEventListener("click", closeDrawer);
  drawer
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open"))
      closeDrawer();
  });

  /* ---------------------------------------------------
     3. Pencarian produk
     --------------------------------------------------- */
  const searchToggle = document.getElementById("searchToggle");
  const searchPanel = document.getElementById("searchPanel");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");
  const searchResultCount = document.getElementById("searchResultCount");

  function openSearch() {
    searchPanel.hidden = false;
    searchToggle.setAttribute("aria-expanded", "true");
    searchInput.focus();
  }
  function closeSearch() {
    searchPanel.hidden = true;
    searchToggle.setAttribute("aria-expanded", "false");
    searchInput.value = "";
    applyFilters();
  }
  searchToggle.addEventListener("click", () => {
    searchPanel.hidden ? openSearch() : closeSearch();
  });
  searchClose.addEventListener("click", closeSearch);

  /* ---------------------------------------------------
     4. Filter kategori + pencarian gabungan
     --------------------------------------------------- */
  const categoryButtons = document.querySelectorAll(".category-item");
  const productCards = document.querySelectorAll(".product-card");
  const filterNote = document.getElementById("filterNote");
  const noResults = document.getElementById("noResults");
  let activeCategory = null;

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    productCards.forEach((card) => {
      const cats = card.dataset.category || "";
      const name = card.dataset.name || "";
      const matchesCategory = !activeCategory || cats.includes(activeCategory);
      const matchesQuery = !query || name.includes(query);
      const visible = matchesCategory && matchesQuery;
      card.style.display = visible ? "" : "none";
      if (visible) visibleCount++;
    });

    noResults.hidden = visibleCount !== 0;

    if (query) {
      searchResultCount.textContent = `${visibleCount} produk ditemukan untuk "${query}"`;
    } else {
      searchResultCount.textContent = "";
    }

    if (activeCategory) {
      const label =
        activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
      filterNote.textContent = `Menampilkan kategori: ${label}`;
    } else {
      filterNote.textContent = "Menampilkan semua produk";
    }
  }

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      const isActive = activeCategory === filter;
      activeCategory = isActive ? null : filter;
      categoryButtons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      if (!isActive) btn.setAttribute("aria-pressed", "true");
      applyFilters();
      document
        .getElementById("new-arrivals")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  let searchDebounce;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(applyFilters, 150);
  });

  /* ---------------------------------------------------
     5. Tombol favorit
     --------------------------------------------------- */
  const favCountEl = document.getElementById("favCount");
  const favToggle = document.getElementById("favToggle");
  let favCount = 0;

  document.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pressed = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", String(!pressed));
      favCount += pressed ? -1 : 1;
      favCountEl.textContent = String(favCount);
      favCountEl.hidden = favCount === 0;
      favToggle.setAttribute("aria-label", `Lihat favorit (${favCount} item)`);

      const productName =
        btn.closest(".product-card")?.querySelector("h3")?.textContent ||
        "Produk";
      showToast(
        pressed
          ? `${productName} dihapus dari favorit`
          : `${productName} ditambahkan ke favorit`,
      );
    });
  });

  /* ---------------------------------------------------
     6. Footer accordion (mobile)
     --------------------------------------------------- */
  document.querySelectorAll(".footer-col-toggle").forEach((toggle) => {
    const list = toggle.nextElementSibling;
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      list.classList.toggle("is-open", !expanded);
    });
  });

  /* ---------------------------------------------------
     7. Validasi form newsletter
     --------------------------------------------------- */
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterMessage = document.getElementById("newsletterMessage");

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = newsletterEmail.value.trim();
    newsletterMessage.classList.remove("is-error", "is-success");

    if (!value) {
      newsletterMessage.textContent =
        "Masukkan alamat email kamu terlebih dahulu.";
      newsletterMessage.classList.add("is-error");
      newsletterEmail.focus();
      return;
    }
    if (!isValidEmail(value)) {
      newsletterMessage.textContent =
        "Format email belum sesuai. Contoh: nama@email.com";
      newsletterMessage.classList.add("is-error");
      newsletterEmail.focus();
      return;
    }
    newsletterMessage.textContent =
      "Terima kasih! Email kamu berhasil didaftarkan.";
    newsletterMessage.classList.add("is-success");
    newsletterForm.reset();
  });

  /* ---------------------------------------------------
     8. Toast sederhana
     --------------------------------------------------- */
  const toast = document.getElementById("toast");
  let toastTimeout;
  function showToast(message) {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    toastTimeout = setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => {
        toast.hidden = true;
      }, 250);
    }, 2200);
  }

  /* ---------------------------------------------------
     9. Animasi reveal saat elemen masuk viewport
     --------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------------------------------------------
     10. Tahun footer otomatis
     --------------------------------------------------- */
  document.getElementById("footerYear").textContent = new Date().getFullYear();

  /* ---------------------------------------------------
     11. Product Detail Modal (bottom sheet)
     --------------------------------------------------- */
  const modal = document.getElementById("productModal");
  const modalOverlay = document.getElementById("productModalOverlay");
  const modalClose = document.getElementById("productModalClose");
  const modalTrack = document.getElementById("productModalTrack");
  const modalDots = document.getElementById("sliderDots");
  const modalPrev = document.getElementById("sliderPrev");
  const modalNext = document.getElementById("sliderNext");
  const modalTitle = document.getElementById("productModalTitle");
  const modalPrice = document.getElementById("productModalPrice");
  const modalColors = document.getElementById("productModalColors");
  const modalSize = document.getElementById("productModalSize");
  const modalDesc = document.getElementById("productModalDesc");
  const modalShopee = document.getElementById("productModalShopee");
  const modalTiktok = document.getElementById("productModalTiktok");

  let modalImages = [];
  let modalIndex = 0;
  let lastFocusedEl = null;

  // Ubah "Nama:#hex,Nama2:#hex2" jadi [{name:"Nama", hex:"#hex"}, ...]
  function parseColors(raw) {
    if (!raw) return [];
    return raw
      .split(",")
      .map((pair) => {
        const [name, hex] = pair.split(":").map((s) => s.trim());
        return { name, hex };
      })
      .filter((c) => c.name && c.hex);
  }

  function renderSlides(images) {
    modalTrack.innerHTML = "";
    modalDots.innerHTML = "";

    images.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src.trim();
      img.alt = `Foto produk ${modalTitle.textContent} ${i + 1}`;
      img.loading = "lazy";
      modalTrack.appendChild(img);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Lihat foto ${i + 1}`);
      dot.addEventListener("click", () => goToSlide(i));
      modalDots.appendChild(dot);
    });

    const onlyOneImage = images.length <= 1;
    modalPrev.hidden = onlyOneImage;
    modalNext.hidden = onlyOneImage;
    modalDots.hidden = onlyOneImage;
  }

  function goToSlide(index) {
    modalIndex = (index + modalImages.length) % modalImages.length;
    modalTrack.style.transform = `translateX(-${modalIndex * 100}%)`;
    modalDots.querySelectorAll("button").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === modalIndex);
    });
  }

  function openProductModal(data) {
    lastFocusedEl = document.activeElement;

    modalTitle.textContent = data.name || "";
    modalPrice.textContent = data.price || "";
    modalSize.textContent = data.size || "";
    modalDesc.textContent = data.desc || "";
    modalShopee.href = data.shopee || "#";
    modalTiktok.href = data.tiktok || "#";

    modalColors.innerHTML = "";
    parseColors(data.colors).forEach((c) => {
      const item = document.createElement("span");
      item.className = "product-modal-color-item";
      item.innerHTML = `<span class="dot" style="--dot:${c.hex}"></span><span>${c.name}</span>`;
      modalColors.appendChild(item);
    });

    modalImages = (data.images || "").split(",").filter(Boolean);
    if (modalImages.length === 0)
      modalImages = ["https://placehold.co/500x620/e4d8c7/3e2f23?text=Produk"];
    renderSlides(modalImages);
    goToSlide(0);

    modal.hidden = false;
    modalOverlay.hidden = false;
    requestAnimationFrame(() => {
      modal.classList.add("is-open");
      modalOverlay.classList.add("is-visible");
    });
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalClose.focus();
  }

  function closeProductModal() {
    modal.classList.remove("is-open");
    modalOverlay.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    setTimeout(() => {
      modal.hidden = true;
      modalOverlay.hidden = true;
    }, 350);
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  // Buka modal dari setiap tombol "Lihat Detail"
  document.querySelectorAll(".js-product-detail").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openProductModal({
        name: btn.dataset.name,
        price: btn.dataset.price,
        images: btn.dataset.images,
        colors: btn.dataset.colors,
        size: btn.dataset.size,
        desc: btn.dataset.desc,
        shopee: btn.dataset.shopee,
        tiktok: btn.dataset.tiktok,
      });
    });
  });

  modalClose.addEventListener("click", closeProductModal);
  modalOverlay.addEventListener("click", closeProductModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open"))
      closeProductModal();
  });

  modalPrev.addEventListener("click", () => goToSlide(modalIndex - 1));
  modalNext.addEventListener("click", () => goToSlide(modalIndex + 1));

  // Navigasi keyboard saat modal terbuka
  modal.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goToSlide(modalIndex - 1);
    if (e.key === "ArrowRight") goToSlide(modalIndex + 1);
  });

  // Swipe gesture pada slider (mobile)
  let touchStartX = 0;
  let touchDeltaX = 0;
  const sliderEl = document.getElementById("productModalSlider");

  sliderEl.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    },
    { passive: true },
  );

  sliderEl.addEventListener(
    "touchmove",
    (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    },
    { passive: true },
  );

  sliderEl.addEventListener("touchend", () => {
    const threshold = 40;
    if (touchDeltaX > threshold) goToSlide(modalIndex - 1);
    else if (touchDeltaX < -threshold) goToSlide(modalIndex + 1);
    touchDeltaX = 0;
  });

  // ===== FEATURED CAROUSEL =====

  const featuredSlider = document.querySelector(".featured-slider");
  const featuredTrack = document.querySelector(".featured-track");
  const featuredSlides = document.querySelectorAll(".featured-slide");

  if (featuredSlider && featuredTrack && featuredSlides.length > 1) {
    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    // Membuat tombol kiri
    const prevButton = document.createElement("button");
    prevButton.className = "featured-arrow featured-arrow--prev";
    prevButton.innerHTML = "‹";
    prevButton.type = "button";
    prevButton.setAttribute("aria-label", "Slide sebelumnya");

    // Membuat tombol kanan
    const nextButton = document.createElement("button");
    nextButton.className = "featured-arrow featured-arrow--next";
    nextButton.innerHTML = "›";
    nextButton.type = "button";
    nextButton.setAttribute("aria-label", "Slide berikutnya");

    featuredSlider.appendChild(prevButton);
    featuredSlider.appendChild(nextButton);

    // Membuat indikator bulatan
    const dotsContainer = document.createElement("div");
    dotsContainer.className = "featured-dots";

    featuredSlides.forEach((slide, index) => {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.setAttribute("aria-label", `Buka slide ${index + 1}`);

      if (index === 0) {
        dot.classList.add("active");
      }

      dot.addEventListener("click", () => {
        currentSlide = index;
        updateFeaturedSlider();
      });

      dotsContainer.appendChild(dot);
    });

    featuredSlider.appendChild(dotsContainer);

    const dots = dotsContainer.querySelectorAll("button");

    function updateFeaturedSlider() {
      featuredTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide);
      });
    }

    // Tombol berikutnya
    nextButton.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % featuredSlides.length;
      updateFeaturedSlider();
    });

    // Tombol sebelumnya
    prevButton.addEventListener("click", () => {
      currentSlide =
        (currentSlide - 1 + featuredSlides.length) % featuredSlides.length;

      updateFeaturedSlider();
    });

    // Swipe menggunakan jari
    featuredSlider.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.touches[0].clientX;
      },
      { passive: true },
    );

    featuredSlider.addEventListener(
      "touchend",
      (event) => {
        touchEndX = event.changedTouches[0].clientX;

        const swipeDistance = touchStartX - touchEndX;

        if (Math.abs(swipeDistance) < 50) return;

        if (swipeDistance > 0) {
          currentSlide = (currentSlide + 1) % featuredSlides.length;
        } else {
          currentSlide =
            (currentSlide - 1 + featuredSlides.length) % featuredSlides.length;
        }

        updateFeaturedSlider();
      },
      { passive: true },
    );
  }
})();
