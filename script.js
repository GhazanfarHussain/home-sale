/* Home Sale - public catalog (index.html) */

const WA_FALLBACK = "971500000000";
const DATA_URL = "data/items.json";
const PLACEHOLDER = IMG_PLACEHOLDER;

const state = {
  items: [],
  whatsapp: WA_FALLBACK,
  currency: "Rs.",
  search: "",
  category: "All",
  sort: "featured",
};

const els = {
  grid: document.getElementById("productGrid"),
  search: document.getElementById("searchInput"),
  filters: document.getElementById("categoryFilters"),
  meta: document.getElementById("resultsMeta"),
  sort: document.getElementById("sortSelect"),
};

const STATUS_ORDER = { available: 0, reserved: 1, sold: 2 };

init();

async function init() {
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const rawItems = Array.isArray(data.items) ? data.items : [];
    // Preserve original order for "newest first"
    state.items = rawItems.map((item, i) => ({ ...item, _order: i }));
    if (data.meta) {
      state.whatsapp = data.meta.whatsapp || WA_FALLBACK;
      state.currency = data.meta.currency || "Rs.";
      if (data.meta.pickupNote) updatePickupNote(data.meta.pickupNote);
    }
    buildFilters();
    render();
  } catch (err) {
    els.grid.innerHTML =
      '<div class="state-msg"><h3>Could not load items</h3><p>Make sure you are running a local server (see README). Error: ' +
      escapeHtml(err.message) +
      "</p></div>";
  }

  els.search.addEventListener("input", (e) => {
    state.search = e.target.value.trim().toLowerCase();
    render();
  });
  els.sort.addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
  });
}

function buildFilters() {
  const cats = categoriesWithProducts(state.items);
  els.filters.innerHTML = cats
    .map(
      (c) =>
        `<button class="chip${c === state.category ? " active" : ""}" data-cat="${escapeAttr(
          c
        )}">${escapeHtml(c)}</button>`
    )
    .join("");
  els.filters.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.cat;
      els.filters.querySelectorAll(".chip").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render();
    });
  });
}

function getFiltered() {
  const list = state.items.filter((item) => {
    if (state.category !== "All" && item.category !== state.category) return false;
    if (!state.search) return true;
    return searchHaystack(item).includes(state.search);
  });
  return sortItems(list);
}

function sortItems(list) {
  const arr = list.slice();
  const price = (i) => Number(i.price) || 0;
  const statusRank = (i) => STATUS_ORDER[(i.status || "available").toLowerCase()] ?? 3;
  switch (state.sort) {
    case "price-asc":
      arr.sort((a, b) => price(a) - price(b));
      break;
    case "price-desc":
      arr.sort((a, b) => price(b) - price(a));
      break;
    case "newest":
      arr.sort((a, b) => b._order - a._order);
      break;
    case "available":
      arr.sort((a, b) => statusRank(a) - statusRank(b) || a._order - b._order);
      break;
    case "featured":
    default:
      arr.sort(
        (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a._order - b._order
      );
      break;
  }
  return arr;
}

function searchHaystack(item) {
  const parts = [item.title, item.category, item.condition, item.description, String(item.price)];
  if (item.specs && typeof item.specs === "object") {
    for (const [k, v] of Object.entries(item.specs)) parts.push(k, String(v));
  }
  return parts.join(" ").toLowerCase();
}

function render() {
  const list = getFiltered();
  els.meta.textContent = `${list.length} item${list.length === 1 ? "" : "s"}${
    state.category !== "All" ? " in " + state.category : ""
  }${state.search ? ' matching "' + state.search + '"' : ""}`;

  if (!list.length) {
    els.grid.innerHTML =
      '<div class="state-msg"><h3>No items found</h3><p>Try a different search or category.</p></div>';
    return;
  }

  els.grid.innerHTML = list.map(cardHtml).join("");

  els.grid.querySelectorAll("[data-open]").forEach((el) => {
    el.addEventListener("click", () => openProduct(el.dataset.open));
  });
}

function specPreview(item) {
  if (!item.specs || typeof item.specs !== "object") return "";
  const entries = Object.entries(item.specs).filter(([, v]) => String(v).trim()).slice(0, 2);
  if (!entries.length) return "";
  return `<ul class="card-specs">${entries
    .map(
      ([k, v]) =>
        `<li><span>${escapeHtml(k)}</span><strong>${escapeHtml(String(v))}</strong></li>`
    )
    .join("")}</ul>`;
}

function cardHtml(item) {
  const status = (item.status || "Available").toLowerCase();
  const isSold = status === "sold";
  const price = formatPriceDisplay(state.currency, item.price);
  const img = (item.images && item.images[0]) || PLACEHOLDER;
  const photoCount = item.images && item.images.length ? item.images.length : 0;
  const photoBadge =
    photoCount > 0
      ? `<span class="card-photo-count">${icon("gallery", { size: 13 })} ${escapeHtml(
          photoCountLabel(photoCount)
        )}</span>`
      : "";
  const link = productLink(item.id);

  const waBtn = isSold
    ? `<button class="btn btn-disabled" disabled>${icon("sold", { size: 16 })} Sold</button>`
    : `<a class="btn btn-whatsapp" href="${waHref(item)}" target="_blank" rel="noopener">${icon(
        "message",
        { size: 18 }
      )} WhatsApp</a>`;

  const featuredTag = item.featured
    ? `<span class="featured-tag">${icon("featured", { size: 13 })} Featured</span>`
    : "";

  return `
    <article class="card">
      <div class="card-media" data-open="${escapeAttr(item.id)}">
        <img src="${escapeAttr(img)}" alt="${escapeAttr(item.title)}" loading="lazy"
             onerror="this.onerror=null;this.src='${PLACEHOLDER}'" />
        <span class="status-badge status-${status}">${icon(statusIconName(item.status), {
    size: 13,
  })} ${escapeHtml(item.status || "Available")}</span>
        ${featuredTag}
        ${photoBadge}
      </div>
      <div class="card-body">
        <span class="card-category">${escapeHtml(item.category || "Other")}</span>
        <h2 class="card-title" data-open="${escapeAttr(item.id)}">${escapeHtml(item.title)}</h2>
        <div class="card-price">${escapeHtml(price)}</div>
        <p class="card-condition">${escapeHtml(item.condition || "")}</p>
        ${specPreview(item)}
        <div class="card-actions">
          <a class="btn btn-primary" href="${link}">${icon("view", { size: 18 })} View Details</a>
          ${waBtn}
        </div>
      </div>
    </article>`;
}

function openProduct(id) {
  window.location.href = productLink(id);
}

function productLink(id) {
  return "product.html?id=" + encodeURIComponent(id);
}

function absoluteProductLink(id) {
  return new URL(productLink(id), window.location.href).href;
}

function waHref(item) {
  const priceLabel = formatPriceDisplay(state.currency, item.price);
  const msg =
    `Hi, I am interested in "${item.title}" listed for ${priceLabel}.\n` +
    `Product link: ${absoluteProductLink(item.id)}\n` +
    `Is it still available?`;
  return `https://wa.me/${state.whatsapp}?text=${encodeURIComponent(msg)}`;
}

function updatePickupNote(text) {
  const el = document.getElementById("pickupNote");
  if (!el) return;
  const svg = el.querySelector("svg");
  el.textContent = "";
  if (svg) el.appendChild(svg);
  el.appendChild(document.createTextNode(" " + text));
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
