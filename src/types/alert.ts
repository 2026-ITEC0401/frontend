import { type Timestamp } from "firebase/firestore";
import { type DeviceId, type RoomLabel } from "@/types/room";

// 알람 종류 : 방문자 | 화재 | 소음
export type AlertType = "Visitor" | "Urgent" | "Noise";

export interface CommonData {
  // 알림은 명세 §6 고정 기기 4대에서만 발생하므로 위치도 4곳으로 한정
  location: RoomLabel;
  // 사용자 표시용 소리 이름 ("비상벨소리")
  sound: string;
  // 명세 §7.4 세부 분류 라벨 ("사이렌_삐뽀삐뽀").
  // 세부 레이블이 저장되지 않은 과거 알림은 null로 내려온다.
  raw_label: string | null;
  type: AlertType;
}

// 화면용 데이터 (웹/앱)
export interface AlertWebData extends CommonData {
  id: number | string;
  // 카드에 바로 찍는 표시용 시각 ("오전 08:00")
  time: string;
  // 명세 §7.4 date (Asia/Seoul 기준 YYYY-MM-DD)
  date?: string;
  // 명세 §7.4 local_time (Asia/Seoul 오프셋 포함 ISO). 오전·오후와 시각의 출처
  local_time?: string;
  // 명세 §7.3 알림을 감지한 기기 (§7.4 상세 응답에는 포함되지 않음)
  source_device_id?: DeviceId;
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
