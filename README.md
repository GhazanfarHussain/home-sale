# Home Sale Catalog

A stylish, responsive, **static** catalog for selling pre-loved home items. Built with plain
**HTML, CSS, and JavaScript** — no frameworks, no build tools, no backend, no database.
Designed to be hosted on **GitHub Pages**.

- Public catalog: `index.html`
- Product profile page: `product.html?id=PRODUCT_ID`
- Local admin editor: `admin.html`
- Product data: `data/items.json`

---

## Project structure

```
App_home-sale/
├─ index.html          # public catalog homepage
├─ product.html        # reusable product profile page
├─ admin.html          # local admin editor (no login, no server)
├─ styles.css          # shared styles
├─ script.js           # catalog logic
├─ product.js          # product page + lightbox
├─ admin.js            # admin editor logic
├─ icons.js            # shared SVG icon + image placeholder helpers
├─ data/
│  └─ items.json       # product data (source of truth)
├─ IMAGE-GUIDE.md      # real photo workflow and naming guide
├─ PRODUCT-DATA-TEMPLATE.md  # fill-in template for real product entries
├─ FINAL-QA-CHECKLIST.md     # pre-publish QA checklist (Phase 10)
├─ images/
│  ├─ furniture/  electronics/  appliances/  kitchen/
│  ├─ kids/  decor/  other/     # product images by category
├─ delivery-report.md
└─ README.md
```

---

## Previewing locally

The site loads `data/items.json` with `fetch()`, which browsers block when you open the file
directly (`file://`). Use a simple local server instead.

### Option A — VS Code Live Server
1. Install the **Live Server** extension.
2. Right-click `index.html` and choose **Open with Live Server**.
3. Your browser opens at something like `http://127.0.0.1:5500/index.html`.

### Option B — Python local server
From the project root:

```bash
python -m http.server 8000
```

Then open:
- Catalog: `http://localhost:8000/index.html`
- Product: `http://localhost:8000/product.html?id=sofa-set`
- Admin: `http://localhost:8000/admin.html`

---

## Typography

