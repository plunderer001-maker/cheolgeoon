"""페이지별 1:1 대표 이미지(OG) 생성.

실제 작업 사진(public/images/cheolgeoon/raw-authenticated)을 배경으로 쓰고,
아래쪽 어두운 그라데이션 위에 칩 · 큰 제목 · 한 줄 설명 · 강조 문구를 올린다.
휴대폰 검색 결과처럼 작게 보여도 읽히도록 제목을 최대한 크게(두 줄 이내) 잡는다.

사용: py scripts/build-og-images.py [출력 폴더]  (기본: public/images/cheolgeoon/og-square)
     py scripts/build-og-images.py --regions [지역 slug ...]  (시군구 철거전문업체, 기본: 전체 → og-region)
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PHOTO = ROOT / "public/images/cheolgeoon/raw-authenticated/demolition-work-{:03d}.webp"
FONT_DIR = ROOT / "node_modules/pretendard/dist/public/static"
BOLD = str(FONT_DIR / "Pretendard-ExtraBold.otf")
SEMI = str(FONT_DIR / "Pretendard-SemiBold.otf")
MEDIUM = str(FONT_DIR / "Pretendard-Medium.otf")

SIZE = 1080
PAD = 64
INK = (14, 17, 23)
BLUE = (37, 99, 255)
BLUE_BRIGHT = (122, 160, 255)
WHITE = (255, 255, 255)
SOFT = (226, 230, 238)

# slug: (사진 번호, 세로 기준(0 위 ~ 1 아래), 제목 줄들, 설명, 강조 문구)
PAGES = {
    "guide": (40, 0.5, ["철거 가이드"], "비용·원상복구·지원금 한 번에", "상황별로 골라 보세요"),
    "철거-비용": (2, 0.45, ["철거 비용"], "평당 참고 범위와 금액이 바뀌는 이유", "사진 몇 장으로 무료 견적"),
    "철거전문업체": (33, 0.5, ["철거전문업체"], "현장답사부터 원상복구까지", "당일 방문 · 1년 무상 A/S"),
    "상가-철거": (12, 0.5, ["상가 철거"], "업종에 맞춰 범위부터 나눕니다", "사진 몇 장으로 무료 견적"),
    "사무실-철거": (22, 0.55, ["사무실 철거"], "퇴거일에 맞춘 철거·원상복구", "파티션·OA 바닥·배선까지"),
    "식당-철거": (4, 0.5, ["식당·카페", "철거"], "후드·덕트 주방 설비까지", "사진 몇 장으로 무료 견적"),
    "폐업-철거": (6, 0.5, ["폐업 철거"], "지원금 확인부터 정산 서류까지", "점포철거비 최대 600만원"),
    "원상복구-철거": (34, 0.5, ["원상복구"], "철거부터 도장·바닥 마감 복구까지", "계약서 기준으로 범위 정리"),
    "폐업-철거지원금": (9, 0.5, ["폐업", "철거지원금"], "점포철거비 1평당 20만원", "최대 600만원 · 정산 서류 발급"),
}


def font(path, size):
    return ImageFont.truetype(path, size)


def cover(photo, anchor_y):
    image = Image.open(str(PHOTO).format(photo)).convert("RGB")
    ratio = max(SIZE / image.width, SIZE / image.height)
    image = image.resize((round(image.width * ratio), round(image.height * ratio)), Image.LANCZOS)
    left = (image.width - SIZE) // 2
    top = int((image.height - SIZE) * anchor_y)
    return image.crop((left, top, left + SIZE, top + SIZE))


def shade(image, start):
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # 위쪽은 살짝, 글자가 놓이는 아래쪽은 진하게
    for y in range(SIZE):
        if y < start:
            alpha = 40
        else:
            alpha = int(40 + 205 * ((y - start) / (SIZE - start)) ** 0.9)
        draw.line([(0, y), (SIZE, y)], fill=INK + (alpha,))
    return Image.alpha_composite(image.convert("RGBA"), overlay)


def fit(draw, lines, path, start, max_width):
    size = start
    while size > 60 and max(draw.textlength(line, font=font(path, size)) for line in lines) > max_width:
        size -= 4
    return size


def make(slug, out_dir, with_jpg=False):
    photo, anchor_y, title, sub, accent = PAGES[slug]
    draw_probe = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    title_size = fit(draw_probe, title, BOLD, 168, SIZE - PAD * 2)
    line_gap = int(title_size * 0.12)
    sub_size, accent_size, chip_size = 46, 46, 34

    block = 70 + 30 + len(title) * title_size + (len(title) - 1) * line_gap + 36 + sub_size + 22 + accent_size
    top = SIZE - PAD - block

    image = shade(cover(photo, anchor_y), max(200, top - 220))
    draw = ImageDraw.Draw(image)

    # 칩
    chip = "실제 작업 현장"
    chip_font = font(SEMI, chip_size)
    chip_w = draw.textlength(chip, font=chip_font)
    draw.rounded_rectangle([PAD, top, PAD + chip_w + 48, top + 70], radius=35, fill=BLUE)
    draw.text((PAD + 24, top + 35), chip, font=chip_font, fill=WHITE, anchor="lm")
    y = top + 70 + 30

    # 제목
    title_font = font(BOLD, title_size)
    for line in title:
        draw.text((PAD - 4, y), line, font=title_font, fill=WHITE)
        y += title_size + line_gap
    y += 36 - line_gap

    draw.text((PAD, y), sub, font=font(MEDIUM, sub_size), fill=SOFT)
    y += sub_size + 22
    draw.text((PAD, y), accent, font=font(BOLD, accent_size), fill=BLUE_BRIGHT)

    out = out_dir / f"{slug}.webp"
    image.convert("RGB").save(out, quality=86)
    if with_jpg:  # 검토용 시안 폴더에서만 jpg 를 함께 만든다
        image.convert("RGB").save(out_dir / f"{slug}.jpg", quality=88)
    return out


# 시군구 철거전문업체 대표 이미지. app/lib/company-copy.ts 의 COMPANY_PHOTOS 와 같은 목록.
REGION_PHOTOS = [5, 6, 11, 12, 20, 21, 22, 23, 32, 33, 34, 36, 37, 40, 41]


def make_region(region, index, out_dir):
    """지역 이름(블루) + 철거전문업체(흰색). 사진은 실제 현장이지만 그 지역 현장이라는 뜻은 아니어서 칩은 '철거 완료 현장'."""
    photo = REGION_PHOTOS[index % len(REGION_PHOTOS)]
    probe = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    name = region["name"]
    name_size = fit(probe, [name], BOLD, 110, SIZE - PAD * 2)
    title_size = 150
    sub_size, accent_size = 46, 46
    block = 70 + 30 + name_size + 14 + title_size + 36 + sub_size + 22 + accent_size
    top = SIZE - PAD - block

    image = shade(cover(photo, 0.5), max(200, top - 220))
    draw = ImageDraw.Draw(image)
    chip = "철거 완료 현장"
    chip_font = font(SEMI, 34)
    chip_w = draw.textlength(chip, font=chip_font)
    draw.rounded_rectangle([PAD, top, PAD + chip_w + 48, top + 70], radius=35, fill=BLUE)
    draw.text((PAD + 24, top + 35), chip, font=chip_font, fill=WHITE, anchor="lm")
    y = top + 100
    draw.text((PAD - 2, y), name, font=font(BOLD, name_size), fill=BLUE_BRIGHT)
    y += name_size + 14
    draw.text((PAD - 4, y), "철거전문업체", font=font(BOLD, title_size), fill=WHITE)
    y += title_size + 36
    draw.text((PAD, y), "상가·사무실·식당 철거와 원상복구", font=font(MEDIUM, sub_size), fill=SOFT)
    y += sub_size + 22
    draw.text((PAD, y), "당일 방문 · 1년 무상 A/S", font=font(BOLD, accent_size), fill=BLUE_BRIGHT)

    out = out_dir / f"{region['slug']}.webp"
    image.convert("RGB").save(out, quality=80)
    return out


def main_regions(slugs):
    import json

    data = json.loads((ROOT / "data/generated/regions.json").read_text(encoding="utf-8"))
    regions = [r for r in data["regions"] if r["sidoShort"] != "전남광주통합"]
    out_dir = ROOT / "public/images/cheolgeoon/og-region"
    out_dir.mkdir(parents=True, exist_ok=True)
    for index, region in enumerate(regions):
        if not slugs or region["slug"] in slugs:
            make_region(region, index, out_dir)
    print(f"regions: {len(slugs) if slugs else len(regions)} -> {out_dir}")


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--regions":
        main_regions(sys.argv[2:])
        return
    custom = len(sys.argv) > 1
    out_dir = Path(sys.argv[1]) if custom else ROOT / "public/images/cheolgeoon/og-square"
    out_dir.mkdir(parents=True, exist_ok=True)
    for slug in PAGES:
        print(make(slug, out_dir, with_jpg=custom))


if __name__ == "__main__":
    main()
