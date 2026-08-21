export type RoomLabel = "거실" | "안방" | "화장실" | "현관";

// 명세 §6 고정 기기 ID
export type DeviceId = "rpi-001" | "esp32_1" | "esp32_2" | "esp32_3";

export interface RoomDevice {
  id: DeviceId;
  location: RoomLabel;
  // MQTT 연결 상태 (명세 desired_mqtt_connected). 추후 실제 reported 값에 물리면 됨
  isConnected: boolean;
  ledEnabled: boolean;
}