- **Heading font:** [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) — hero title, section headings, product titles, admin page title.
- **Body font:** [Inter](https://fonts.google.com/specimen/Inter) — paragraphs, buttons, forms, tables, specs, and prices (kept readable).
- Fonts load from Google Fonts in `index.html`, `product.html`, and `admin.html`.
- CSS variables in `styles.css`: `--font-heading` and `--font-body`.

**Pricing display:** amounts use `meta.currency` (default `Rs.`) and format like **Rs. 12,000** — never hardcoded AED.

---

## Image optimization and WebP publishing

Real product photos should be published as **`.webp`** for faster GitHub Pages loading.

**Conversion settings used in Phase 12:**

- Tool: Python Pillow
- Quality: **75–82** (project default: 80)
- Max width: **1600px** (aspect ratio preserved)
- Metadata stripped via Pillow save

**Workflow:**

1. Copy source `.jpg` / `.png` photos into `images/<category>/`.
2. Run `python convert_to_webp.py` (or convert manually with the same settings).
3. Keep originals in **`image-source-backup/`** — active `images/` folders should reference `.webp` only.
4. Update `data/items.json` image paths to `.webp` (e.g. `images/furniture/sofa-003-beige-tufted-01.webp`).
5. Test catalog and product pages locally before publishing.

**Filename rules:**

- Lowercase, hyphens only — no spaces, brackets, or `(1)` Windows duplicate suffixes.
- GitHub Pages paths are **case-sensitive**.
- Prefer `product-name-01.webp`, `product-name-02.webp` in `items.json`.

See **`IMAGE-CONVERSION-REPORT.md`** for the latest conversion summary.

---

## Real photo workflow

When you are ready to replace sample placeholder images with real product photos:

1. Put each photo in the correct category folder:
   - `images/furniture/`, `images/electronics/`, `images/appliances/`, `images/kitchen/`,
     `images/kids/`, `images/decor/`, or `images/other/`.
2. Use **lowercase file names** with **hyphens instead of spaces**.
3. Recommended format: **`.jpg`** or **`.webp`**.
4. Recommended width: **1200px to 1600px** (landscape works best for cards).
5. Keep each image **below 500 KB** if possible (compress before uploading).
6. Update the product's `images` array in `data/items.json` (or via `admin.html`):

- `images/furniture/sofa-003-beige-tufted-01.webp`
- `images/furniture/sofa-003-beige-tufted-02.webp`
- `images/appliances/refrigerator-001-hitachi-black-side-by-side-01.webp`

7. Export from admin if you edited in the browser, then replace `data/items.json`.
8. Refresh the site through your local server and check cards + product page + lightbox.

If a path is wrong or a file is missing, the site shows a clean warm placeholder (not an error screen).

---

## Image integration

Use these path examples when adding real photos (one path per line in admin, or in the `images` array in JSON):

```
images/furniture/sofa-set-01.jpg
images/furniture/sofa-set-02.jpg
images/electronics/led-tv-01.jpg
```

**Important:** image paths are **case-sensitive on GitHub Pages**. The filename in JSON must match the file on disk exactly (lowercase, hyphens, correct extension).

See **`IMAGE-GUIDE.md`** for folder layout, naming rules, file size tips, and the full publish checklist.

---

## Real product data setup

Use **`admin.html`** to add, edit, duplicate, and remove products before publishing.

1. Open `admin.html` through a local server (see [Previewing locally](#previewing-locally)).
2. Replace sample products with your real items, or edit them in place.
3. Enter **numeric prices only** (e.g. `45000`) — the site displays **Rs. 45,000** from Site settings.
4. Set a real **Pakistan WhatsApp number** in Site settings (e.g. `923001234567`).
5. Add image paths that match files in `images/<category>/` (see `IMAGE-GUIDE.md`).
6. Use **Duplicate** on similar items to save time, then edit the copy.
7. Click **Export items.json** when finished.
8. Replace **`data/items.json`** in the project with the exported file.
9. Test every product page: `product.html?id=your-product-id`.

Use **`PRODUCT-DATA-TEMPLATE.md`** for a fill-in worksheet with category-specific spec examples.

### Before final QA

- [ ] Sample products removed or replaced with real items
- [ ] Real photos added (`.jpg` or `.webp`, not `.svg` placeholders)
- [ ] Image paths validated in admin (preview + export warnings)
- [ ] Real prices added (numeric values in JSON)
- [ ] Real WhatsApp number added in Site settings
- [ ] Sold / reserved status checked on each item
- [ ] Featured items selected for homepage priority
- [ ] Exported `items.json` replaced in `data/items.json`
- [ ] All product pages tested locally

---

## Pre-QA real data checklist

Work through this list before GitHub Pages deployment:

- [ ] Real Pakistan WhatsApp number added in Site settings
- [ ] Sample products replaced or intentionally kept
- [ ] Real Rs. prices added (numeric values in JSON, not formatted strings)
- [ ] Real photos copied into `images/` category folders
- [ ] Image paths updated in admin or `data/items.json`
- [ ] SVG placeholders removed unless intentionally kept
- [ ] Featured items selected for homepage priority
- [ ] Sold / reserved status checked on each item
- [ ] Product pages opened locally (`product.html?id=...`)
- [ ] WhatsApp inquiry links tested (correct number and Rs. message)
- [ ] Admin exported valid `items.json`
- [ ] `data/items.json` replaced in the project
- [ ] Public catalog and product pages checked — all images load (admin cannot verify file existence before publish)

Use the **Real-data readiness** panel in `admin.html` to see what is still pending.

For a full pass before GitHub Pages, work through **`FINAL-QA-CHECKLIST.md`** at the project root.

---

## Before publishing — real-photo checklist

Work through this list before going live with real items:

- [ ] Replace placeholder images with real product photos.
- [ ] Put images in the correct category folder (`images/furniture/`, `images/electronics/`, etc.).
- [ ] Use lowercase image names with hyphens instead of spaces (e.g. `sofa-01.jpg`).
- [ ] Update `data/items.json` (titles, prices, status, condition, specs, `featured`).
- [ ] Update the WhatsApp number (`meta.whatsapp`) and pickup note (`meta.pickupNote`) in admin or `data/items.json`.
- [ ] Test `index.html`.
- [ ] Test `product.html?id=sample-id` (use a real product id).
- [ ] Test `admin.html` export.
- [ ] Test a WhatsApp link opens the correct chat with the pre-filled message.
- [ ] Test the mobile view (narrow the browser or use device emulation).

---

## Managing products

All product data lives in `data/items.json`. Each item has:

```json
{
  "id": "sofa-set",
  "title": "3-Seater Fabric Sofa Set",
  "category": "Furniture",
  "price": 45000,
  "status": "Available",
  "featured": true,
  "condition": "Very good - light use",
  "description": "Comfortable 3-seater sofa...",
  "images": ["images/furniture/sofa-set-01.jpg"],
  "specs": { "Material": "Fabric", "Dimensions": "210 x 90 x 85 cm" }
}
```

The `meta` block holds site-wide settings:

```json
"meta": {
  "currency": "Rs.",
  "whatsapp": "971500000000",
  "pickupNote": "Pickup from Karachi. Exact location shared after confirmation.",
  "updated": "2026-07-07"
}
```

> **Default for this project:** currency is **Rs.** and pickup location is **Karachi, Pakistan**.

- `status` must be one of: `Available`, `Reserved`, `Sold`.
- `Sold` items show a **Sold** badge and their WhatsApp button is disabled.
- `Reserved` items still allow WhatsApp inquiries.
- `featured: true` products appear first on the homepage (and show a Featured tag).
- `specs` is a free-form object; add whatever fields suit the category. The homepage card
  shows the first two specs as a preview.
- The homepage has a **Sort** dropdown: Featured first, Price low to high, Price high to low,
  Newest first, Available first.

### Adding items (via admin.html — recommended)
1. Open `admin.html` through a local server.
2. Click **+ Add new product** and fill in the fields (ID, title, category, price, status, etc.).
3. Add image paths and specs using the **+ Add image path** / **+ Add spec** buttons.
4. Click **Save product**.
5. Click **Export items.json** and replace `data/items.json` (see below).

### Adding items (by hand)
Edit `data/items.json` and add a new object to the `items` array. Keep each `id` unique and use
only lowercase letters, numbers, and hyphens.

### Adding images
1. Drop your image files into the matching category folder, e.g.
   `images/furniture/my-sofa-1.jpg`.
2. Reference them in the item's `images` array (first image is the main/cover image):
   ```json
   "images": ["images/furniture/my-sofa-1.jpg", "images/furniture/my-sofa-2.jpg"]
   ```
3. If an image path is missing, the site shows a warm gold/black SVG placeholder automatically.

### Editing prices and status with admin.html
- **Quick edit price:** change the number in the price cell of the products table.
- **Quick edit status:** change the dropdown in the status cell.
- Full edits (title, description, images, specs): click **Edit** on a row.
- Changes are kept in the page (and backed up to your browser as a draft) until you export.

### Exporting items.json
1. In `admin.html`, click **Export items.json**.
2. Required fields are validated first; fix any reported problems.
3. Your browser downloads an updated `items.json`.

### Replacing data/items.json
1. Move the downloaded `items.json` into the project's `data/` folder,
   replacing the existing `data/items.json`.
2. Refresh `index.html` to see the changes.
3. Commit and push when you're ready to publish.

> The admin page never saves online. It only exports a file you place back into the project —
> this is by design because GitHub Pages is static hosting.

---

## Site settings (meta)

Site-wide settings live at the top of `data/items.json` under `meta`:

| Field | Purpose |
| --- | --- |
| `whatsapp` | WhatsApp inquiry number (international, no `+` or spaces) |
| `pickupNote` | Pickup message shown on the homepage and product pages |
| `currency` | Price label (default `Rs.`) |

### Change in admin.html (recommended)
1. Open `admin.html` through a local server.
2. Edit **Site settings** at the top (WhatsApp number, currency, pickup note).
3. Click **Save site settings**.
4. Click **Export items.json** and replace `data/items.json` in the project.

### Change by hand
Edit `meta` in `data/items.json` directly.

> After any admin edits, export `items.json` and replace `data/items.json` manually — the admin page does not save to disk on its own.

---

## Changing the WhatsApp number

The WhatsApp number is stored in `data/items.json` under `meta.whatsapp` (or edit it in **Site settings** on `admin.html`):

```json
"meta": { "currency": "Rs.", "whatsapp": "971500000000" }
```

Change `"971500000000"` to your full international number (country code, no `+`, no spaces),
e.g. `"923001234567"` for Pakistan or `"9715XXXXXXXX"` for UAE. All WhatsApp buttons update automatically.

WhatsApp messages include the product title, price as **Rs. 12,000** (from `meta.currency`), a product page link, and an inquiry sentence.

---

## Publishing to GitHub Pages

1. Complete **`FINAL-QA-CHECKLIST.md`** locally first.
2. Create a GitHub repository and push this project to it.
3. In the repo, go to **Settings > Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Choose the `main` branch and the `/ (root)` folder, then **Save**.
6. After a minute, your site is live at
   `https://<your-username>.github.io/<repo-name>/`.
7. To update products later: edit/export `items.json`, replace `data/items.json`, commit, and push.

**Before publishing:** replace placeholder WhatsApp (`971500000000`), sample products, and SVG image paths with your real data. The site code is GitHub Pages compatible; content readiness is separate.

---

## Theme and icons

- The site uses a **light luxury black and gold theme** — a bright, warm off-white base rather
  than a dark theme. Colors are defined as CSS variables at the top of `styles.css`.
- **Gold is the main brand accent** (header/hero, buttons, highlights, icons, borders, badges,
  and prices).
- **Black is used for typography and contrast** (headings, body text, borders, and premium
  accents such as the footer strip).
- **Cards and content surfaces use white or warm off-white backgrounds.**
- UI icons are **SVG only** — there are no emoji or text-symbol icons anywhere in the interface.
- Icons come from a small shared helper in `icons.js` (the `icon(name, opts)` function). When you
  add new UI elements, use `icon("name")` or an inline `<svg>` — **do not use emoji icons**.
- Decorative icons include `aria-hidden="true"`; icon-only buttons (e.g. the lightbox controls)
  keep a text `aria-label`.
- The image lightbox keeps a dark overlay on purpose, so photos stand out while viewing.
- Product images should remain **real photos inside the `images/<category>/` folders** (the theme
  only styles the UI chrome, not your product photos).

---

## Notes

- Prices are shown in **Rs.** (Pakistani Rupee) by default, loaded from `meta.currency`.
- Pickup is from **Karachi** — exact location shared after confirmation.
- No login, no checkout. Google Fonts is the only external dependency (Playfair Display + Inter).
