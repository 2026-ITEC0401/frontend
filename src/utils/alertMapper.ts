import type { AlertRealtime, AlertListItem, AlertWebData } from "@/types/alert";

// 서버 time은 UTC ISO 8601. 기기 타임존과 무관하게 Asia/Seoul로 고정 변환한다.
function toDisplayTime(utcTime: string): string {
  return new Date(utcTime).toLocaleTimeString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toWebDataFromList(alarm: AlertListItem): AlertWebData {
  return {
    id: alarm.id,
    display_time: toDisplayTime(alarm.time),
    location: alarm.location,
    sound: alarm.sound,
    raw_label: alarm.raw_label,
    type: alarm.type,
    source_device_id: alarm.source_device_id,
  };
}

export function toWebDataFromRealtime(alarm: AlertRealtime): AlertWebData {
  return {
    id: alarm.id,
    display_time: toDisplayTime(alarm.time),
    location: alarm.location,
    sound: alarm.sound,
    raw_label: alarm.raw_label,
    type: alarm.type,
  };
}
