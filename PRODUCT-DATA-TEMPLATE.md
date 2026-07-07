# Product Data Template — Home Sale Catalog

Use this fill-in format when preparing real home-sale items. Copy one block per product,
then enter the details in **admin.html** (or directly in `data/items.json`).

**Price:** enter numbers only (e.g. `45000`). The site displays **Rs. 45,000** automatically from Site settings.

**Status:** use `Available`, `Reserved`, or `Sold` (capitalized in admin).

**Featured:** `yes` / `no` — featured items appear first on the homepage.

**Images:** one path per line, e.g. `images/furniture/sofa-set-01.jpg` (see `IMAGE-GUIDE.md`).

---

## Generic item template

```
Product title:
Category:
Price Rs.:
Status: available / reserved / sold
Condition:
Short description:
Specifications:
Images:
Featured: yes / no
```

---

## Furniture

```
Product title: 3-Seater Fabric Sofa Set
Category: Furniture
Price Rs.: 45000
Status: available
Condition: Very good - light use, no stains
Short description: Comfortable 3-seater fabric sofa with matching cushions. Smoke-free home.
Specifications:
  Material: Fabric with wooden frame
  Dimensions: 210 x 90 x 85 cm
  Color: Warm grey
  Assembly: No assembly required
Images:
  images/furniture/sofa-set-01.jpg
  images/furniture/sofa-set-02.jpg
Featured: yes
```

**Suggested spec fields:** Material · Dimensions · Color · Assembly

---

## Electronics

```
Product title: 55-inch 4K LED Smart TV
Category: Electronics
Price Rs.: 85000
Status: available
Condition: Excellent - like new
Short description: Crisp 4K smart TV with remote and stand. Screen flawless.
Specifications:
  Brand: Samsung
  Model: AU8000
  Size: 55 inch
  Accessories: Remote, stand, power cable
Images:
  images/electronics/led-tv-01.jpg
Featured: yes
```

**Suggested spec fields:** Brand · Model · Size · Accessories

---

## Appliances

```
Product title: 8kg Front Load Washing Machine
Category: Appliances
Price Rs.: 55000
Status: sold
Condition: Good - fully working
Short description: Reliable front-load washer, multiple programs. Selling due to relocation.
Specifications:
  Brand: Bosch
  Capacity: 8 kg
  Power: 220V
  Warranty: None (used item)
Images:
  images/appliances/washing-machine-01.jpg
Featured: no
```

**Suggested spec fields:** Brand · Capacity · Power · Warranty

---

## Kitchen

```
Product title: Non-Stick Cookware Set (10 Pieces)
Category: Kitchen
Price Rs.: 12000
Status: available
Condition: Very good - lightly used
Short description: Complete non-stick set with lids. No scratches on cooking surfaces.
Specifications:
  Material: Aluminium with non-stick coating
  Quantity: 10 pieces
  Set Includes: Pots, pans, lids, utensils
Images:
  images/kitchen/cookware-set-01.jpg
Featured: no
```

**Suggested spec fields:** Material · Quantity · Set Includes

---

## Kids

```
Product title: Kids Bicycle with Training Wheels
Category: Kids
Price Rs.: 8500
Status: reserved
Condition: Good - normal wear
Short description: Sturdy bicycle with training wheels and bell. Suitable for beginners.
Specifications:
  Age Range: 4 - 7 years
  Pieces: Bicycle + training wheels + bell
  Safety Condition: Brakes checked, tires good
Images:
  images/kids/kids-bicycle-01.jpg
Featured: no
```

**Suggested spec fields:** Age Range · Pieces · Safety Condition

---

## Decor

```
Product title: Framed Abstract Wall Art (Set of 3)
Category: Decor
Price Rs.: 6500
Status: available
Condition: Excellent - like new
Short description: Three matching framed prints. Ready to hang.
Specifications:
  Material: Canvas print with wooden frame
  Size: 40 x 60 cm each
  Color: Blue and gold tones
Images:
  images/decor/wall-art-01.jpg
Featured: no
```

**Suggested spec fields:** Material · Size · Color

---

## Other

```
Product title: HEPA Air Purifier
Category: Other
Price Rs.: 15000
Status: available
Condition: Very good - recently cleaned
Short description: Quiet air purifier for bedroom or small living room.
Specifications:
  Type: HEPA filter purifier
  Details: 3 speed settings, filter replaced 2 months ago
  Condition Notes: Fully working, includes power cable
Images:
  images/other/air-purifier-01.jpg
Featured: no
```

**Suggested spec fields:** Type · Details · Condition Notes

---

## After filling in your data

1. Open **admin.html** through a local server.
2. Add or edit each product (or paste into JSON carefully).
3. Use **Duplicate** in admin to copy similar items quickly.
4. Fix any validation warnings (sample products, SVG images, placeholder WhatsApp).
5. **Export items.json** and replace **data/items.json**.
6. Test every product page: `product.html?id=your-product-id`.

See **README.md** → Real product data setup.
