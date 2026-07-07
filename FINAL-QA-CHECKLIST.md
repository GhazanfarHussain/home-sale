# Final QA Checklist — Home Sale Catalog

Use this checklist before publishing to **GitHub Pages**. Run the site locally first:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/index.html`, product pages, and `admin.html`.

See also: `README.md`, `IMAGE-GUIDE.md`, `PRODUCT-DATA-TEMPLATE.md`.

---

## Data checks

- [ ] `data/items.json` is valid JSON (opens without errors)
- [ ] `meta.currency` is `Rs.`
- [ ] `meta.pickupNote` mentions Karachi pickup
- [ ] `meta.whatsapp` is your real Pakistan number (not `971500000000`)
- [ ] Every product has: `id`, `title`, `category`, `price`, `status`, `condition`, `description`, `images`, `specs`, `featured`
- [ ] All prices are **numeric** (e.g. `45000`) — not `"Rs. 45,000"`
- [ ] All product IDs are unique (lowercase, hyphens only)
- [ ] Categories match: Furniture, Electronics, Appliances, Kitchen, Kids, Decor, Other
- [ ] Sample product IDs removed or intentionally kept (`sofa-set`, `led-tv`, etc.)

---

## Image checks

- [ ] Real photos copied into `images/<category>/` folders
- [ ] Filenames are lowercase with hyphens
- [ ] Image paths in JSON match files on disk exactly (case-sensitive on GitHub Pages)
- [ ] SVG placeholder paths replaced with `.jpg` or `.webp` unless intentional
- [ ] Admin image previews look correct
- [ ] **After export:** open catalog and every product page locally — confirm images load (admin cannot verify all files exist)

---

## WhatsApp checks

- [ ] Real Pakistan WhatsApp number saved in admin Site settings
- [ ] Exported `items.json` includes the updated number in `meta.whatsapp`
- [ ] Homepage WhatsApp button opens correct chat
- [ ] Product page WhatsApp includes: product title, **Rs.** price, product link
- [ ] **Sold** products show disabled inquiry button (no WhatsApp link)
- [ ] **Reserved** and **Available** products still allow WhatsApp inquiry

---

## Homepage checks (`index.html`)

- [ ] Header and Karachi pickup note load
- [ ] Product grid shows all items
- [ ] Cards show **Rs.** pricing and photo count badges
- [ ] Search filters products correctly
- [ ] Category chips filter correctly
- [ ] Sort works: Featured first, Price low/high, Newest, Available first
- [ ] Empty state appears when search has no matches
- [ ] Featured tags visible on featured items
- [ ] Sold items show disabled Sold button on card
- [ ] Browser console has no errors

---

## Product page checks (`product.html?id=...`)

Test at least:

- [ ] One **Available** product (e.g. `sofa-set`)
- [ ] One **Reserved** product (e.g. `dining-table`)
- [ ] One **Sold** product (e.g. `washing-machine`)
- [ ] One **multi-image** product (e.g. `sofa-set` — 3 photos)
- [ ] One **invalid id** (e.g. `does-not-exist`) shows not-found message

For each valid product verify:

- [ ] Title, **Rs.** price, status badge, Karachi pickup note
- [ ] Description and specs table
- [ ] Main image and thumbnails
- [ ] Lightbox: open, next, previous, close, Escape key
- [ ] Similar items section (when same-category items exist)
- [ ] WhatsApp message content is correct

---

## Admin checks (`admin.html`)

- [ ] Site settings load (Rs., Karachi, WhatsApp)
- [ ] **Real-data readiness** panel shows accurate status
- [ ] Product table loads; search and filters work
- [ ] Quick price / status / featured edits work
- [ ] Duplicate, Add, Edit, Delete (with confirmation) work
- [ ] Image path previews and validation messages work
- [ ] Export separates **errors** (blocks) from **warnings** (allows)
- [ ] Exported JSON is valid with numeric prices
- [ ] Import JSON and Reset changes work
- [ ] Hide sample warnings for session works (session only)

---

## Mobile checks

Test at approximately **390px**, **430px**, **768px**, **1024px**, and **1440px** width:

- [ ] No horizontal page scroll (except admin table scroll area)
- [ ] Header height is reasonable
- [ ] Search, filters, and sort are usable
- [ ] Product cards do not overflow; buttons are tappable (44px+ targets)
- [ ] Product page gallery and price card layout cleanly
- [ ] Lightbox controls are usable on small screens
- [ ] Admin table scrolls horizontally inside its container
- [ ] Edit modal fits on screen and scrolls if needed

---

## GitHub Pages checks

- [ ] All asset links are **relative** (`styles.css`, `data/items.json`, `images/...`)
- [ ] No `localhost` or absolute dev URLs in HTML/JS/CSS
- [ ] `product.html?id=product-id` links work from cards and similar items
- [ ] `fetch('data/items.json')` works when served over HTTP (not `file://`)
- [ ] README documents: local server, admin export workflow, GitHub Pages deploy steps
- [ ] Image path case sensitivity noted in README / IMAGE-GUIDE

---

## Final publish checklist

- [ ] Real Pakistan WhatsApp number in `meta.whatsapp`
- [ ] Sample products replaced or intentionally kept
- [ ] Real Rs. prices entered (numeric in JSON)
- [ ] Real photos in `images/` folders; paths updated
- [ ] SVG placeholders removed unless intentional
- [ ] Featured items chosen for homepage
- [ ] Sold / reserved statuses verified
- [ ] All product pages tested locally
- [ ] WhatsApp links tested on phone or desktop
- [ ] Admin exported valid `items.json`
- [ ] `data/items.json` replaced in project
- [ ] Final pass through this checklist completed
- [ ] Commit and push to GitHub; enable Pages on `main` / root

**Publish readiness:** only go live when data, images, and WhatsApp are real — not while placeholder sample data remains unless that is intentional for a demo.
