import type {
  AlertRealtime,
  AlertListItem,
  AlertDetail,
  AlertWebData,
} from "@/types/alert";

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

// 상세(GET /alarms/{alarm_id})는 time(UTC) 없이 date·local_time을 준다.
// display_time은 offset이 포함된 local_time으로 계산해도 동일하게 Asia/Seoul 값이 나온다.
export function toWebDataFromDetail(alarm: AlertDetail): AlertWebData {
  return {
    id: alarm.id,
    display_time: toDisplayTime(alarm.local_time),
    date: alarm.date,
    local_time: alarm.local_time,
    location: alarm.location,
    sound: alarm.sound,
    raw_label: alarm.raw_label,
    type: alarm.type,
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
