import { type Timestamp } from "firebase/firestore";

// 알람 종류 : 방문자 | 화재 | 소음
export type AlertType = "Visitor" | "Urgent" | "Noise";

export interface CommonData {
  location: string;
  sound: string;
  type: AlertType;
}

// 화면용 데이터 (웹/앱)
export interface AlertWebData extends CommonData {
  id: number | string;
  time: string;
}

// 서버용 데이터 (라즈베리파이)
export interface AlertServerData extends CommonData {
  id?: number;
  time: number | Timestamp;
}

// 명세 §7.3 최근 7일 날짜별 알림 (GET /households/{id}/alarms/history)
export interface AlertHistoryAlarm extends CommonData {
  id: string;
  // UTC ISO 8601 - 정렬/비교용
  time: string;
  // Asia/Seoul ISO 8601 - 화면 표시용
  local_time: string;
  source_device_id?: string;
  raw_label?: string | null;
  confidence?: number | null;
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
