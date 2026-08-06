/* Home Sale - product profile page (product.html?id=...) */

const WA_FALLBACK = "971500000000";
const DATA_URL = "data/items.json";
const DEFAULT_PICKUP = DEFAULT_PICKUP_NOTE;
const PLACEHOLDER = IMG_PLACEHOLDER;

const root = document.getElementById("productRoot");
const lb = {
  el: document.getElementById("lightbox"),
  img: document.getElementById("lbImg"),
  close: document.getElementById("lbClose"),
  prev: document.getElementById("lbPrev"),
  next: document.getElementById("lbNext"),
  counter: document.getElementById("lbCounter"),
};

const buyBar = {
  el: document.getElementById("buyBar"),
  price: document.getElementById("buyBarPrice"),
  offerBtn: document.getElementById("btnOffer"),
  buyBtn: document.getElementById("btnBuy"),
};
const offerSheet = {
  backdrop: document.getElementById("offerBackdrop"),
  panel: document.getElementById("offerSheet"),
  close: document.getElementById("offerClose"),
  listedPrice: document.getElementById("offerListedPrice"),
  input: document.getElementById("offerPriceInput"),
  error: document.getElementById("offerError"),
  send: document.getElementById("offerSend"),
};

let currency = "Rs.";
let whatsapp = WA_FALLBACK;
let pickupNote = DEFAULT_PICKUP;
let allItems = [];
let galleryImages = [];
let currentIndex = 0;
let currentItem = null;

init();

async function init() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return renderError("No product selected.");

  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (data.meta) {
      currency = data.meta.currency || "Rs.";
      whatsapp = data.meta.whatsapp || WA_FALLBACK;
      pickupNote = data.meta.pickupNote || DEFAULT_PICKUP;
    }
    allItems = Array.isArray(data.items) ? data.items : [];
    const item = allItems.find((i) => i.id === id);
    if (!item) return renderError('Product "' + id + '" was not found.');
    renderProduct(item);
  } catch (err) {
    renderError("Could not load product data. Run a local server (see README). " + err.message);
  }

  setupLightbox();
  setupOfferSheet();
}

function renderError(msg) {
  document.title = "Not found - Home Sale";
  root.innerHTML = `
    <div class="state-msg">
      <h3>Product not available</h3>
      <p>${escapeHtml(msg)}</p>
      <p><a class="btn btn-primary" href="index.html">Back to catalog</a></p>
    </div>`;
}

