import { type RoomDevice } from "@/types/room";

export const mockDeviceData: RoomDevice[] = [
  {
    device_id: "rpi-001",
    location: "거실",
    desired_mqtt_connected: true,
    ui_status: "connected",
    led_alert_enabled: true,
  },
  {
    device_id: "esp32_1",
    location: "안방",
    desired_mqtt_connected: true,
    ui_status: "connected",
    led_alert_enabled: true,
  },
  {
    device_id: "esp32_2",
    location: "현관",
    desired_mqtt_connected: true,
    ui_status: "pending",
    led_alert_enabled: false,
  },
  {
    device_id: "esp32_3",
    location: "화장실",
    desired_mqtt_connected: false,
    ui_status: "disabled_by_owner",
    led_alert_enabled: false,
  },
];
