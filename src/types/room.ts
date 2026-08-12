export type RoomLabel = "거실" | "안방" | "화장실" | "현관";
export interface RoomDevice {
  name: RoomLabel;
  isConnected: boolean;
}
