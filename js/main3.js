(function() {
  "use strict";

  const header = document.getElementById("header");
  const logoText = document.getElementById("logoText");
  const slider = document.getElementById("slider");
  const navItems = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".page");
  const progressEl = document.getElementById("progress");
  const arrowLeft = document.getElementById("arrowLeft");
  const arrowRight = document.getElementById("arrowRight");

  const slides = Array.from(slider.querySelectorAll(".slide"));
  const TOTAL = slides.length;

  // Crear progress dots
  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "progress-dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goToSlide(i));
    progressEl.appendChild(dot);
  });

  let currentSlide = 0;
  let targetX = 0;
  let rafId = null;
  let idleTimer = null;

  /* Typewriter */
  function typewriter() {
    const spans = logoText.querySelectorAll("span");
    const line1 = "carmona";
    const line2 = "perez marino";
    let idx = 0;
    let line = 1;

    function type() {
      if (line === 1) {
        if (idx < line1.length) {
          spans[0].textContent += line1[idx++];
          setTimeout(type, 60);
        } else {
          idx = 0;
          line = 2;
          setTimeout(type, 200);
        }
      } else if (line === 2) {
        if (idx < line2.length) {
          spans[1].textContent += line2[idx++];
          setTimeout(type, 60);
        }
      }
    }
    type();
  }

  /* RAF Loop para scroll suave */
  function rafLoop() {
    const diff = targetX - slider.scrollLeft;
    if (Math.abs(diff) < 0.6) {
      slider.scrollLeft = targetX;
      rafId = null;
      return;
    }
    slider.scrollLeft += diff * 0.2;
    rafId = requestAnimationFrame(rafLoop);
  }

  /* Snap al slide más cercano */
  function snapNearest() {
    const nearest = Math.round(slider.scrollLeft / window.innerWidth);
    currentSlide = Math.max(0, Math.min(TOTAL - 1, nearest));
    targetX = currentSlide * window.innerWidth;
    if (!rafId) rafId = requestAnimationFrame(rafLoop);
    updateProgress();
  }

  /* Actualizar progress dots */
  function updateProgress() {
    const dots = progressEl.querySelectorAll(".progress-dot");
    dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
  }

  /* Ir a slide específico */
  function goToSlide(index) {
    const obrasPage = document.getElementById("obras");
    if (!obrasPage.classList.contains("page--active")) return;

    currentSlide = Math.max(0, Math.min(TOTAL - 1, index));
    targetX = currentSlide * window.innerWidth;
    if (!rafId) rafId = requestAnimationFrame(rafLoop);
    updateProgress();
  }

  /* Wheel event */
  window.addEventListener("wheel", (e) => {
    const obrasPage = document.getElementById("obras");
    if (!obrasPage.classList.contains("page--active")) return;

    e.preventDefault();
    targetX = Math.max(0, Math.min((TOTAL - 1) * window.innerWidth,
      targetX + e.deltaY * 2.2));

    if (!rafId) rafId = requestAnimationFrame(rafLoop);

    // Header desaparece al scrollear
    header.classList.add("scrolled");

    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      snapNearest();
      // Header reaparece al dejar de scrollear
      header.classList.remove("scrolled");
    }, 180);
  }, { passive: false });

  /* Keyboard */
  document.addEventListener("keydown", (e) => {
    const obrasPage = document.getElementById("obras");
    if (!obrasPage.classList.contains("page--active")) return;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    }
  });

  /* Header scroll */
  window.addEventListener("scroll", () => {
    const obrasPage = document.getElementById("obras");
    const isObras = obrasPage.classList.contains("page--active");

    // Solo aplicar efecto scroll si no estamos en Obras
    if (!isObras && window.scrollY > 50) {
      header.classList.add("scrolled");
    } else if (!isObras || window.scrollY <= 50) {
      header.classList.remove("scrolled");
    }
  });

  /* Click en slides para ver detalle */
  slides.forEach((slide, idx) => {
    slide.style.cursor = "pointer";
    slide.addEventListener("click", () => showProjectDetail(idx));
  });

  /* Mostrar detalle del proyecto */
  function showProjectDetail(idx) {
    const obrasPage = document.getElementById("obras");
    if (!obrasPage.classList.contains("page--active")) return;

    const PROJECTS = [
      {
        name: "Casa Bosque",
        cat: "obra nueva",
        year: "2024",
        description: "Proyecto de vivienda unifamiliar en contexto de bosque. Un proyecto que dialoga con el paisaje natural existente.",
        images: [
          "img/casa-bosque/3.jpg", "img/casa-bosque/6.jpg", "img/casa-bosque/15.jpg", "img/casa-bosque/16.jpg",
          "img/casa-bosque/17.jpg", "img/casa-bosque/23.jpg", "img/casa-bosque/24.jpg", "img/casa-bosque/28.jpg",
          "img/casa-bosque/33.jpg", "img/casa-bosque/34.jpg", "img/casa-bosque/35.jpg", "img/casa-bosque/39.jpg",
          "img/casa-bosque/40.jpg", "img/casa-bosque/47.jpg", "img/casa-bosque/48.jpg", "img/casa-bosque/50.jpg",
          "img/casa-bosque/53.jpg", "img/casa-bosque/54.jpg", "img/casa-bosque/55.jpg", "img/casa-bosque/58.jpg",
          "img/casa-bosque/61.jpg", "img/casa-bosque/72.jpg", "img/casa-bosque/81.jpg", "img/casa-bosque/93.jpg",
          "img/casa-bosque/104.jpg"
        ]
      },
      {
        name: "Casa San Benito",
        cat: "remodelación",
        year: "2023",
        description: "Remodelación integral de vivienda histórica. Respeto por la estructura existente con intervenciones contemporáneas.",
        images: [
          "img/casa-san-benito/3.jpg", "img/casa-san-benito/5.jpg", "img/casa-san-benito/9.jpg", "img/casa-san-benito/11.jpg",
          "img/casa-san-benito/13.jpg", "img/casa-san-benito/14.jpg", "img/casa-san-benito/16.jpg", "img/casa-san-benito/30.jpg",
          "img/casa-san-benito/33.jpg", "img/casa-san-benito/43.jpg", "img/casa-san-benito/44.jpg", "img/casa-san-benito/52.jpg",
          "img/casa-san-benito/54.jpg", "img/casa-san-benito/57.jpg", "img/casa-san-benito/61.jpg", "img/casa-san-benito/65-5.jpg",
          "img/casa-san-benito/68.jpg", "img/casa-san-benito/75.jpg", "img/casa-san-benito/81.jpg", "img/casa-san-benito/83.jpg",
          "img/casa-san-benito/84.jpg", "img/casa-san-benito/92.jpg", "img/casa-san-benito/97.jpg", "img/casa-san-benito/98.jpg",
          "img/casa-san-benito/99.jpg"
        ]
      },
      {
        name: "Edificio Varese II",
        cat: "obra nueva",
        year: "2024",
        description: "Edificio residencial de viviendas múltiples. Un proyecto que busca mejorar la densidad urbana con calidad.",
        images: [
          "img/edificio-varese-ii/1.jpg", "img/edificio-varese-ii/2.jpg", "img/edificio-varese-ii/3.jpg", "img/edificio-varese-ii/9.jpg",
          "img/edificio-varese-ii/11.jpg", "img/edificio-varese-ii/12.jpg", "img/edificio-varese-ii/15.jpg", "img/edificio-varese-ii/19.jpg",
          "img/edificio-varese-ii/24.jpg", "img/edificio-varese-ii/25.jpg", "img/edificio-varese-ii/30.jpg", "img/edificio-varese-ii/35.jpg",
          "img/edificio-varese-ii/40.jpg", "img/edificio-varese-ii/45.jpg", "img/edificio-varese-ii/46.jpg", "img/edificio-varese-ii/51.jpg",
          "img/edificio-varese-ii/55.jpg", "img/edificio-varese-ii/57.jpg", "img/edificio-varese-ii/60.jpg", "img/edificio-varese-ii/62.jpg",
          "img/edificio-varese-ii/68.jpg", "img/edificio-varese-ii/70.jpg", "img/edificio-varese-ii/73.jpg", "img/edificio-varese-ii/75.jpg",
          "img/edificio-varese-ii/79.jpg"
        ]
      }
    ];

    const project = PROJECTS[idx];
    const detail = document.getElementById("project-detail");
    const detailSlider = document.getElementById("detailSlider");
    const titleEl = document.getElementById("projectTitle");

    // Dividir el nombre en dos partes: primera palabra (light) y resto (bold)
    const parts = project.name.split(" ");
    const firstPart = parts[0];
    const restPart = parts.slice(1).join(" ");
    titleEl.innerHTML = `<span class="title-light">${firstPart}</span> <span class="title-bold">${restPart}</span>`;

    document.getElementById("projectDescription").textContent = project.description;

    detailSlider.innerHTML = project.images.map(img =>
      `<img src="${img}" alt="${project.name}" class="detail-image" loading="lazy" />`
    ).join("");

    detail.style.display = "block";

    // Controles de scroll para el carrusel de detalle
    const detailScrollHandler = (e) => {
      if (!detail.classList.contains("visible")) return;
      e.preventDefault();
      detailSlider.scrollBy({ left: e.deltaY * 0.8, behavior: "smooth" });
    };

    const detailKeyHandler = (e) => {
      if (!detail.classList.contains("visible")) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        detailSlider.scrollBy({ left: 300, behavior: "smooth" });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        detailSlider.scrollBy({ left: -300, behavior: "smooth" });
      }
    };

    detail.classList.add("visible");
    window.addEventListener("wheel", detailScrollHandler, { passive: false });
    window.addEventListener("keydown", detailKeyHandler);

    // Scroll suave hacia el detalle
    setTimeout(() => {
      const start = window.scrollY;
      const target = detail.offsetTop;
      const distance = target - start;
      const duration = 1000; // 1 segundo
      let startTime = null;

      function smoothScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing: cubic-in-out
        const easeProgress = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, start + distance * easeProgress);

        if (progress < 1) {
          requestAnimationFrame(smoothScroll);
        }
      }

      requestAnimationFrame(smoothScroll);
    }, 100);
  }

  /* Volver a obras */
  document.getElementById("btnBackToWorks").addEventListener("click", () => {
    const detail = document.getElementById("project-detail");
    detail.classList.remove("visible");

    const obrasPage = document.getElementById("obras");
    const start = window.scrollY;
    const target = obrasPage.offsetTop;
    const distance = target - start;
    const duration = 1000;
    let startTime = null;

    function smoothScroll(currentTime) {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, start + distance * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(smoothScroll);
      } else {
        detail.style.display = "none";
      }
    }

    requestAnimationFrame(smoothScroll);
  });

  /* Arrows */
  arrowLeft.addEventListener("click", () => goToSlide(currentSlide - 1));
  arrowRight.addEventListener("click", () => goToSlide(currentSlide + 1));

  /* Navigation */
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const section = item.getAttribute("data-section");
      navItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      pages.forEach(p => p.classList.remove("page--active"));
      document.getElementById(section).classList.add("page--active");

      window.scrollTo(0, 0);
      currentSlide = 0;
      targetX = 0;

      // En Obras, header siempre transparente. En otras, vuelve a blanco
      if (section === "obras") {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  });

  /* Init */
  typewriter();
})();
