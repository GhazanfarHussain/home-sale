"""
Phase 12 — Convert real product photos to WebP, backup originals, emit report JSON.
Uses Pillow. Run once from project root: python convert_to_webp.py
"""
import json
import re
import shutil
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
IMAGES = ROOT / "images"
BACKUP = ROOT / "image-source-backup"
REPORT_PATH = ROOT / "IMAGE-CONVERSION-REPORT.json"
CATEGORIES = [
    "appliances",
    "decor",
    "electronics",
    "furniture",
    "kids",
    "kitchen",
    "other",
]
SOURCE_EXTS = {".jpg", ".jpeg", ".png"}
QUALITY = 80
MAX_WIDTH = 1600

# Misplaced file rules: (filename prefix, wrong folder, correct folder)
MISPLACE_RULES = [
    ("kids-curtain", "kids", "decor"),  # curtains stay in decor
]

FOLDER_TO_CATEGORY = {
    "appliances": "Appliances",
    "decor": "Decor",
    "electronics": "Electronics",
    "furniture": "Furniture",
    "kids": "Kids",
    "kitchen": "Kitchen",
    "other": "Other",
}

DEFAULT_SPECS = {
    "Appliances": {"Brand": "See photos", "Condition": "Pre-owned"},
    "Kitchen": {"Material": "See photos", "Set Includes": "As shown in photos"},
    "Furniture": {"Material": "See photos", "Color": "See photos"},
    "Decor": {"Material": "See photos", "Size": "See photos"},
    "Electronics": {"Brand": "See photos", "Accessories": "As shown"},
    "Kids": {"Age Range": "See photos", "Condition": "Pre-owned"},
    "Other": {"Type": "Home item", "Details": "See photos"},
}


def clean_stem(name: str) -> str:
    stem = Path(name).stem
    stem = re.sub(r"\s+\(\d+\)$", "", stem)
    stem = stem.lower().replace(" ", "-")
    stem = re.sub(r"[()]", "", stem)
    return stem


def product_base(stem: str) -> str:
    m = re.match(r"^(.+)-(\d{2})$", stem)
    return m.group(1) if m else stem


def title_from_slug(slug: str) -> str:
    m = re.match(r"^(.+?)-(\d{3})-(.+)$", slug)
    if m:
        type_part = " ".join(w.capitalize() for w in m.group(1).split("-"))
        desc_part = " ".join(w.capitalize() for w in m.group(3).split("-"))
        if desc_part.lower().endswith(type_part.lower().split()[-1]):
            return desc_part
        return f"{desc_part} {type_part}"
    parts = [p for p in slug.split("-") if p and not re.match(r"^\d{2,3}$", p)]
    return " ".join(p.capitalize() for p in parts)


def plan_folder(folder: Path, category: str) -> list[dict]:
    files = sorted(
        [f for f in folder.iterdir() if f.is_file() and f.suffix.lower() in SOURCE_EXTS],
        key=lambda f: f.name.lower(),
    )
    product_files: dict[str, list[Path]] = defaultdict(list)
    for f in files:
        stem = clean_stem(f.name)
        base = product_base(stem)
        product_files[base].append(f)

    plans = []
    for base in sorted(product_files.keys()):
        flist = sorted(product_files[base], key=lambda x: x.name.lower())
        used_names: set[str] = set()
        for idx, src in enumerate(flist, start=1):
            webp_name = f"{base}-{idx:02d}.webp"
            while webp_name in used_names:
                idx += 1
                webp_name = f"{base}-{idx:02d}.webp"
            used_names.add(webp_name)
            plans.append(
                {
                    "category": category,
                    "src": src,
                    "webp": folder / webp_name,
                    "base": base,
                    "webp_name": webp_name,
                }
            )
    return plans


def convert_image(src: Path, dest: Path) -> dict:
    img = Image.open(src)
    img = ImageOps.exif_transpose(img)
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGB")
    w, h = img.size
    if w > MAX_WIDTH:
        h = max(1, int(h * MAX_WIDTH / w))
        img = img.resize((MAX_WIDTH, h), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "WEBP", quality=QUALITY, method=6)
    verify = Image.open(dest)
    verify.verify()
    return {"width": img.size[0], "height": img.size[1], "bytes": dest.stat().st_size}


def backup_copy(src: Path, category: str) -> Path:
    dest_dir = BACKUP / category
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / src.name
    if not dest.exists():
        shutil.copy2(src, dest)
    return dest


