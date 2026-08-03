import json
import sys
from pathlib import Path
from PIL import Image, ImageEnhance, ImageOps


ASSET_ROOT = Path(sys.argv[1])
AUTH_RAW_DIR = ASSET_ROOT / "raw-authenticated"
RAW_DIR = AUTH_RAW_DIR if AUTH_RAW_DIR.exists() else ASSET_ROOT / "_raw"
SOURCE_DIR = ASSET_ROOT / "source"
HERO_DIR = ASSET_ROOT / "hero"
SECTION_DIR = ASSET_ROOT / "sections"
THUMB_DIR = ASSET_ROOT / "thumbs"
OG_DIR = ASSET_ROOT / "og"
GALLERY_DIR = ASSET_ROOT / "gallery"

for directory in [SOURCE_DIR, HERO_DIR, SECTION_DIR, THUMB_DIR, OG_DIR, GALLERY_DIR]:
    directory.mkdir(parents=True, exist_ok=True)


def open_image(path: Path) -> Image.Image:
    image = Image.open(path)
    return ImageOps.exif_transpose(image).convert("RGB")


def crop_to_ratio(image: Image.Image, ratio: float, focus_y: float = 0.5) -> Image.Image:
    width, height = image.size
    current = width / height
    if current > ratio:
        new_width = int(height * ratio)
        left = (width - new_width) // 2
        return image.crop((left, 0, left + new_width, height))
    new_height = int(width / ratio)
    top = int((height - new_height) * focus_y)
    top = max(0, min(height - new_height, top))
    return image.crop((0, top, width, top + new_height))


def polish(image: Image.Image, contrast: float = 1.04, color: float = 1.02, sharpness: float = 1.08) -> Image.Image:
    image = ImageEnhance.Contrast(image).enhance(contrast)
    image = ImageEnhance.Color(image).enhance(color)
    image = ImageEnhance.Sharpness(image).enhance(sharpness)
    return image


def save_webp(image: Image.Image, path: Path, size: tuple[int, int], quality: int = 82) -> dict:
    output = crop_to_ratio(image, size[0] / size[1])
    output = output.resize(size, Image.Resampling.LANCZOS)
    output = polish(output)
    output.save(path, "WEBP", quality=quality, method=6)
    return {
        "file": str(path.relative_to(ASSET_ROOT).as_posix()),
        "width": size[0],
        "height": size[1],
        "bytes": path.stat().st_size,
    }


raw_files = sorted(RAW_DIR.glob("demolition-work-*.jpg")) + sorted(RAW_DIR.glob("demolition-work-*.webp"))
raw_files = sorted(raw_files)
if not raw_files:
    raise SystemExit(f"No source images found in {RAW_DIR}")
manifest = {
    "source": [],
    "hero": [],
    "sections": [],
    "thumbs": [],
    "og": [],
    "gallery": [],
}

for idx, raw in enumerate(raw_files, start=1):
    image = open_image(raw)
    path = SOURCE_DIR / f"demolition-work-{idx:03d}.webp"
    manifest["source"].append(save_webp(image, path, (1400, 1050), 84))

safe_indices = [
    2, 3, 4, 5, 6, 8, 10, 11, 12, 20, 21, 22, 23,
    29, 30, 31, 32, 33, 34, 36, 37, 40, 41
]
safe_files = [raw_files[i - 1] for i in safe_indices if i <= len(raw_files)]

hero_names = [
    "main-hero",
    "store-clearance-hero",
    "office-clearance-hero",
    "restaurant-demolition-hero",
    "interior-removal-hero",
    "subsidy-consulting-hero",
    "site-estimate-hero",
    "nationwide-service-hero",
    "cleanup-process-hero",
    "safe-demolition-hero",
    "schedule-consulting-hero",
    "final-check-hero",
]

section_names = [
    "phone-consultation",
    "visit-estimate",
    "site-diagnosis",
    "demolition-planning",
    "store-demolition",
    "office-demolition",
    "restaurant-demolition",
    "academy-demolition",
    "commercial-unit-demolition",
    "interior-removal",
    "floor-removal",
    "ceiling-removal",
    "wall-removal",
    "fixture-removal",
    "waste-sorting",
    "loading-work",
    "truck-loading",
    "site-cleanup",
    "before-after",
    "final-inspection",
    "subsidy-application",
    "document-check",
    "schedule-control",
    "noise-care",
    "dust-care",
    "neighbor-care",
    "equipment-ready",
    "worker-process",
    "regional-service",
    "estimate-benefit",
]

for idx, name in enumerate(hero_names, start=1):
    image = open_image(safe_files[(idx - 1) % len(safe_files)])
    path = HERO_DIR / f"{name}.webp"
    manifest["hero"].append(save_webp(image, path, (1920, 1080), 82))

for idx, name in enumerate(section_names, start=1):
    image = open_image(safe_files[(idx + 5) % len(safe_files)])
    path = SECTION_DIR / f"{name}.webp"
    manifest["sections"].append(save_webp(image, path, (1200, 800), 82))

for idx in range(1, 19):
    image = open_image(safe_files[(idx + 11) % len(safe_files)])
    path = THUMB_DIR / f"service-card-{idx:02d}.webp"
    manifest["thumbs"].append(save_webp(image, path, (640, 480), 80))

for idx in range(1, 9):
    image = open_image(safe_files[(idx + 16) % len(safe_files)])
    path = OG_DIR / f"cheolgeoon-og-{idx:02d}.webp"
    manifest["og"].append(save_webp(image, path, (1200, 630), 82))

for idx in range(1, 33):
    image = open_image(safe_files[(idx + 3) % len(safe_files)])
    path = GALLERY_DIR / f"site-gallery-{idx:02d}.webp"
    manifest["gallery"].append(save_webp(image, path, (1000, 750), 82))

manifest["site_ready_webp"] = (
    len(manifest["hero"])
    + len(manifest["sections"])
    + len(manifest["thumbs"])
    + len(manifest["og"])
    + len(manifest["gallery"])
)
manifest["total_webp"] = sum(len(items) for items in manifest.values() if isinstance(items, list))
manifest["safe_source_indices"] = safe_indices
manifest["source_note"] = "Converted from provided Google Drive demolition work photos. Filenames are English-only."

(ASSET_ROOT / "image-manifest.json").write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2),
    encoding="utf-8",
)

print(json.dumps({"asset_root": str(ASSET_ROOT), "total_webp": manifest["total_webp"]}, ensure_ascii=False))
