// 알람 종류 : 방문자 | 화재 | 소음
export type AlertType = "Visitor" | "Urgent" | "Noise";

// 전체 공통 데이터
export interface AlertData {
  id: string;
  location: string;
  sound: string;
  type: AlertType;
  raw_label: string | null;
}

// 화면용 데이터 (웹/앱)
export interface AlertWebData extends AlertData {
  time: string; // 오후 02시 24분
}

//  §7.1 일반 목록 / §7.2 최근 알림
export interface AlertListItem extends AlertData {
  time: string; // UTC ISO 8601 - 정렬/비교용
  source_device_id: string;
  confidence: number | null;
}

// §7.3 최근 7일 날짜별 알림 (GET /households/{id}/alarms/history)
export interface AlertHistoryAlarm extends AlertListItem {
  local_time: string; // Asia/Seoul ISO 8601 - 화면 표시용
}

// §7.4 알림 상세
export interface AlertDetail extends AlertData {
  date: string;
  local_time: string;
}

// §9 WebSocket alarm.created
export interface AlertRealtime extends AlertData {
  time: string;
}

export interface AlertHistoryDay {
  // YYYY-MM-DD
  date: string;
  // "오늘" | "어제" | null (null이면 프론트가 date를 변환해 표시)
  display_label: string | null;
  alarms: AlertHistoryAlarm[];
}

export interface AlertHistoryResponse {
  timezone: string;
  start_date: string;
  end_date: string;
  total_count: number;
  days: AlertHistoryDay[];
}
