# Image Conversion Report — Home Sale Catalog

**Phase 12** · Completed 2026-07-08

## Summary

| Metric | Count |
|--------|------:|
| Conversion tool | Python Pillow 10.4.0 |
| Quality / max width | 80 / 1600px |
| Source images found | 85 |
| Converted to WebP | 85 |
| Skipped | 0 |
| Failed conversions | 0 |
| Backup copies | 85 |
| Originals moved to backup | 85 |
| Products in `data/items.json` | 49 |

## Filename conflicts resolved

Windows duplicate suffixes were cleaned during conversion:

- `decorative-vase-set-001-white-floral-01 (2).jpg` → `decorative-vase-set-001-white-floral-02.webp`
- `serving-dish-set-001-white-gold-01 (2).jpg` → `serving-dish-set-001-white-gold-02.webp`
- `serving-dish-set-001-white-gold-01 (3).jpg` → `serving-dish-set-001-white-gold-03.webp`

During the misplaced-file audit, a same-name collision was resolved:

- `images/furniture/light-tree-001-flower-branch-01.webp` (a distinct second photo) → moved to `images/decor/light-tree-001-flower-branch-02.webp` (incremented to avoid overwriting the existing decor `-01`).

## Misplaced files moved

- **kids-curtain-001-blue-cars** — already in `images/decor/` (correct; curtains stay in Decor). No move required.
- **islamic-wall-art-001-allah-names** — moved `images/furniture/` → `images/decor/` (wall art belongs in Decor). Product category updated to Decor.
- **islamic-wall-art-002-allah-rasool-muhammad** — moved `images/furniture/` → `images/decor/`. Product category updated to Decor.
- **light-tree-001-flower-branch** — the furniture copy moved to `images/decor/` as `-02` and merged into the single Decor light-tree product (two photos). The duplicate Furniture product entry (same `id`) was removed.

## Final folder counts

| Folder | WebP | SVG placeholders |
|--------|-----:|-----------------:|
| appliances | 1 | 2 |
| decor | 32 | 2 |
| electronics | 0 | 2 |
| furniture | 37 | 5 |
| kids | 0 | 2 |
| kitchen | 15 | 2 |
| other | 0 | 2 |

## Remaining files in active `images/` folders

- **.jpg / .jpeg / .png:** 0 (all moved to `image-source-backup/`)
- **.webp:** 85 real product photos
- **.svg:** 17 legacy placeholders (appliances, decor, electronics, furniture, kids, kitchen, other — categories/products without real photos yet)

## Backup location

Original JPEG sources preserved at:

```
image-source-backup/
├─ appliances/
├─ decor/
├─ furniture/
└─ kitchen/
```

## Failed conversions

None.

## Integration notes

- All `data/items.json` image paths now use `.webp`.
- Product **prices** set to `0` until real Rs. amounts are entered in admin.
- **WhatsApp** number remains placeholder (`971500000000`) until updated in Site settings.
- Machine-readable log: `IMAGE-CONVERSION-REPORT.json`
