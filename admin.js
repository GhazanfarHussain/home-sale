/* Home Sale Admin - local editor for data/items.json */

const DATA_URL = "data/items.json";
const DRAFT_KEY = "homeSaleAdminDraft";
const CATEGORIES = PRODUCT_CATEGORIES;
const STATUSES = ["Available", "Reserved", "Sold"];
const PLACEHOLDER = IMG_PLACEHOLDER_SM;
const SAMPLE_PRODUCT_IDS = [
  "sofa-set",
  "led-tv",
  "cookware-set",
  "kids-bicycle",
  "washing-machine",
  "dining-table",
  "wall-art",
];
const WHATSAPP_PLACEHOLDER = "971500000000";
const SESSION_HIDE_WARNINGS_KEY = "homeSaleHideWarnings";
const MAX_TITLE_LENGTH = 80;
const MAX_IMAGES_WARN = 8;

let meta = {
  currency: "Rs.",
  whatsapp: "971500000000",
  pickupNote: DEFAULT_PICKUP_NOTE,
  updated: "",
};
let items = [];        // working copy (source of truth in the page)
let original = [];     // last loaded/imported snapshot (for reset)
let editingId = null;  // id being edited, or null when adding

const el = (id) => document.getElementById(id);
const ui = {
  status: el("statusMsg"),
  tbody: el("adminTableBody"),
  search: el("adminSearch"),
  categoryFilter: el("adminCategory"),
  statusFilter: el("adminStatus"),
  draftHint: el("draftHint"),
  // modal
  backdrop: el("modalBackdrop"),
  modalTitle: el("modalTitle"),
  form: el("productForm"),
  imagesEditor: el("imagesEditor"),
  specsEditor: el("specsEditor"),
};

init();

async function init() {
  populateCategoryFilter();
  bindToolbar();
  bindMeta();
  bindFilters();
  bindModal();

  const draft = loadDraft();
  if (draft && Array.isArray(draft.items)) {
    meta = draft.meta || meta;
    items = draft.items;
    original = deepClone(draft.original || draft.items);
    ui.draftHint.textContent =
      "Loaded an unsaved draft from this browser. Use Reset changes to reload the file version.";
    showStatus("info", "Restored your previous unsaved draft (browser backup).");
    fillMetaForm();
    render();
    updateAdminWarnings();
  } else {
    await loadFromFile(true);
  }
}

async function loadFromFile(initial) {
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    meta = data.meta || meta;
    items = Array.isArray(data.items) ? data.items : [];
    original = deepClone(items);
    clearDraft();
    ui.draftHint.textContent = "";
    fillMetaForm();
    render();
    updateAdminWarnings();
    if (!initial) showStatus("ok", "Reloaded data from data/items.json.");
  } catch (err) {
    ui.tbody.innerHTML = `<tr><td colspan="7">Could not load data/items.json. Run a local server (see README). ${escapeHtml(
      err.message
    )}</td></tr>`;
    if (!initial) showStatus("err", "Failed to load items.json: " + err.message);
  }
}

/* ---------- Meta settings ---------- */
function fillMetaForm() {
  el("meta_whatsapp").value = meta.whatsapp || "";
  el("meta_currency").value = meta.currency || "Rs.";
  el("meta_pickupNote").value = meta.pickupNote || "";
}

function readMetaForm() {
  return {
    whatsapp: el("meta_whatsapp").value.trim(),
    currency: normalizeCurrency(el("meta_currency").value),
    pickupNote: el("meta_pickupNote").value.trim(),
  };
}

function saveMeta() {
  const next = readMetaForm();
  if (!next.whatsapp) return showStatus("err", "WhatsApp number is required.");
  if (!/^\d{8,15}$/.test(next.whatsapp))
    return showStatus("err", "WhatsApp number must be 8-15 digits, no + or spaces.");
  if (!next.currency) return showStatus("err", "Currency is required.");
  if (!ALLOWED_CURRENCIES.includes(next.currency))
    return showStatus("err", "Currency must be one of: Rs., PKR, AED, USD.");
  if (!next.pickupNote) return showStatus("err", "Pickup note is required.");

  meta = { ...meta, ...next };
  persistDraft();
  updateAdminWarnings();
  updateReadinessPanel();
  showStatus("ok", "Site settings saved. Export items.json to make them permanent.");
}

