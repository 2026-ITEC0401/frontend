import { type RoomDevice } from "@/types/room";

export const mockDeviceData: RoomDevice[] = [
  { id: "esp32_3", location: "현관", isConnected: true, ledEnabled: false },
  { id: "rpi-001", location: "거실", isConnected: true, ledEnabled: true },
  { id: "esp32_1", location: "안방", isConnected: true, ledEnabled: true },
  { id: "esp32_2", location: "화장실", isConnected: false, ledEnabled: false },
];
