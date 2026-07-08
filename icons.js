/* Home Sale - inline SVG icon system (shared across pages) */
/* All icons use a 24x24 viewBox and inherit color via currentColor. */

const ICON_PATHS = {
  search:
    '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
  sort: '<path d="M4 6h16M6 12h12M9 18h6"/>',
  message:
    '<path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5z"/>',
  view:
    '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>',
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  next: '<path d="M9 18l6-6-6-6"/>',
  prev: '<path d="M15 18l-6-6 6-6"/>',
  gallery:
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
  tag:
    '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><path d="M7 7h.01"/>',
  location:
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  available:
    '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>',
  reserved: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  sold: '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>',
  featured:
    '<path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"/>',
  featuredOutline:
    '<path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"/>',
  edit:
    '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>',
  delete:
    '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/>',
  export:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  import:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>',
  reset:
    '<path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  add: '<path d="M12 5v14M5 12h14"/>',
  copy:
    '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  external:
    '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/>',
  home:
    '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  admin:
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
};

const FILLED_ICONS = new Set(["featured"]);

const DEFAULT_CURRENCY = "Rs.";
const ALLOWED_CURRENCIES = ["Rs.", "PKR", "AED", "USD"];
const DEFAULT_PICKUP_NOTE = "Pickup from Karachi. Exact location shared after confirmation.";

/** Normalize currency input for meta (default Rs.). */
function normalizeCurrency(val) {
  const v = String(val || "").trim();
  if (!v) return DEFAULT_CURRENCY;
  if (/^rs\.?$/i.test(v)) return "Rs.";
  const up = v.toUpperCase();
  if (["PKR", "AED", "USD"].includes(up)) return up;
  return v;
}

/** Format numeric price with grouping (no currency prefix). */
function formatPriceNumber(price) {
  const n = Number(price);
  return isFinite(n) ? n.toLocaleString("en-US") : String(price);
}

/** Display price with currency from meta, e.g. Rs. 12,000 */
function formatPriceDisplay(currency, price) {
  const cur = normalizeCurrency(currency);
  const formatted = formatPriceNumber(price);
  if (cur === "Rs.") return "Rs. " + formatted;
  return cur + " " + formatted;
}

/**
 * Returns inline SVG markup for a named icon.
 * opts: { size?: number, cls?: string, label?: string }
 * When `label` is provided the icon is exposed to screen readers; otherwise
 * it is marked decorative (aria-hidden).
 */