function validateMeta() {
  const problems = [];
  if (!meta.whatsapp) problems.push("WhatsApp number is missing in meta.");
  else if (!/^\d{8,15}$/.test(String(meta.whatsapp)))
    problems.push("WhatsApp number must be 8-15 digits, no + or spaces.");
  if (!meta.currency) problems.push("Currency is missing in meta.");
  else if (!ALLOWED_CURRENCIES.includes(normalizeCurrency(meta.currency)))
    problems.push("Currency must be one of: Rs., PKR, AED, USD.");
  if (!meta.pickupNote) problems.push("Pickup note is missing in meta.");
  return problems;
}

function bindMeta() {
  el("btnSaveMeta").addEventListener("click", saveMeta);
  el("meta_whatsapp").addEventListener("input", () => {
    updateAdminWarnings();
    updateReadinessPanel();
  });
}

function warningsHiddenForSession() {
  try {
    return sessionStorage.getItem(SESSION_HIDE_WARNINGS_KEY) === "1";
  } catch (e) {
    return false;
  }
}

function hideWarningsForSession() {
  try {
    sessionStorage.setItem(SESSION_HIDE_WARNINGS_KEY, "1");
  } catch (e) {}
  updateAdminWarnings();
  showStatus("info", "Sample warnings hidden for this browser session. Export validation is unchanged.");
}

function getReadinessState() {
  const waPlaceholder = String(meta.whatsapp || "") === WHATSAPP_PLACEHOLDER;
  const samples = hasSampleProducts();
  const svgImages = hasSvgPlaceholderImages();
  const exportBlockers = validateMeta().concat(
    collectQualityValidation(items).errors,
    collectImageValidation(items).errors
  );
  const exportWarnings = collectQualityValidation(items).warnings.concat(
    collectImageValidation(items).warnings
  );
  const needsAttention =
    waPlaceholder ||
    samples ||
    svgImages ||
    exportWarnings.length > 0 ||
    exportBlockers.length > 0;

  return {
    waPlaceholder,
    samples,
    svgImages,
    exportBlockers,
    exportWarnings,
    needsAttention,
  };
}

function readinessRow(label, okText, warnText, isOk) {
  const iconName = isOk ? "available" : "reserved";
  const cls = isOk ? "readiness-ok" : "readiness-warn";
  return (
    '<div class="readiness-row ' +
    cls +
    '">' +
    icon(iconName, { size: 18 }) +
    "<div><strong>" +
    escapeHtml(label) +
    "</strong><span>" +
    escapeHtml(isOk ? okText : warnText) +
    "</span></div></div>"
  );
}

function updateReadinessPanel() {
  const grid = el("readinessGrid");
  if (!grid) return;

  const state = getReadinessState();

  grid.innerHTML =
    readinessRow(
      "WhatsApp number",
      "Real number appears set",
      "Placeholder number detected — add your Pakistan WhatsApp number (e.g. 923001234567)",
      !state.waPlaceholder
    ) +
    readinessRow(
      "Product data",
      "Real products appear set",
      "Sample products detected — replace sample IDs before publishing",
      !state.samples
    ) +
    readinessRow(
      "Images",
      "Real image paths appear set",
      "SVG placeholders detected — active folders should use .webp product photos",
      !state.svgImages
    ) +
    readinessRow(
      "Export readiness",
      "Ready",
      "Needs attention — review warnings below before publishing",
      !state.needsAttention
    );

  const panel = el("readinessPanel");
  if (panel) {
    panel.classList.toggle("readiness-attention", state.needsAttention);
  }

  const hideBtn = el("btnHideWarnings");
  if (hideBtn) {
    hideBtn.classList.toggle("hidden", warningsHiddenForSession());
  }
}

/* ---------- Admin warnings ---------- */
function hasSampleProducts() {
  const ids = new Set(items.map((i) => i.id));
  return SAMPLE_PRODUCT_IDS.some((id) => ids.has(id));
}

function hasSvgPlaceholderImages() {
  return items.some((it) =>
    (Array.isArray(it.images) ? it.images : []).some((p) => /\.svg$/i.test(String(p)))
  );
}

