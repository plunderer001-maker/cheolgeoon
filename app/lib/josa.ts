/**
 * 받침 유무에 맞춰 조사를 붙인다. 템플릿에 들어가는 지역명·키워드 뒤에 쓴다.
 * 예: josa("경기도", "은/는") → "경기도는", josa("서울", "은/는") → "서울은"
 */
type JosaPair = "은/는" | "이/가" | "을/를" | "과/와" | "으로/로" | "이라/라";

function lastHangulCode(word: string) {
  const trimmed = word.trim();
  const code = trimmed.charCodeAt(trimmed.length - 1);
  return code >= 0xac00 && code <= 0xd7a3 ? code - 0xac00 : null;
}

export function josa(word: string, pair: JosaPair) {
  const [withBatchim, withoutBatchim] = pair.split("/");
  const code = lastHangulCode(word);
  if (code === null) return `${word}${withBatchim}`;

  const jong = code % 28;
  // "으로/로"는 ㄹ 받침(종성 8)일 때도 "로"를 쓴다.
  const hasBatchim = pair === "으로/로" ? jong !== 0 && jong !== 8 : jong !== 0;
  return `${word}${hasBatchim ? withBatchim : withoutBatchim}`;
}