function icon(name, opts) {
  opts = opts || {};
  const size = opts.size || 20;
  const cls = opts.cls ? " " + opts.cls : "";
  const filled = FILLED_ICONS.has(name);
  const paths = ICON_PATHS[name] || "";
  const a11y = opts.label
    ? 'role="img" aria-label="' + String(opts.label).replace(/"/g, "&quot;") + '"'
    : 'aria-hidden="true" focusable="false"';
  return (
    '<svg class="icon' + cls + '" width="' + size + '" height="' + size +
    '" viewBox="0 0 24 24" fill="' + (filled ? "currentColor" : "none") +
    '" stroke="' + (filled ? "none" : "currentColor") +
    '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ' +
    a11y + ">" + paths + "</svg>"
  );
}

/** Icon name for a product status value. */
function statusIconName(status) {
  const s = String(status || "available").toLowerCase();
  if (s === "sold") return "sold";
  if (s === "reserved") return "reserved";
  return "available";
}

/** Light luxury SVG placeholder for missing/broken product images. */
function placeholderImage(width, height) {
  width = width || 400;
  height = height || 300;
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='" +
    width +
    "' height='" +
    height +
    "' viewBox='0 0 " +
    width +
    " " +
    height +
    "'>" +
    "<rect width='100%' height='100%' fill='#FBF6E9'/>" +
    "<rect x='" +
    width * 0.1 +
    "' y='" +
    height * 0.12 +
    "' width='" +
    width * 0.8 +
    "' height='" +
    height * 0.76 +
    "' fill='none' stroke='rgba(180,138,29,0.35)' stroke-width='2' rx='12'/>" +
    "<g transform='translate(" +
    width / 2 +
    "," +
    height / 2 +
    ")' fill='none' stroke='#B88A1D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>" +
    "<rect x='-22' y='-16' width='44' height='32' rx='4'/>" +
    "<circle cx='-8' cy='-5' r='4'/>" +
    "<path d='M-22 16 L-4 -2 L10 10 L22 -8'/>" +
    "</g></svg>";
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

const IMG_PLACEHOLDER = placeholderImage(400, 300);
const IMG_PLACEHOLDER_SM = placeholderImage(60, 46);

/** Product categories (display order for filters and admin). */
const PRODUCT_CATEGORIES = [
  "Appliances",
  "Decor",
  "Electronics",
  "Furniture",
  "Kids",
  "Kitchen",
  "Other",
];

/** Condition dropdown options for admin (default is Good, see photos for details). */
const CONDITION_OPTIONS = [
  "Excellent",
  "Very good",
  "Good",
  "Good, see photos for details",
  "Fair, visible wear",
  "Needs cleaning",
  "Minor scratches",
  "Light use",
  "Pre-owned",
  "New / unused",
  "Open box",
  "Working condition",
  "Sold as seen",
];

const DEFAULT_CONDITION = "Good, see photos for details";

/**
 * Build homepage/admin category list: "All" plus categories that have at least one product,
 * in canonical order, then any unknown categories alphabetically.
 */
function categoriesWithProducts(items) {
  const used = new Set(
    (Array.isArray(items) ? items : [])
      .map((i) => i && i.category)
      .filter(Boolean)
  );
  const ordered = PRODUCT_CATEGORIES.filter((c) => used.has(c));
  const extras = [...used]
    .filter((c) => !PRODUCT_CATEGORIES.includes(c))
    .sort((a, b) => a.localeCompare(b));
  return ["All", ...ordered, ...extras];
}

/** Convert product title to URL-safe id slug. */
function slugifyId(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Generate unique product id from title; adds -2, -3 suffix if needed. */
function uniqueProductId(title, items, excludeId) {
  let base = slugifyId(title);
  if (!base) base = "product";
  const ids = new Set(
    (Array.isArray(items) ? items : [])
      .filter((i) => i && i.id !== excludeId)
      .map((i) => i.id)
  );
  if (!ids.has(base)) return base;
  let n = 2;
  while (ids.has(base + "-" + n)) n++;
  return base + "-" + n;
}

/** Populate a condition &lt;select&gt;; preserves custom values not in the preset list. */
function fillConditionSelect(selectEl, value) {
  if (!selectEl) return;
  const val = String(value || "").trim();
  const options = CONDITION_OPTIONS.slice();
  if (val && !options.includes(val)) options.unshift(val);
  selectEl.innerHTML = options
    .map(
      (opt) =>
        '<option value="' +
        escapeHtmlAttr(opt) +
        '"' +
        (opt === val ? " selected" : "") +
        ">" +
        escapeHtml(opt) +
        "</option>"
    )
    .join("");
  if (!val) selectEl.value = DEFAULT_CONDITION;
}

/** Populate product category &lt;select&gt; with explicit option values. */
function populateCategorySelect(selectEl, selectedValue) {
  if (!selectEl) return;
  const val = String(selectedValue || "").trim();
  const options = PRODUCT_CATEGORIES.slice();
  if (val && !options.includes(val)) options.unshift(val);
  const selected = val || "Furniture";
  selectEl.innerHTML = options
    .map(
      (cat) =>
        '<option value="' +
        escapeHtmlAttr(cat) +
        '"' +
        (cat === selected ? " selected" : "") +
        ">" +
        escapeHtml(cat) +
        "</option>"
    )
    .join("");
  selectEl.value = selected;
}

/** Read the modal category &lt;select&gt; from the currently selected option. */
function readFormCategory() {
  const sel = document.getElementById("f_category");
  if (!sel) return "";
  const val = String(sel.value || "").trim();
  if (val) return val;
  const idx = sel.selectedIndex;
  if (idx < 0 || !sel.options[idx]) return "";
  const opt = sel.options[idx];
  return String(opt.value || opt.textContent || "").trim();
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeHtmlAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}

/** Valid category folders under images/ */
const IMAGE_CATEGORY_FOLDERS = [
  "furniture",
  "electronics",
  "appliances",
  "kitchen",
  "kids",
  "decor",
  "other",
];

const IMAGE_ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg"];

const WHATSAPP_FILENAME_PATTERN = /IMG-|WA\d|-WA/i;
const WINDOWS_DUP_PATTERN = /\(\d+\)/;
const PREFERRED_IMAGE_EXT = ".webp";
const LEGACY_RASTER_EXTS = [".jpg", ".jpeg", ".png"];

/**
 * Validate a product image path (format only — no file existence check).
 * Returns { errors: string[], warnings: string[] }
 */
function validateImagePath(path) {
  const errors = [];
  const warnings = [];
  const p = String(path || "").trim();
  if (!p) return { errors, warnings };

  if (!p.startsWith("images/")) {
    errors.push("Path must start with images/");
    return { errors, warnings };
  }

  const parts = p.split("/");
  if (parts.length < 3) {
    errors.push("Path must include a category folder (e.g. images/furniture/sofa-set-01.webp)");
    return { errors, warnings };
  }

  const folder = parts[1].toLowerCase();
  if (!IMAGE_CATEGORY_FOLDERS.includes(folder)) {
    errors.push(
      'Invalid category folder "' +
        parts[1] +
        '". Use: ' +
        IMAGE_CATEGORY_FOLDERS.join(", ")
    );
  }

  const filename = parts[parts.length - 1];
  if (filename !== filename.toLowerCase()) {
    warnings.push("Filename has uppercase letters — use lowercase (paths are case-sensitive on GitHub Pages)");
  }
  if (/\s/.test(filename)) {
    warnings.push("Filename contains spaces — use hyphens (spaces break image URLs)");
  }
  if (WINDOWS_DUP_PATTERN.test(filename)) {
    warnings.push("Filename contains Windows duplicate suffix like (1) — use clean -01, -02 names");
  }
  if (/[()]/.test(filename)) {
    warnings.push("Filename contains parentheses — use hyphens only");
  }

  const dot = filename.lastIndexOf(".");
  const ext = dot >= 0 ? filename.slice(dot).toLowerCase() : "";
  if (!ext || !IMAGE_ALLOWED_EXTENSIONS.includes(ext)) {
    errors.push("Allowed extensions: " + IMAGE_ALLOWED_EXTENSIONS.join(", "));
  } else if (ext === ".svg") {
    warnings.push("SVG placeholder — use .webp for real product photos before publishing");
  } else if (LEGACY_RASTER_EXTS.includes(ext)) {
    warnings.push("Prefer .webp for publishing (convert .jpg/.png sources first)");
  }

  if (WHATSAPP_FILENAME_PATTERN.test(filename)) {
    warnings.push("Filename looks like a WhatsApp default — rename before publishing");
  }

  return { errors, warnings };
}

/** Label for photo count, e.g. "3 photos" or "1 photo". */
function photoCountLabel(count) {
  const n = Math.max(0, Number(count) || 0);
  if (n === 1) return "1 photo";
  return n + " photos";
}
