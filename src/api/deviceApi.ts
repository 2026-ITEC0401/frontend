import { request } from "@/lib/api";
import type { RoomDevice } from "@/types/room";

interface DevicesResponse {
  devices: RoomDevice[];
}

export async function getDevices(household_id: string) {
  return request<DevicesResponse>(`/households/${household_id}/devices`);
}

// 응답 스키마가 명세에 정의되지 않아 바디에 의존하지 않는다.
// 호출부에서 재조회(getDevices)와 WS device.status_changed로 상태를 확정한다.
export async function setConnection(
  household_id: string,
  device_id: string,
  enabled: boolean,
) {
  return request<void>(
    `/households/${household_id}/devices/${device_id}/connection`,
    { method: "PATCH", body: { enabled } },
  );
}

export async function setLedAlert(
  household_id: string,
  device_id: string,
  led_alert_enabled: boolean,
) {
  return request<void>(
    `/households/${household_id}/devices/${device_id}/settings`,
    { method: "PATCH", body: { led_alert_enabled } },
  );
}
