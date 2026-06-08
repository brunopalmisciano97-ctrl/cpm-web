/* ============================================================
   carmona perez marino — interacciones
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. Render de obras (split panel) ---------- */
  var projList   = document.getElementById("projList");
  var activeImg  = document.getElementById("activeImg");
  var activeCaption = document.getElementById("activeCaption");
  var currentActive = null;

  function setActive(item, work) {
    if (currentActive) currentActive.classList.remove("is-active");
    item.classList.add("is-active");
    currentActive = item;

    if (activeImg) {
      activeImg.classList.remove("is-loaded");
      var next = new Image();
      next.onload = function () {
        activeImg.src = next.src;
        activeImg.alt = work.name;
        void activeImg.offsetWidth; // reflow
        activeImg.classList.add("is-loaded");
      };
      next.src = work.img;
    }
    if (activeCaption) {
      var catMap = { "obra-nueva": "Obra nueva", "remodelacion": "Remodelación", "interiorismo": "Interiorismo" };
      activeCaption.textContent = work.name + " · " + (catMap[work.cat] || work.cat) + (work.year !== "—" ? " · " + work.year : "");
    }
  }

  if (projList && typeof WORKS !== "undefined" && Array.isArray(WORKS)) {
    // precarga todas las imágenes silenciosamente
    WORKS.forEach(function (w) { (new Image()).src = w.img; });

    projList.innerHTML = WORKS.map(function (w, i) {
      var catMap = { "obra-nueva": "Obra nueva", "remodelacion": "Remodelación", "interiorismo": "Interiorismo" };
      return (
        '<li class="proj-item reveal" data-cat="' + w.cat + '" data-idx="' + i + '">' +
          '<span class="proj-item__n">' + String(i + 1).padStart(2, "0") + "</span>" +
          '<span class="proj-item__name">' + w.name + "</span>" +
          '<span class="proj-item__cat">' + (catMap[w.cat] || w.cat) + "</span>" +
        "</li>"
      );
    }).join("");

    // activar el primero al cargar
    var firstItem = projList.querySelector(".proj-item");
    if (firstItem) setActive(firstItem, WORKS[0]);

    projList.addEventListener("click", function (e) {
      var item = e.target.closest(".proj-item");
      if (!item || item.classList.contains("proj-item--hidden")) return;
      setActive(item, WORKS[parseInt(item.getAttribute("data-idx"), 10)]);
    });
  }

  /* ---------- 2. Fotos del equipo (data-img → background) ---------- */
  document.querySelectorAll(".member__photo[data-img]").forEach(function (el) {
    el.style.backgroundImage = "url('" + el.getAttribute("data-img") + "')";
  });

  /* ---------- 3. Filtros de obras ---------- */
  var filters = document.getElementById("filters");
  if (filters) {
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      filters.querySelectorAll(".filter").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var f = btn.getAttribute("data-filter");
      var items = document.querySelectorAll(".proj-item");
      var firstVisible = null;
      items.forEach(function (t) {
        var show = f === "all" || t.getAttribute("data-cat") === f;
        t.classList.toggle("proj-item--hidden", !show);
        if (show && !firstVisible) firstVisible = t;
      });
      // activar el primero visible del filtro
      if (firstVisible) {
        var idx = parseInt(firstVisible.getAttribute("data-idx"), 10);
        setActive(firstVisible, WORKS[idx]);
      }
    });
  }

  /* ---------- 4. Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- 5. Hover en lista activa la imagen ---------- */
  if (projList) {
    projList.addEventListener("mouseover", function (e) {
      var item = e.target.closest(".proj-item");
      if (!item || item.classList.contains("proj-item--hidden")) return;
      var idx = parseInt(item.getAttribute("data-idx"), 10);
      setActive(item, WORKS[idx]);
    });
  }

  /* ---------- 6. Menú móvil ---------- */
  var menuBtn = document.getElementById("menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll("#nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 7. Toggle de idioma (placeholder preliminar) ---------- */
  var lang = document.getElementById("langToggle");
  if (lang) {
    lang.addEventListener("click", function () {
      lang.textContent = lang.textContent.trim().startsWith("ES") ? "EN/ES" : "ES/EN";
      // Versión preliminar: el contenido bilingüe se conecta más adelante.
    });
  }

  /* ---------- 8. Formulario de contacto (demo, no envía) ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      document.getElementById("formNote").hidden = false;
      form.querySelector("button").textContent = "Enviado ✓";
    });
  }
})();