function updateAdminWarnings() {
  const box = el("adminWarnings");
  const waHint = el("whatsappWarning");
  const msgs = [];

  if (warningsHiddenForSession()) {
    if (waHint) waHint.classList.add("hidden");
    if (box) {
      box.classList.add("hidden");
      box.innerHTML = "";
    }
    updateReadinessPanel();
    return;
  }

  if (hasSampleProducts()) {
    msgs.push("Sample products are still active. Replace them with real items before publishing.");
  }
  if (String(meta.whatsapp || "") === WHATSAPP_PLACEHOLDER) {
    msgs.push(
      "WhatsApp number is still placeholder. Replace it with your Pakistan WhatsApp number before publishing (e.g. 923001234567)."
    );
  }
  if (hasSvgPlaceholderImages()) {
    msgs.push(
      "SVG placeholder images are still used. Replace with real .jpg or .webp before publishing."
    );
  }

  if (waHint) {
    waHint.classList.toggle("hidden", String(meta.whatsapp || "") !== WHATSAPP_PLACEHOLDER);
  }

  if (!box) {
    updateReadinessPanel();
    return;
  }
  if (!msgs.length) {
    box.classList.add("hidden");
    box.innerHTML = "";
    updateReadinessPanel();
    return;
  }
  box.classList.remove("hidden");
  box.innerHTML =
    '<div class="admin-warnings-inner">' +
    icon("reserved", { size: 18 }) +
    "<div><strong>Publish reminders</strong><ul>" +
    msgs.map((m) => "<li>" + escapeHtml(m) + "</li>").join("") +
    "</ul></div></div>";
  updateReadinessPanel();
}

/* ---------- Rendering ---------- */
function render() {
  const list = getFiltered();
  populateCategoryFilter();

  if (!list.length) {
    ui.tbody.innerHTML = `<tr><td colspan="7">No products match your filters.</td></tr>`;
    return;
  }

  ui.tbody.innerHTML = list
    .map((item) => {
      const img = (item.images && item.images[0]) || PLACEHOLDER;
      return `
      <tr data-id="${escapeAttr(item.id)}">
        <td><img class="mini-thumb" src="${escapeAttr(img)}" alt=""
             onerror="this.onerror=null;this.src='${PLACEHOLDER}'" /></td>
        <td><strong>${escapeHtml(item.title)}</strong><br><span class="hint">${escapeHtml(item.id)}</span></td>
        <td>${escapeHtml(item.category || "")}</td>
        <td class="col-price">
          <input type="number" min="0" step="1" value="${escapeAttr(item.price)}" data-price="${escapeAttr(item.id)}" />
        </td>
        <td>
          <select data-status="${escapeAttr(item.id)}">
            ${STATUSES.map(
              (s) => `<option value="${s}"${s === item.status ? " selected" : ""}>${s}</option>`
            ).join("")}
          </select>
        </td>
        <td>
          <button class="featured-toggle${item.featured ? " on" : ""}" data-featured="${escapeAttr(item.id)}"
                  aria-pressed="${item.featured ? "true" : "false"}">
            ${featuredToggleLabel(item.featured)}
          </button>
        </td>
        <td>
          <div class="row-actions">
            <button class="btn btn-outline btn-sm" data-edit="${escapeAttr(item.id)}">${icon("edit", {
        size: 15,
      })} Edit</button>
            <button class="btn btn-outline btn-sm" data-duplicate="${escapeAttr(item.id)}">${icon("copy", {
        size: 15,
      })} Duplicate</button>
            <button class="btn btn-danger btn-sm" data-delete="${escapeAttr(item.id)}">${icon("delete", {
        size: 15,
      })} Delete</button>
          </div>
        </td>
      </tr>`;
    })
    .join("");

  // quick price
  ui.tbody.querySelectorAll("[data-price]").forEach((inp) => {
    inp.addEventListener("change", () => {
      const item = findItem(inp.dataset.price);
      if (!item) return;
      const val = Number(inp.value);
      if (!isFinite(val) || val < 0) {
        showStatus("err", "Price must be a number of 0 or more.");
        inp.value = item.price;
        return;
      }
      item.price = val;
      persistDraft();
      showStatus("ok", `Updated price for "${item.title}" to ${formatPriceDisplay(meta.currency, val)}.`);
    });
  });

  // quick status
  ui.tbody.querySelectorAll("[data-status]").forEach((sel) => {
    sel.addEventListener("change", () => {
      const item = findItem(sel.dataset.status);
      if (!item) return;
      item.status = sel.value;
      persistDraft();
      showStatus("ok", `Updated status for "${item.title}" to ${sel.value}.`);
    });
  });

  // quick featured toggle
  ui.tbody.querySelectorAll("[data-featured]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = findItem(btn.dataset.featured);
      if (!item) return;
      item.featured = !item.featured;
      btn.classList.toggle("on", item.featured);
      btn.setAttribute("aria-pressed", item.featured ? "true" : "false");
      btn.innerHTML = featuredToggleLabel(item.featured);
      persistDraft();
      showStatus(
        "ok",
        `"${item.title}" is ${item.featured ? "now featured" : "no longer featured"}.`
      );
    });
  });

  ui.tbody.querySelectorAll("[data-edit]").forEach((b) =>
    b.addEventListener("click", () => openEdit(b.dataset.edit))
  );
  ui.tbody.querySelectorAll("[data-duplicate]").forEach((b) =>
    b.addEventListener("click", () => duplicateProduct(b.dataset.duplicate))
  );
  ui.tbody.querySelectorAll("[data-delete]").forEach((b) =>
    b.addEventListener("click", () => deleteItem(b.dataset.delete))
  );
  updateAdminWarnings();
}

