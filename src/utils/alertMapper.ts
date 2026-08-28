import type { AlertListItem, AlertWebData } from "@/types/alert";

export function toWebDataFromList(alarm: AlertListItem): AlertWebData {
  return {
    id: alarm.id,
    display_time: new Date(alarm.time).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    location: alarm.location,
    sound: alarm.sound,
    raw_label: alarm.raw_label,
    type: alarm.type,
    source_device_id: alarm.source_device_id,
  };
}
