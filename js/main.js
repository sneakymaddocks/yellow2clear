/* =====================================================================
   main.js — page behaviour. Reads everything from config.js and cars.js.
   ===================================================================== */
(function () {
  "use strict";

  const money = (n) => `${PRICES.currency}${n}`;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Contact links & business details ---------- */
  const telHref = `tel:+${BUSINESS.phoneIntl}`;
  const waHref = (text) => `https://wa.me/${BUSINESS.phoneIntl}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  const defaultWaText = `Hi, I'd like to book headlight restoration. My car is: ______. My postcode is: ______.`;

  $$("[data-link='tel']").forEach((a) => (a.href = telHref));
  $$("[data-link='wa']").forEach((a) => (a.href = waHref(defaultWaText)));
  $$("[data-link='mail']").forEach((a) => {
    if (BUSINESS.email) a.href = `mailto:${BUSINESS.email}`;
    else (a.closest("p") || a).remove();
  });
  $$("[data-biz]").forEach((el) => {
    const v = BUSINESS[el.dataset.biz];
    if (v !== undefined && v !== "") el.textContent = v;
  });
  $$("[data-price]").forEach((el) => {
    const v = PRICES.default[el.dataset.price];
    if (v !== undefined) el.textContent = money(v);
  });
  document.title = `${BUSINESS.name} | Mobile Headlight Restoration ${BUSINESS.baseArea}`;
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Before/after slider component ---------- */
  function createSlider({ before, after, caption }, startPos = 50, eager = false) {
    const load = eager ? "eager" : "lazy";
    const el = document.createElement("div");
    el.className = "ba";
    el.style.setProperty("--pos", startPos + "%");
    el.innerHTML = `
      <img class="ba__after" src="${after}" alt="After restoration${caption ? ": " + caption : ""}" loading="${load}" decoding="async">
      <div class="ba__before-wrap"><img class="ba__before" src="${before}" alt="Before restoration${caption ? ": " + caption : ""}" loading="${load}" decoding="async"></div>
      <input class="ba__range" type="range" min="0" max="100" value="${startPos}" aria-label="Slide to compare before and after">
      <div class="ba__handle" aria-hidden="true"></div>
      <span class="ba__label ba__label--before" aria-hidden="true">Before</span>
      <span class="ba__label ba__label--after" aria-hidden="true">After</span>`;
    const range = $(".ba__range", el);
    range.addEventListener("input", () => el.style.setProperty("--pos", range.value + "%"));
    return el;
  }

  /* ---------- Hero slider ---------- */
  if (GALLERY.length) $("#heroSlider").appendChild(createSlider(GALLERY[0], 45, true));

  /* ---------- Gallery ---------- */
  const grid = $("#galleryGrid");
  const lightbox = $("#lightbox");
  GALLERY.forEach((item, i) => {
    const card = document.createElement("figure");
    card.className = "gallery__item card";
    card.style.margin = "0";
    card.appendChild(createSlider(item));
    const meta = document.createElement("figcaption");
    meta.className = "gallery__meta";
    meta.innerHTML = `
      <p class="gallery__caption">${item.caption || "Before & after"}</p>
      <button type="button" class="gallery__expand" data-index="${i}">
        <svg class="icon" aria-hidden="true"><use href="#i-expand"/></svg> Enlarge
      </button>`;
    card.appendChild(meta);
    grid.appendChild(card);
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".gallery__expand");
    if (!btn) return;
    const item = GALLERY[Number(btn.dataset.index)];
    const holder = $("#lightboxSlider");
    holder.innerHTML = "";
    holder.appendChild(createSlider(item));
    $("#lightboxCaption").textContent = item.caption || "";
    if (typeof lightbox.showModal === "function") lightbox.showModal();
    else lightbox.setAttribute("open", "");
  });
  $("#lightboxClose").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });

  /* ---------- Areas ---------- */
  const chips = (list, target) => {
    const ul = $(target);
    [...new Set(list)].forEach((a) => { const li = document.createElement("li"); li.textContent = a; ul.appendChild(li); });
  };
  chips(AREAS.primary, "#areasPrimary");
  chips(AREAS.extended, "#areasExtended");

  /* ---------- Quote tool ---------- */
  const makeSel = $("#make");
  const modelSel = $("#model");
  const otherWrap = $("#otherWrap");
  const otherInput = $("#otherModel");
  const amountEl = $("#quoteAmount");
  const carEl = $("#quoteCar");
  const waBtn = $("#quoteWa");
  const OTHER = "__other__";

  Object.keys(CARS).sort((a, b) => a.localeCompare(b)).forEach((make) => {
    makeSel.appendChild(new Option(make, make));
  });
  makeSel.appendChild(new Option("Other / not listed", OTHER));

  function populateModels(make) {
    modelSel.innerHTML = "";
    if (make === OTHER) {
      modelSel.disabled = true;
      modelSel.appendChild(new Option("Enter details below", ""));
      otherWrap.classList.remove("field--hidden");
      otherInput.focus();
      return;
    }
    otherWrap.classList.add("field--hidden");
    modelSel.disabled = false;
    modelSel.appendChild(new Option("Choose a model…", "", true, true));
    modelSel.options[0].disabled = true;
    (CARS[make] || []).forEach((m) => modelSel.appendChild(new Option(m, m)));
    modelSel.appendChild(new Option("Other / not listed", OTHER));
  }

  function currentCar() {
    const make = makeSel.value;
    const model = modelSel.value;
    if (!make) return null;
    if (make === OTHER || model === OTHER) {
      const typed = otherInput.value.trim();
      if (make === OTHER) return typed ? { label: typed, key: null } : null;
      return { label: typed ? `${make} ${typed}` : `${make} (other model)`, key: null };
    }
    if (!model) return { label: make, key: null, incomplete: true };
    return { label: `${make} ${model}`, key: `${make}|${model}` };
  }

  function priceFor(car, qty) {
    const table = (car && car.key && PRICES.overrides[car.key]) || PRICES.default;
    return table[qty];
  }

  function updateQuote() {
    const qty = $("input[name='qty']:checked").value;
    const car = currentCar();
    const price = priceFor(car, qty);
    const qtyLabel = qty === "both" ? "both headlights" : "one headlight";
    amountEl.textContent = money(price);

    if (!car) {
      carEl.textContent = makeSel.value === OTHER ? "Type your make and model above" : "Select your car above";
    } else if (car.incomplete) {
      carEl.textContent = `${car.label}: choose a model`;
    } else {
      carEl.textContent = `${car.label}, ${qtyLabel}`;
    }

    const carText = car && !car.incomplete ? car.label : "______";
    const msg = `Hi, I'd like to book headlight restoration for ${qtyLabel} on my ${carText} (${money(price)}). My postcode is: ______. When are you free?`;
    waBtn.href = waHref(msg);
  }

  makeSel.addEventListener("change", () => { populateModels(makeSel.value); updateQuote(); });
  modelSel.addEventListener("change", () => {
    if (modelSel.value === OTHER) { otherWrap.classList.remove("field--hidden"); otherInput.focus(); }
    else otherWrap.classList.add("field--hidden");
    updateQuote();
  });
  otherInput.addEventListener("input", updateQuote);
  $$("input[name='qty']").forEach((r) => r.addEventListener("change", updateQuote));
  $("#quoteForm").addEventListener("submit", (e) => e.preventDefault());
  updateQuote();

  /* ---------- Mobile nav ---------- */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- Structured data (LocalBusiness) ---------- */
  const ld = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: BUSINESS.name,
    description: BUSINESS.tagline,
    telephone: `+${BUSINESS.phoneIntl}`,
    email: BUSINESS.email,
    url: BUSINESS.siteUrl,
    image: new URL("images/placeholder-after-1.svg", location.href).href,
    priceRange: `${money(PRICES.default.single)}-${money(PRICES.default.both)}`,
    areaServed: [...AREAS.primary, ...AREAS.extended].map((n) => ({ "@type": "City", name: n })),
    address: { "@type": "PostalAddress", addressLocality: BUSINESS.baseArea, addressCountry: "GB" },
    openingHours: BUSINESS.hours,
    makesOffer: [
      { "@type": "Offer", name: "Single headlight restoration", price: PRICES.default.single, priceCurrency: "GBP" },
      { "@type": "Offer", name: "Both headlights restoration", price: PRICES.default.both, priceCurrency: "GBP" },
    ],
  };
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(ld);
  document.head.appendChild(s);
})();
