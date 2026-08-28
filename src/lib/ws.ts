import { getAccessToken } from "@/lib/auth";
import type { AlertRealtime } from "@/types/alert";
import type { DeviceUiStatus, RoomDevice } from "@/types/room";

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

export function connectWs(
  household_id: string,
  onAlarm: (alarm: AlertRealtime) => void,
  onDevices: (devices: RoomDevice[]) => void,
  onDeviceStatus: (device_id: string, ui_status: DeviceUiStatus) => void,
) {
  const ws = new WebSocket(`${WS_BASE_URL}/ws/households/${household_id}`);

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "auth", access_token: getAccessToken() }));
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === "alarm.created") {
      onAlarm(msg.alarm);
    } else if (msg.type === "connection.ready") {
      onDevices(msg.devices);
    } else if (msg.type == "device.status_changed") {
      onDeviceStatus(msg.device_id, msg.ui_status);
    }
    // 그 외 타입은 무시 (§10.8)
  };
  ws.onclose = (e) => {
    console.log("WS 종료:", e.code, e.reason);
  };
  return ws;
}