function renderProduct(item) {
  document.title = item.title + " - Home Sale";
  currentItem = item;
  const status = (item.status || "Available").toLowerCase();
  const isSold = status === "sold";
  galleryImages = (item.images && item.images.length ? item.images : [PLACEHOLDER]).slice();
  const photoCount = item.images && item.images.length ? item.images.length : 1;
  const galleryCountHtml =
    photoCount > 0
      ? `<p class="gallery-count">${icon("gallery", { size: 16 })} ${escapeHtml(
          photoCountLabel(photoCount)
        )} available</p>`
      : "";

  const thumbs = galleryImages
    .map(
      (src, i) =>
        `<button class="thumb${i === 0 ? " active" : ""}" data-idx="${i}">
           <img src="${escapeAttr(src)}" alt="${escapeAttr(item.title)} ${i + 1}"
                onerror="this.onerror=null;this.src='${PLACEHOLDER}'" />
         </button>`
    )
    .join("");

  const specsRows = item.specs
    ? Object.entries(item.specs)
        .filter(([, v]) => String(v).trim())
        .map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(String(v))}</td></tr>`)
        .join("")
    : "";

  const waBtn = isSold
    ? `<button class="btn btn-disabled btn-lg" disabled>${icon("sold", { size: 20 })} Sold - inquiries closed</button>`
    : `<a class="btn btn-whatsapp btn-lg" href="${waHref(item)}" target="_blank" rel="noopener">${icon(
        "message",
        { size: 20 }
      )} Inquire on WhatsApp</a>`;

  const featuredTag = item.featured
    ? `<span class="featured-tag">${icon("featured", { size: 13 })} Featured</span>`
    : "";

  root.innerHTML = `
    <div class="product-layout">
      <div class="gallery-col">
        <div class="gallery-main" id="galleryMain">
          <img id="mainImage" src="${escapeAttr(galleryImages[0])}" alt="${escapeAttr(item.title)}"
               onerror="this.onerror=null;this.src='${PLACEHOLDER}'" />
          <span class="zoom-hint">${icon("search", { size: 16 })} Click to enlarge</span>
        </div>
        ${galleryCountHtml}
        <div class="thumbs" id="thumbs">${thumbs}</div>
      </div>

      <div class="product-info">
        <div class="product-meta-row">
          <span class="pill-category">${escapeHtml(item.category || "Other")}</span>
          <span class="status-inline status-${status}">${icon(statusIconName(item.status), {
    size: 14,
  })} ${escapeHtml(item.status || "Available")}</span>
          ${featuredTag}
        </div>
        <h1>${escapeHtml(item.title)}</h1>

        <div class="price-card">
          <div class="product-price">${escapeHtml(formatPriceDisplay(currency, item.price))}</div>
          <div class="price-card-cta">${waBtn}</div>
          <p class="price-card-note">${icon("location", { size: 16 })} ${escapeHtml(pickupNote)}</p>
        </div>

        <div class="section-block">
          <h2>Condition</h2>
          <p>${escapeHtml(item.condition || "Not specified")}</p>
        </div>

        <div class="section-block">
          <h2>Description</h2>
          <p>${escapeHtml(item.description || "No description provided.")}</p>
        </div>

        ${
          specsRows
            ? `<div class="section-block">
                 <h2>Specifications</h2>
                 <table class="specs-table"><tbody>${specsRows}</tbody></table>
               </div>`
            : ""
        }

        <div class="product-cta">
          ${waBtn}
          <a class="btn btn-outline btn-lg" href="index.html">${icon("back", { size: 20 })} Back to catalog</a>
        </div>
      </div>
    </div>
    ${similarSection(item)}`;

  wireGallery();
  wireSimilar();
  setupBuyBar(item, isSold);
}

/* ---------- Sticky buy bar + offer sheet ---------- */
function setupBuyBar(item, isSold) {
  if (!buyBar.el) return;

  if (isSold) {
    buyBar.el.classList.add("hidden");
    document.body.classList.remove("has-buy-bar");
    return;
  }

  buyBar.price.textContent = formatPriceDisplay(currency, item.price);
  buyBar.buyBtn.href = buyHref(item);
  buyBar.offerBtn.onclick = () => openOfferSheet(item);
  buyBar.el.classList.remove("hidden");
  document.body.classList.add("has-buy-bar");
}

function setupOfferSheet() {
  offerSheet.close.addEventListener("click", closeOfferSheet);
  offerSheet.backdrop.addEventListener("click", (e) => {
    if (e.target === offerSheet.backdrop) closeOfferSheet();
  });
  offerSheet.send.addEventListener("click", sendOffer);
  offerSheet.input.addEventListener("input", () => {
    offerSheet.error.classList.add("hidden");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && offerSheet.backdrop.classList.contains("open")) {
      closeOfferSheet();
    }
  });
}

function openOfferSheet(item) {
  offerSheet.listedPrice.textContent = formatPriceDisplay(currency, item.price);
  offerSheet.input.value = "";
  offerSheet.error.classList.add("hidden");
  offerSheet.backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => offerSheet.input.focus(), 50);
}

function closeOfferSheet() {
  offerSheet.backdrop.classList.remove("open");
  document.body.style.overflow = "";
}

function sendOffer() {
  const item = currentItem;
  if (!item) return;
  const raw = offerSheet.input.value;
  const offer = Number(raw);
  if (raw === "" || !isFinite(offer) || offer <= 0) {
    offerSheet.error.textContent = "Enter a valid offer amount.";
    offerSheet.error.classList.remove("hidden");
    offerSheet.input.focus();
    return;
  }
  window.open(offerHref(item, offer), "_blank", "noopener");
  closeOfferSheet();
}

function buyHref(item) {
  const priceLabel = formatPriceDisplay(currency, item.price);
  const msg =
    `Hi, I want to buy "${item.title}" listed for ${priceLabel}.\n` +
    `Product link: ${window.location.href}\n` +
    `Please confirm it's still available.`;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
}

