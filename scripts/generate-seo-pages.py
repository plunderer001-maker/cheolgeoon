import json
import re
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "demolition-related-keywords.xlsx"
OUTPUT = ROOT / "data" / "generated" / "seo-pages.json"

SERVICE_LABELS = {
    "철거": "철거",
    "폐업철거": "폐업 철거",
    "철거원상복구": "철거 원상복구",
    "철거원상복귀": "철거 원상복귀",
    "인테리어철거": "인테리어 철거",
    "원상복구철거": "원상복구 철거",
    "철거원상회복": "철거 원상회복",
    "폐업원상복구철거": "폐업 원상복구 철거",
    "완파철거": "완파 철거",
    "철거및원상복구": "철거 및 원상복구",
}

TARGET_PRIORITY = {
    "상가": 1,
    "사무실": 1,
    "식당": 1,
    "카페": 1,
    "학원": 1,
    "미용실": 2,
    "pc방": 2,
    "피씨방": 2,
    "매장": 2,
    "점포": 2,
    "편의점": 2,
    "노래방": 2,
    "독서실": 2,
    "스터디카페": 2,
    "헬스장": 2,
    "병원": 2,
    "의원": 2,
    "창고": 2,
    "공장": 2,
    "건물": 2,
    "단독주택": 3,
    "주택": 3,
    "빈집": 3,
    "촌집": 3,
    "폐가": 3,
    "빌라": 3,
    "원룸": 3,
    "오피스텔": 3,
}

RESTRICTED_TERMS = [
    "불법",
    "무허가",
    "위반",
    "주유소",
    "가스충전소",
    "위험물",
    "학교",
    "관공서",
    "경찰서",
    "소방서",
    "재개발",
]


def clean_values(series):
    values = []
    for value in series.dropna().tolist():
        text = str(value).strip()
        if text and text.lower() != "nan":
            values.append(text)
    return values


def display_service(service):
    return SERVICE_LABELS.get(service, service)


def display_intent(intent):
    return intent


def slugify(keyword):
    slug = re.sub(r"\s+", "-", keyword.strip())
    slug = re.sub(r"-+", "-", slug)
    return slug


def target_group(target):
    if any(term in target for term in RESTRICTED_TERMS):
        return "검토필요"
    priority = TARGET_PRIORITY.get(target, 4)
    return f"{priority}차"


def is_restricted(target, service):
    return any(term in target for term in RESTRICTED_TERMS) or service == "완파철거"


df = pd.read_excel(SOURCE, sheet_name=0, header=None)
targets = clean_values(df.iloc[:, 0])
services = clean_values(df.iloc[:, 1])
intents = clean_values(df.iloc[:, 2])

pages = []
seen = set()

for target in targets:
    for service in services:
        service_text = display_service(service)
        base_keyword = f"{target} {service_text}"
        base_slug = slugify(base_keyword)
        if base_slug not in seen:
            seen.add(base_slug)
            pages.append(
                {
                    "slug": base_slug,
                    "keyword": base_keyword,
                    "target": target,
                    "service": service,
                    "serviceLabel": service_text,
                    "intent": "",
                    "intentLabel": "",
                    "pageKind": "base",
                    "group": target_group(target),
                    "restricted": is_restricted(target, service),
                }
            )

        for intent in intents:
            intent_text = display_intent(intent)
            keyword = f"{target} {service_text} {intent_text}"
            slug = slugify(keyword)
            if slug in seen:
                continue
            seen.add(slug)
            pages.append(
                {
                    "slug": slug,
                    "keyword": keyword,
                    "target": target,
                    "service": service,
                    "serviceLabel": service_text,
                    "intent": intent,
                    "intentLabel": intent_text,
                    "pageKind": "intent",
                    "group": target_group(target),
                    "restricted": is_restricted(target, service),
                }
            )

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text(
    json.dumps(
        {
            "source": "demolition-related-keywords.xlsx",
            "targetCount": len(targets),
            "serviceCount": len(services),
            "intentCount": len(intents),
            "pageCount": len(pages),
            "pages": pages,
        },
        ensure_ascii=False,
    ),
    encoding="utf-8",
)

print(f"targets={len(targets)} services={len(services)} intents={len(intents)} pages={len(pages)}")
