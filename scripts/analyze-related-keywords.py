import pandas as pd

PATH = r"C:\Users\LG\Documents\New project\cheolgeoon-keywords.xlsx"


def num(value):
    if pd.isna(value):
        return 0.0
    text = str(value).replace(",", "").replace("<", "").strip()
    if not text or text == "-" or text.lower() == "nan":
        return 0.0
    try:
        return float(text)
    except ValueError:
        return 0.0


df = pd.read_excel(PATH, sheet_name="Sheet", header=0).iloc[1:].copy()
df.columns = [
    "keyword",
    "pc_search",
    "mobile_search",
    "pc_click",
    "mobile_click",
    "pc_ctr",
    "mobile_ctr",
    "competition",
    "avg_ads",
]

for col in ["pc_search", "mobile_search", "pc_click", "mobile_click", "avg_ads"]:
    df[col] = df[col].map(num)

df["keyword"] = df["keyword"].astype(str).str.strip()
df = df[df["keyword"].ne("") & df["keyword"].ne("nan")].copy()
df["total_search"] = df["pc_search"] + df["mobile_search"]
df["total_click"] = df["pc_click"] + df["mobile_click"]

print(f"ROWS\t{len(df)}")
print(f"TOTAL_SEARCH\t{int(df['total_search'].sum())}")

print("\nTOP_40")
for row in df.sort_values("total_search", ascending=False).head(40).itertuples():
    print(
        f"{row.keyword}\t{int(row.total_search)}\tPC {int(row.pc_search)}\tMO {int(row.mobile_search)}\tCLICK {row.total_click:.1f}\t{row.competition}"
    )

categories = {
    "지원금/폐업지원": ["지원금", "희망리턴", "사업정리", "폐업"],
    "비용/견적": ["비용", "견적", "가격", "얼마"],
    "원상복구": ["원상복구", "원상복귀", "원복"],
    "상가/매장/점포": ["상가", "매장", "점포"],
    "사무실": ["사무실", "오피스"],
    "식당/음식점/주방": ["식당", "음식점", "주방"],
    "카페": ["카페"],
    "학원": ["학원"],
    "폐기물/수거/정리": ["폐기물", "쓰레기", "수거", "정리", "폐가구", "집기"],
    "업체/전문업체": ["업체", "업자", "전문"],
    "건물/공장/창고": ["건물", "공장", "창고"],
    "주거/집/아파트": ["아파트", "주택", "집", "빌라"],
    "인테리어/내부/부분": ["인테리어", "내부", "부분철거", "철거공사"],
}

print("\nCATEGORY_SUMMARY")
for category, terms in sorted(
    categories.items(),
    key=lambda item: df[
        df["keyword"].apply(lambda keyword: any(term in keyword for term in item[1]))
    ]["total_search"].sum(),
    reverse=True,
):
    sub = df[df["keyword"].apply(lambda keyword: any(term in keyword for term in terms))]
    top = ", ".join(
        f"{row.keyword}({int(row.total_search)})"
        for row in sub.sort_values("total_search", ascending=False).head(8).itertuples()
    )
    print(f"{category}\t{sub.shape[0]}\t{int(sub['total_search'].sum())}\t{top}")

pages = {
    "철거지원금/폐업지원금": ["폐업지원금", "소상공인폐업지원금", "희망리턴패키지", "폐업철거지원금", "점포철거지원금", "철거지원금"],
    "폐기물처리 포함 철거": ["폐기물처리업체", "폐기물처리", "폐기물수거", "철거폐기물", "쓰레기수거"],
    "철거비용/견적": ["철거비용", "철거견적", "철거가격", "상가철거비용", "철거비용견적"],
    "원상복구철거": ["원상복구", "원상복귀", "사무실원상복구", "상가원상복구", "원상복구비용"],
    "폐업철거": ["폐업철거", "폐업정리", "사업정리"],
    "상가철거": ["상가철거", "매장철거", "점포철거"],
    "식당철거": ["식당철거", "음식점철거", "주방철거"],
    "사무실철거": ["사무실철거", "사무실원상복구"],
    "카페철거": ["카페철거"],
    "학원철거": ["학원철거"],
    "건물철거": ["건물철거", "건물철거업체", "건물철거비용"],
    "인테리어철거": ["인테리어철거", "철거공사", "내부철거"],
}

print("\nPAGE_CANDIDATES")
for page, terms in sorted(
    pages.items(),
    key=lambda item: df[
        df["keyword"].apply(lambda keyword: any(term in keyword for term in item[1]))
    ]["total_search"].sum(),
    reverse=True,
):
    sub = df[df["keyword"].apply(lambda keyword: any(term in keyword for term in terms))]
    examples = ", ".join(
        f"{row.keyword}({int(row.total_search)})"
        for row in sub.sort_values("total_search", ascending=False).head(10).itertuples()
    )
    print(f"{page}\t{sub.shape[0]}\t{int(sub['total_search'].sum())}\t{examples}")