function getFiltered() {
  const q = ui.search.value.trim().toLowerCase();
  const cat = ui.categoryFilter.value;
  const st = ui.statusFilter.value;
  return items.filter((item) => {
    if (cat !== "All" && item.category !== cat) return false;
    if (st !== "All" && item.status !== st) return false;
    if (!q) return true;
    const hay = [item.id, item.title, item.category, item.condition, item.description, String(item.price)]
      .concat(item.specs ? Object.entries(item.specs).flat().map(String) : [])
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

function populateCategoryFilter() {
  const current = ui.categoryFilter.value || "All";
  const cats = categoriesWithProducts(items);
  ui.categoryFilter.innerHTML = cats
    .map((c) => `<option value="${escapeAttr(c)}"${c === current ? " selected" : ""}>${c === "All" ? "All categories" : escapeHtml(c)}</option>`)
    .join("");
}

/* ---------- Modal add/edit ---------- */
function bindModal() {
  el("modalClose").addEventListener("click", closeModal);
  el("modalCancel").addEventListener("click", closeModal);
  el("addImageBtn").addEventListener("click", () => addImageRow(""));
  el("addSpecBtn").addEventListener("click", () => addSpecRow("", ""));
  ui.form.addEventListener("submit", onSave);

  el("f_title").addEventListener("input", () => {
    if (editingId !== null) return;
    el("f_id").value = uniqueProductId(el("f_title").value, items, null);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !ui.backdrop.classList.contains("open")) return;
    e.preventDefault();
    e.stopPropagation();
  });
}

function openEdit(id) {
  const item = findItem(id);
  if (!item) return;
  editingId = id;
  ui.modalTitle.textContent = "Edit product";
  fillForm(item);
  el("f_id").readOnly = true;
  openModal();
}

function openAdd() {
  if (editingId === null && ui.backdrop.classList.contains("open")) {
    return;
  }
  editingId = null;
  ui.modalTitle.textContent = "Add new product";
  fillForm({
    id: "",
    title: "",
    category: "Furniture",
    price: "",
    status: "Available",
    featured: false,
    condition: DEFAULT_CONDITION,
    description: "",
    images: [""],
    specs: {},
  });
  el("f_id").readOnly = true;
  openModal();
}

function fillForm(item) {
  const isNew = editingId === null;
  el("f_id").value = item.id || (isNew ? uniqueProductId(item.title, items, null) : "");
  el("f_title").value = item.title || "";
  setFormCategorySelect(el("f_category"), item.category || "Furniture");
  el("f_price").value = item.price ?? "";
  el("f_status").value = item.status || "Available";
  el("f_featured").checked = !!item.featured;
  fillConditionSelect(el("f_condition"), item.condition || DEFAULT_CONDITION);
  el("f_description").value = item.description || "";

  ui.imagesEditor.innerHTML = "";
  const imgs = item.images && item.images.length ? item.images : [""];
  imgs.forEach((src) => addImageRow(src));

  ui.specsEditor.innerHTML = "";
  const specs = item.specs && Object.keys(item.specs).length ? item.specs : { "": "" };
  Object.entries(specs).forEach(([k, v]) => addSpecRow(k, v));
}

function addImageRow(src) {
  const row = document.createElement("div");
  row.className = "img-row";
  row.innerHTML = `
    <div class="img-preview-wrap">
      <img class="img-preview" src="${escapeAttr(src || PLACEHOLDER)}" alt=""
           onerror="this.onerror=null;this.src='${PLACEHOLDER}'" />
    </div>
    <div class="img-row-fields">
      <input type="text" value="${escapeAttr(src)}" placeholder="images/furniture/sofa-set-01.jpg" />
      <p class="img-path-msg hint"></p>
    </div>
    <button type="button" class="btn btn-outline btn-sm">${icon("close", { size: 14 })} Remove</button>`;

  const input = row.querySelector("input");
  const preview = row.querySelector(".img-preview");
  const msgEl = row.querySelector(".img-path-msg");

  function refreshRow() {
    const val = input.value.trim();
    preview.src = val || PLACEHOLDER;
    showImagePathFeedback(msgEl, val);
  }

  input.addEventListener("input", refreshRow);
  refreshRow();

  row.querySelector("button").addEventListener("click", () => row.remove());
  ui.imagesEditor.appendChild(row);
}

function showImagePathFeedback(el, path) {
  if (!el) return;
  const val = String(path || "").trim();
  if (!val) {
    el.textContent = "";
    el.className = "img-path-msg hint";
    return;
  }
  const { errors, warnings } = validateImagePath(val);
  if (errors.length) {
    el.textContent = errors[0];
    el.className = "img-path-msg hint img-path-err";
  } else if (warnings.length) {
    el.textContent = warnings[0];
    el.className = "img-path-msg hint img-path-warn";
  } else {
    el.textContent = "Path format OK";
    el.className = "img-path-msg hint img-path-ok";
  }
}

function collectImageValidation(itemsList) {
  const errors = [];
  const warnings = [];
  itemsList.forEach((it, i) => {
    const label = it.title || it.id || "#" + (i + 1);
    const images = Array.isArray(it.images) ? it.images.filter(Boolean) : [];
    images.forEach((path, idx) => {
      const result = validateImagePath(path);
      result.errors.forEach((msg) =>
        errors.push('"' + label + '" image ' + (idx + 1) + ": " + msg)
      );
      result.warnings.forEach((msg) =>
        warnings.push('"' + label + '" image ' + (idx + 1) + ": " + msg)
      );
    });
  });
  return { errors, warnings };
}

function collectQualityValidation(itemsList) {
  const errors = [];
  const warnings = [];
  const ids = new Set();

  itemsList.forEach((it, i) => {
    const label = it.title || it.id || "#" + (i + 1);

    if (!it.id) errors.push('"' + label + '" is missing an ID.');
    else {
      if (ids.has(it.id)) errors.push('Duplicate ID "' + it.id + '".');
      else ids.add(it.id);
      if (!/^[a-z0-9-]+$/.test(it.id)) {
        errors.push(
          '"' + label + '" has an invalid ID (lowercase letters, numbers, and hyphens only).'
        );
      }
    }

    if (!it.title) errors.push('"' + label + '" is missing a title.');
    else if (it.title.length > MAX_TITLE_LENGTH) {
      warnings.push('"' + label + '": Product title may be too long.');
    }

    if (!it.category) errors.push('"' + label + '" is missing a category.');
    else if (!CATEGORIES.includes(it.category)) {
      errors.push('"' + label + '" has an invalid category.');
    }

    const price = Number(it.price);
    if (!isFinite(price) || price < 0) {
      errors.push('"' + label + '" has an invalid price (numeric value required).');
    } else if (price === 0) {
      warnings.push('"' + label + '": Product price is 0.');
    }

    if (!STATUSES.includes(it.status)) {
      errors.push('"' + label + '" has an invalid status.');
    }

    const images = Array.isArray(it.images) ? it.images.filter(Boolean) : [];
    if (!images.length) {
      warnings.push('"' + label + '": Product has no images.');
    } else if (images.length > MAX_IMAGES_WARN) {
      warnings.push('"' + label + '": Product has more than ' + MAX_IMAGES_WARN + " images.");
    }

    if (!String(it.description || "").trim()) {
      warnings.push('"' + label + '": Product has no description.');
    }

    const specCount =
      it.specs && typeof it.specs === "object"
        ? Object.keys(it.specs).filter((k) => String(k).trim()).length
        : 0;
    if (specCount === 0) {
      warnings.push('"' + label + '": Product has no specs.');
    }
  });

  if (String(meta.whatsapp || "") === WHATSAPP_PLACEHOLDER) {
    warnings.push("Placeholder WhatsApp number is still active.");
  }
  if (hasSampleProducts()) {
    warnings.push("Sample product IDs are still active.");
  }
  if (hasSvgPlaceholderImages()) {
    warnings.push("SVG placeholder images are still active — use .webp for real photos.");
  }
  const hasLegacyRaster = itemsList.some((it) =>
    (Array.isArray(it.images) ? it.images : []).some((p) =>
      /\.(jpe?g|png)$/i.test(String(p))
    )
  );
  if (hasLegacyRaster) {
    warnings.push("Some products still use .jpg or .png paths — prefer .webp for publishing.");
  }

  return { errors, warnings };
}

function addSpecRow(key, val) {
  const row = document.createElement("div");
  row.className = "spec-row";
  row.innerHTML = `
    <input type="text" value="${escapeAttr(key)}" placeholder="Spec name (e.g. Material)" />
    <input type="text" value="${escapeAttr(val)}" placeholder="Value (e.g. Wood)" />
    <button type="button" class="btn btn-outline btn-sm">${icon("close", { size: 14 })} Remove</button>`;
  row.querySelector("button").addEventListener("click", () => row.remove());
  ui.specsEditor.appendChild(row);
}

function onSave(e) {
  e.preventDefault();
  const id = el("f_id").value.trim();
  const title = el("f_title").value.trim();
  const categorySelect = document.getElementById("f_category");
  const category = categorySelect ? String(categorySelect.value || "").trim() : "";
  const priceRaw = el("f_price").value;
  const status = el("f_status").value;

  // Validate required fields
  if (!title) return showStatus("err", "Title is required.");
  const finalId = editingId
    ? editingId
    : id || uniqueProductId(title, items, null);
  if (!finalId) return showStatus("err", "ID could not be generated from title.");
  if (!/^[a-z0-9-]+$/.test(finalId))
    return showStatus("err", "ID may only contain lowercase letters, numbers and hyphens.");
  if (!category) return showStatus("err", "Category is required.");
  if (!CATEGORIES.includes(category))
    return showStatus("err", "Invalid category. Choose a value from the dropdown.");
  const price = Number(priceRaw);
  if (priceRaw === "" || !isFinite(price) || price < 0)
    return showStatus("err", "Price must be a number of 0 or more.");
  if (!STATUSES.includes(status)) return showStatus("err", "Invalid status.");

  // Unique id check
  const clash = items.find((i) => i.id === finalId && i.id !== editingId);
  if (clash) return showStatus("err", `Another product already uses the ID "${finalId}".`);

  const images = Array.from(ui.imagesEditor.querySelectorAll(".img-row-fields input"))
    .map((i) => i.value.trim())
    .filter(Boolean);

  for (let idx = 0; idx < images.length; idx++) {
    const result = validateImagePath(images[idx]);
    if (result.errors.length) {
      return showStatus(
        "err",
        "Image " + (idx + 1) + ": " + result.errors[0]
      );
    }
  }

  const specs = {};
  ui.specsEditor.querySelectorAll(".spec-row").forEach((row) => {
    const [kEl, vEl] = row.querySelectorAll("input");
    const k = kEl.value.trim();
    const v = vEl.value.trim();
    if (k) specs[k] = v;
  });

  const record = {
    id: finalId,
    title,
    category,
    price,
    status,
    featured: el("f_featured").checked,
    condition: el("f_condition").value.trim(),
    description: el("f_description").value.trim(),
    images,
    specs,
  };

  if (editingId) {
    const idx = items.findIndex((i) => i.id === editingId);
    items[idx] = record;
    showStatus("ok", `Saved changes to "${title}".`);
  } else {
    items.push(record);
    showStatus("ok", `Added new product "${title}".`);
  }
  persistDraft();
  closeModal();
  render();
}

function deleteItem(id) {
  const item = findItem(id);
  if (!item) return;
  if (!confirm(`Delete "${item.title}"? This cannot be undone (until you reload the file).`)) return;
  items = items.filter((i) => i.id !== id);
  persistDraft();
  render();
  showStatus("ok", `Deleted "${item.title}".`);
}

function uniqueCopyId(baseId) {
  let candidate = baseId + "-copy";
  let n = 2;
  while (items.some((i) => i.id === candidate)) {
    candidate = baseId + "-copy-" + n;
    n++;
  }
  return candidate;
}

function duplicateProduct(id) {
  const item = findItem(id);
  if (!item) return;
  const copy = deepClone(item);
  copy.id = uniqueCopyId(item.id);
  copy.title = (item.title || item.id) + " Copy";
  copy.status = "Available";
  copy.featured = false;
  items.push(copy);
  persistDraft();
  render();
  showStatus("ok", `Created duplicate "${copy.title}". Update the ID, title, and details before publishing.`);
  openEdit(copy.id);
}

/* ---------- Export / Import / Reset ---------- */
function exportJson() {
  if (!items.length) return showStatus("err", "There are no products to export.");
  const metaErrors = validateMeta();
  const quality = collectQualityValidation(items);
  const imageCheck = collectImageValidation(items);
  const allErrors = metaErrors.concat(quality.errors, imageCheck.errors);
  const allWarnings = quality.warnings.concat(imageCheck.warnings);
  if (allErrors.length) {
    return showStatus("err", "Cannot export - fix these first: " + allErrors.join(" "));
  }
  const payload = {
    meta: { ...meta, updated: new Date().toISOString().slice(0, 10) },
    items,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "items.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  let msg =
    "Exported items.json. Replace data/items.json in your project with this file.";
  if (allWarnings.length) {
    const unique = [...new Set(allWarnings)];
    const shown = unique.slice(0, 5);
    msg += " Warnings: " + shown.join(" ");
    if (unique.length > 5) {
      msg += " (+" + (unique.length - 5) + " more)";
    }
  }
  showStatus("ok", msg);
}

function validateAll() {
  const metaErrors = validateMeta();
  const quality = collectQualityValidation(items);
  const imageCheck = collectImageValidation(items);
  return metaErrors.concat(quality.errors, imageCheck.errors);
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const importedItems = Array.isArray(data) ? data : data.items;
      if (!Array.isArray(importedItems)) throw new Error("No items array found.");
      items = importedItems;
      if (!Array.isArray(data) && data.meta) meta = { ...meta, ...data.meta };
      original = deepClone(items);
      fillMetaForm();
      persistDraft();
      render();
      updateAdminWarnings();
      showStatus("ok", `Imported ${items.length} products from file.`);
    } catch (err) {
      showStatus("err", "Import failed: " + err.message);
    }
  };
  reader.onerror = () => showStatus("err", "Could not read the file.");
  reader.readAsText(file);
}

function resetChanges() {
  if (!confirm("Discard all changes and reload from data/items.json?")) return;
  clearDraft();
  loadFromFile(false);
}

/* ---------- Draft (localStorage backup only) ---------- */
function persistDraft() {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ meta, items, original }));
    ui.draftHint.textContent = "Unsaved draft backed up in this browser. Export to make it permanent.";
  } catch (e) {
    /* storage may be unavailable; ignore */
  }
}
function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {}
}