function offerHref(item, offerAmount) {
  const priceLabel = formatPriceDisplay(currency, item.price);
  const offerLabel = formatPriceDisplay(currency, offerAmount);
  const msg =
    `Hi, I'd like to offer ${offerLabel} for "${item.title}" (listed at ${priceLabel}).\n` +
    `Product link: ${window.location.href}\n` +
    `Is that okay?`;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
}

function similarSection(item) {
  const inCategory = allItems.filter(
    (i) => i.id !== item.id && i.category === item.category
  );
  // Non-sold first, then sold; preserve order within groups
  const nonSold = inCategory.filter((i) => (i.status || "").toLowerCase() !== "sold");
  const sold = inCategory.filter((i) => (i.status || "").toLowerCase() === "sold");
  const similar = [...nonSold, ...sold].slice(0, 4);
  if (!similar.length) return "";

  const cards = similar
    .map((s) => {
      const img = (s.images && s.images[0]) || PLACEHOLDER;
      const st = (s.status || "Available").toLowerCase();
      return `
        <a class="similar-card" href="product.html?id=${encodeURIComponent(s.id)}">
          <div class="similar-media">
            <img src="${escapeAttr(img)}" alt="${escapeAttr(s.title)}" loading="lazy"
                 onerror="this.onerror=null;this.src='${PLACEHOLDER}'" />
            <span class="status-badge status-${st}">${icon(statusIconName(s.status), {
        size: 12,
      })} ${escapeHtml(s.status || "Available")}</span>
          </div>
          <div class="similar-body">
            <h3>${escapeHtml(s.title)}</h3>
            <div class="similar-price">${escapeHtml(formatPriceDisplay(currency, s.price))}</div>
          </div>
        </a>`;
    })
    .join("");

  return `
    <section class="similar-section">
      <h2 class="similar-heading">More in ${escapeHtml(item.category || "this category")}</h2>
      <div class="similar-grid">${cards}</div>
    </section>`;
}

function wireSimilar() {
  /* similar cards are plain links; nothing extra required */
}

function wireGallery() {
  const mainImage = document.getElementById("mainImage");
  const galleryMain = document.getElementById("galleryMain");
  const thumbEls = Array.from(document.querySelectorAll("#thumbs .thumb"));

  function select(idx) {
    currentIndex = idx;
    mainImage.src = galleryImages[idx];
    thumbEls.forEach((t, i) => t.classList.toggle("active", i === idx));
  }

  thumbEls.forEach((t) => t.addEventListener("click", () => select(Number(t.dataset.idx))));
  galleryMain.addEventListener("click", () => openLightbox(currentIndex));
}

/* ---------- Lightbox ---------- */
function setupLightbox() {
  lb.img.onerror = function () {
    this.onerror = null;
    this.src = PLACEHOLDER;
  };
  lb.close.addEventListener("click", closeLightbox);
  lb.prev.addEventListener("click", () => step(-1));
  lb.next.addEventListener("click", () => step(1));
  lb.el.addEventListener("click", (e) => {
    if (e.target === lb.el) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lb.el.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  });
}

function openLightbox(idx) {
  currentIndex = idx;
  updateLightbox();
  lb.el.classList.add("open");
  lb.el.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lb.el.classList.remove("open");
  lb.el.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function step(dir) {
  currentIndex = (currentIndex + dir + galleryImages.length) % galleryImages.length;
  updateLightbox();
  const thumbEls = document.querySelectorAll("#thumbs .thumb");
  thumbEls.forEach((t, i) => t.classList.toggle("active", i === currentIndex));
  const mainImage = document.getElementById("mainImage");
  if (mainImage) mainImage.src = galleryImages[currentIndex];
}
function updateLightbox() {
  lb.img.src = galleryImages[currentIndex];
  lb.counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
  const single = galleryImages.length <= 1;
  lb.prev.style.display = single ? "none" : "";
  lb.next.style.display = single ? "none" : "";
}

/* ---------- Helpers ---------- */
function waHref(item) {
  const priceLabel = formatPriceDisplay(currency, item.price);
  const msg =
    `Hi, I am interested in "${item.title}" listed for ${priceLabel}.\n` +
    `Product link: ${window.location.href}\n` +
    `Is it still available?`;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
}
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}
