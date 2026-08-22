const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const KST_TIME_FORMATTER = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

/**
 * 알림 이력의 날짜 묶음 제목을 만든다.
 * 명세 §7.3: 오늘/어제는 서버가 display_label을 내려주고,
 * 나머지 날짜는 null이므로 프론트가 date를 "8월 20일 (목)" 형태로 변환한다.
 */
export function formatAlertDayLabel(
  date: string,
  displayLabel: string | null,
): string {
  if (displayLabel) return displayLabel;

  const [year, month, day] = date.split("-").map(Number);
  // 요일은 브라우저 시간대의 영향을 받지 않도록 UTC 기준으로 계산한다
  const weekday =
    WEEKDAY_LABELS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];

  return `${month}월 ${day}일 (${weekday})`;
}

/**
 * 서버의 local_time(예: 2026-08-23T08:30:00+09:00)을
 * 한국시간 기준 "오전 08:30" 문구로 변환한다.
 */
export function formatAlertTime(localTime: string): string {
  const date = new Date(localTime);
  if (Number.isNaN(date.getTime())) return "시간 오류";

  return KST_TIME_FORMATTER.format(date);
}