/* ---------- Bindings ---------- */
function bindToolbar() {
  el("btnAdd").addEventListener("click", openAdd);
  el("btnExport").addEventListener("click", exportJson);
  el("btnReset").addEventListener("click", resetChanges);
  el("btnImport").addEventListener("click", () => el("fileInput").click());
  el("fileInput").addEventListener("change", (e) => {
    if (e.target.files[0]) importJson(e.target.files[0]);
    e.target.value = "";
  });
  const hideBtn = el("btnHideWarnings");
  if (hideBtn) hideBtn.addEventListener("click", hideWarningsForSession);
}
function bindFilters() {
  ui.search.addEventListener("input", render);
  ui.categoryFilter.addEventListener("change", render);
  ui.statusFilter.addEventListener("change", render);
}

/* ---------- Utilities ---------- */
function openModal() {
  ui.backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  ui.backdrop.classList.remove("open");
  document.body.style.overflow = "";
  editingId = null;
}
function findItem(id) {
  return items.find((i) => i.id === id);
}
function featuredToggleLabel(isFeatured) {
  return isFeatured
    ? icon("featured", { size: 14 }) + " Featured"
    : icon("featuredOutline", { size: 14 }) + " Not featured";
}
function showStatus(type, msg) {
  const iconName = type === "ok" ? "available" : type === "err" ? "sold" : "reserved";
  ui.status.className = "status-message show " + type;
  ui.status.innerHTML = icon(iconName, { size: 18 }) + "<span>" + escapeHtml(msg) + "</span>";
  ui.status.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}