def audit_misplaced(plans: list[dict]) -> list[dict]:
    moves = []
    for plan in plans:
        name = plan["src"].name.lower()
        cat = plan["category"]
        for prefix, wrong, right in MISPLACE_RULES:
            if name.startswith(prefix) and cat == wrong:
                new_folder = IMAGES / right
                plan["webp"] = new_folder / plan["webp_name"]
                plan["category"] = right
                moves.append(
                    {
                        "file": plan["webp_name"],
                        "from": wrong,
                        "to": right,
                        "reason": f"{prefix} belongs in {right}",
                    }
                )
                break
    return moves


def build_items_json(products: dict) -> dict:
    items = []
    for (category, base) in sorted(products.keys()):
        data = products[(category, base)]
        paths = sorted(data["paths"])
        cat_name = FOLDER_TO_CATEGORY[category]
        item = {
            "id": base,
            "title": title_from_slug(base),
            "category": cat_name,
            "price": 0,
            "status": "Available",
            "featured": False,
            "condition": "Good — see photos for details",
            "description": (
                f"Pre-loved {title_from_slug(base).lower()} available for pickup in Karachi. "
                "Message on WhatsApp to inquire or reserve."
            ),
            "images": paths,
            "specs": dict(DEFAULT_SPECS.get(cat_name, {"Details": "See photos"})),
        }
        items.append(item)
    return items


def main():
    report = {
        "tool": "Python Pillow",
        "quality": QUALITY,
        "max_width": MAX_WIDTH,
        "started": datetime.now(timezone.utc).isoformat(),
        "source_images_found": 0,
        "converted": 0,
        "skipped": 0,
        "failed": [],
        "backup_copies": 0,
        "originals_moved": 0,
        "filename_conflicts": [],
        "misplaced_moves": [],
        "conversions": [],
        "folder_counts": {},
    }

    all_plans: list[dict] = []
    for cat in CATEGORIES:
        folder = IMAGES / cat
        if not folder.exists():
            continue
        all_plans.extend(plan_folder(folder, cat))

    report["source_images_found"] = len(all_plans)
    report["misplaced_moves"] = audit_misplaced(all_plans)

    # Backup before conversion
    BACKUP.mkdir(parents=True, exist_ok=True)
    for plan in all_plans:
        backup_copy(plan["src"], plan["category"])
        report["backup_copies"] += 1

    products: dict = defaultdict(lambda: {"paths": []})

    for plan in all_plans:
        src = plan["src"]
        dest = plan["webp"]
        dest.parent.mkdir(parents=True, exist_ok=True)
        if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
            report["skipped"] += 1
        else:
            try:
                info = convert_image(src, dest)
                report["converted"] += 1
                report["conversions"].append(
                    {
                        "from": str(src.relative_to(ROOT)).replace("\\", "/"),
                        "to": str(dest.relative_to(ROOT)).replace("\\", "/"),
                        **info,
                    }
                )
            except Exception as e:
                report["failed"].append({"file": str(src), "error": str(e)})
                continue

        rel = str(dest.relative_to(ROOT)).replace("\\", "/")
        products[(plan["category"], plan["base"])]["paths"].append(rel)

        # Move original to backup (not in active images folder)
        backup_dest = BACKUP / plan["category"] / src.name
        if src.exists():
            if not backup_dest.exists():
                shutil.copy2(src, backup_dest)
            src.unlink()
            report["originals_moved"] += 1

    # Folder counts
    for cat in CATEGORIES:
        folder = IMAGES / cat
        if not folder.exists():
            continue
        report["folder_counts"][cat] = {
            "webp": len(list(folder.glob("*.webp"))),
            "svg": len(list(folder.glob("*.svg"))),
            "jpg": len(list(folder.glob("*.jpg"))),
            "jpeg": len(list(folder.glob("*.jpeg"))),
            "png": len(list(folder.glob("*.png"))),
        }

    report["finished"] = datetime.now(timezone.utc).isoformat()
    REPORT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")

    # Write items.json
    items_path = ROOT / "data" / "items.json"
    existing = json.loads(items_path.read_text(encoding="utf-8"))
    existing["items"] = build_items_json(products)
    existing["meta"]["updated"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    items_path.write_text(json.dumps(existing, indent=2) + "\n", encoding="utf-8")

    print(f"Converted: {report['converted']}, failed: {len(report['failed'])}")
    print(f"Products in items.json: {len(existing['items'])}")
    print(f"Report: {REPORT_PATH}")


if __name__ == "__main__":
    main()
