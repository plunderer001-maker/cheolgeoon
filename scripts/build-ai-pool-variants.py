import json
from pathlib import Path
from PIL import Image, ImageEnhance, ImageOps


GENERATED_DIR = Path(r"C:\Users\LG\.codex\generated_images\019fc58b-63ce-7c32-ac47-be9aabd42341")
OUT_DIR = Path(r"C:\Users\LG\Documents\New project\demolition-seo\public\images\cheolgeoon\ai-pool")
OUT_DIR.mkdir(parents=True, exist_ok=True)

BASE_FILES = [
    ("consultation", "call_Fk3E6Ev5Ui6QVCjoomFGeQMq.png"),
    ("site-estimate", "call_xrNneembybu73KplFGmtzzvc.png"),
    ("document-guide", "call_jWOw15CCWGtqkUqMjaI3s7WP.png"),
    ("consultation", "call_WOWS4NKNP3fTj2pg4GB8Affy.png"),
    ("site-estimate", "call_fwVlBEY8EZ6FYnIkLU5oVz5y.png"),
    ("empty-store", "call_Zk4Nna8s8vBHTz9I01fCJJvl.png"),
    ("empty-store", "call_snSaPACOCErpiL57E0RNajN5.png"),
    ("safety-prep", "call_PCyu9aNnruqDAJviufu5vLtg.png"),
    ("final-check", "call_rxZddGCHbVxPdhamxIsBtNhm.png"),
    ("waste-sorting", "call_WrqmUz4wUmfZcqUqX5o2XptS.png"),
    ("schedule-check", "call_Eui8ouM2FLie6qBiZXritbAN.png"),
    ("common-area-protection", "call_nOAuOYGr1lD1l5k82SKFDpRj.png"),
    ("photo-estimate", "call_mJevsvn2ssnG5AP0krLZTRbG.png"),
    ("cleanup", "call_ByCX36Fqk1FPngwSQ1tULeaN.png"),
    ("workflow", "call_CIyICOYGNz4lKjvxjAw7vz3W.png"),
    ("loading-prep", "call_OVqj5uVwPo4jhwkcbMxD5Ccp.png"),
    ("subsidy-guide", "call_hL3xM6Jw4AMqrDmPohM8DBuu.png"),
    ("inspection", "call_Z5yEjVs0uEDErKK7v4YPOKvJ.png"),
    ("dust-control", "call_zWUVfbBZgmLmxf4IK3nBlvpv.png"),
    ("handoff", "call_6uRWKikXJMn4EEYkM8ZlPwmb.png"),
]

VARIANTS = [
    {"suffix": "wide", "focus_x": 0.50, "focus_y": 0.50, "contrast": 1.02, "color": 1.00, "brightness": 1.00},
    {"suffix": "left", "focus_x": 0.36, "focus_y": 0.50, "contrast": 1.04, "color": 1.01, "brightness": 1.02},
    {"suffix": "right", "focus_x": 0.64, "focus_y": 0.50, "contrast": 1.04, "color": 1.01, "brightness": 1.02},
    {"suffix": "warm", "focus_x": 0.45, "focus_y": 0.48, "contrast": 1.05, "color": 1.05, "brightness": 1.02},
    {"suffix": "clean", "focus_x": 0.55, "focus_y": 0.52, "contrast": 1.07, "color": 0.96, "brightness": 1.04},
]


def crop_focus(image: Image.Image, ratio: float, focus_x: float, focus_y: float) -> Image.Image:
    width, height = image.size
    current = width / height
    if current > ratio:
        new_width = int(height * ratio)
        left = int((width - new_width) * focus_x)
        left = max(0, min(width - new_width, left))
        return image.crop((left, 0, left + new_width, height))
    new_height = int(width / ratio)
    top = int((height - new_height) * focus_y)
    top = max(0, min(height - new_height, top))
    return image.crop((0, top, width, top + new_height))


def adjust(image: Image.Image, spec: dict) -> Image.Image:
    image = ImageEnhance.Brightness(image).enhance(spec["brightness"])
    image = ImageEnhance.Contrast(image).enhance(spec["contrast"])
    image = ImageEnhance.Color(image).enhance(spec["color"])
    image = ImageEnhance.Sharpness(image).enhance(1.06)
    return image


manifest = {
    "note": "AI-generated photorealistic concept image pool. Not real demolition case photos.",
    "count": 0,
    "images": [],
}

sequence = 1
per_category_counts = {}

for base_index, (category, filename) in enumerate(BASE_FILES, start=1):
    source = GENERATED_DIR / filename
    if not source.exists():
        raise FileNotFoundError(source)
    original = ImageOps.exif_transpose(Image.open(source)).convert("RGB")
    for variant_index, variant in enumerate(VARIANTS, start=1):
        per_category_counts[category] = per_category_counts.get(category, 0) + 1
        category_seq = per_category_counts[category]
        image = crop_focus(original, 16 / 9, variant["focus_x"], variant["focus_y"])
        image = image.resize((1600, 900), Image.Resampling.LANCZOS)
        image = adjust(image, variant)
        out_name = f"ai-{category}-{category_seq:02d}.webp"
        out_path = OUT_DIR / out_name
        image.save(out_path, "WEBP", quality=84, method=6)
        manifest["images"].append(
            {
                "file": out_name,
                "category": category,
                "base_file": filename,
                "variant": variant["suffix"],
                "width": 1600,
                "height": 900,
                "bytes": out_path.stat().st_size,
            }
        )
        sequence += 1

manifest["count"] = len(manifest["images"])
(OUT_DIR / "ai-pool-manifest.json").write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2),
    encoding="utf-8",
)

print(json.dumps({"count": manifest["count"], "out_dir": str(OUT_DIR)}, ensure_ascii=False))
