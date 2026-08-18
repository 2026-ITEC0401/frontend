import { type RoomDevice } from "@/types/room";

export const mockDeviceData: RoomDevice[] = [
  { name: "현관", isConnected: true },
  { name: "거실", isConnected: true },
  { name: "안방", isConnected: true },
  { name: "화장실", isConnected: false },
];
