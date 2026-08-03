import { MessageCircle } from "lucide-react";

const NAVER_FORM_URL = "https://naver.me/FLEWiPhf";

export function FloatingFormButton() {
  return (
    <a className="floating-form-button" href={NAVER_FORM_URL} aria-label="네이버 폼으로 철거 견적 문의하기">
      <MessageCircle size={20} aria-hidden="true" />
      <span>견적 신청</span>
    </a>
  );
}
