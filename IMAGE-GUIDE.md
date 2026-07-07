# Image Integration Guide — Home Sale Catalog

This guide explains how to add real product photos to the static catalog. The site runs on
GitHub Pages with no backend, so images must be copied into the project folder and referenced
by path in `data/items.json`.

---

## Where to place images

Use the existing category folders under `images/`:

```
images/
├─ furniture/
├─ electronics/
├─ appliances/
├─ kitchen/
├─ kids/
├─ decor/
└─ other/
```

Put each product photo in the folder that matches its category. For example, a sofa goes in
`images/furniture/`, a TV in `images/electronics/`.

---

## Final publishing format: WebP

**Published catalog images should be `.webp`.** Source photos may arrive as `.jpg` or `.png` — convert before final QA.

Run the project converter (requires Python Pillow):

```bash
python convert_to_webp.py
```

Or convert manually with quality **75–82** and max width **1600px**. Keep originals in `image-source-backup/`.

**Path format in `data/items.json`:**

```
images/furniture/sofa-003-beige-tufted-01.webp
images/kitchen/dinner-set-001-white-gold-01.webp
```

---

## How to name images

Use this format:

```
category-product-name-number.webp
```

**Examples:**

- `images/furniture/sofa-003-beige-tufted-01.webp`
- `images/furniture/sofa-003-beige-tufted-02.webp`
- `images/appliances/refrigerator-001-hitachi-black-side-by-side-01.webp`
- `images/kitchen/dinner-set-001-white-gold-01.webp`
- `images/decor/wall-art-003-traditional-decor-01.webp`

**Rules:**

- Use **lowercase** filenames only.
- Use **hyphens** instead of spaces.
- Add one or more images per product (`-01`, `-02`, `-03`, …).
- Avoid WhatsApp default names like `IMG-20260707-WA0038.jpg` — rename before adding.

---

## Recommended file types

| Type | Notes |
|------|--------|
| **Published** | `.webp` — use in `data/items.json` and on GitHub Pages |
| **Source** | `.jpg`, `.jpeg`, `.png` — convert before publishing; store originals in `image-source-backup/` |
| **Placeholder** | `.svg` — UI fallback only; not for real product photos |

- **Recommended width:** 1200px to 1600px (landscape works best for catalog cards).
- **File size:** keep each image **below 500 KB** when possible (compress before copying).

---

## Updating product data

1. Copy your photos into the correct `images/<category>/` folder.
2. Open **`admin.html`** through a local server (see README).
3. Edit each product and add one image path per row in the **Images (paths)** section.
4. Use the thumbnail preview to confirm paths look correct.
5. Fix any validation messages shown when you save or export.
6. Click **Export items.json**.
7. Replace **`data/items.json`** in the project with the exported file.
8. Refresh the public site and check cards, product page, and lightbox.

You can also edit `data/items.json` directly:

```json
"images": [
  "images/furniture/sofa-003-beige-tufted-01.webp",
  "images/furniture/sofa-003-beige-tufted-02.webp"
]
```

---

## Path validation (admin)

The admin editor validates image **path format** only (not whether the file exists on disk):

- Path must start with `images/`
- Must include a valid category folder
- Allowed extensions: `.webp` (preferred), `.jpg`, `.jpeg`, `.png`, `.svg`

Warnings (export still allowed):

- `.jpg` / `.png` paths — prefer `.webp` for publishing
- `.svg` paths — placeholder only; use `.webp` for real photos
- Uppercase letters in the filename (paths are case-sensitive on GitHub Pages)
- Spaces in the filename (spaces break image URLs)
- Parentheses or `(1)` duplicate suffixes in filenames
- Product has no images
- Filename looks like a WhatsApp default (`IMG-`, `-WA`, etc.)

---

## GitHub Pages note

**Image paths are case-sensitive on GitHub Pages.** Use exact filenames in JSON that match the
files on disk (`sofa-003-beige-tufted-01.webp`, not `Sofa-003.WEBP`).

---

## Broken or missing images

If a path is wrong or a file is missing, the site shows a warm SVG placeholder instead of a
broken-image icon. Fix the path in admin and export again.

---

## Before publishing checklist

- [ ] Real photos copied into `images/` category folders
- [ ] Filenames lowercase with hyphens
- [ ] Product `images` arrays updated in admin or JSON
- [ ] Thumbnail previews checked in admin edit modal
- [ ] Broken images checked on homepage and product pages
- [ ] `items.json` exported from admin
- [ ] `data/items.json` replaced in the project
- [ ] Site tested locally before publishing

See also **README.md** and the checklist in **admin.html**.
