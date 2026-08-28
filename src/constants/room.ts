import { type RoomLabel, type DeviceUiStatus } from "@/types/room";
import livingRoom from "@/assets/room-living.png";
import bedRoom from "@/assets/room-bed.png";
import bathRoom from "@/assets/room-bath.png";
import frontDoor from "@/assets/room-entrance.png";

export const roomImages: Record<RoomLabel, string> = {
  거실: livingRoom,
  안방: bedRoom,
  화장실: bathRoom,
  현관: frontDoor,
};

// 명세 §6.1 ui_status → 사용자용 상태 라벨·점 색상
// (Figma의 '신호 강함/보통'은 명세에 없는 값이라 ui_status 기준으로 대체)
export const deviceStatusMeta: Record<
  DeviceUiStatus,
  { label: string; dotColor: string }
> = {
  connected: { label: "연결됨", dotColor: "bg-success" },
  pending: { label: "설정 반영 중", dotColor: "bg-yellow-200" },
  offline: { label: "연결 끊김", dotColor: "bg-red-200" },
  error: { label: "연결 오류", dotColor: "bg-red-200" },
  disabled_by_owner: { label: "연결 꺼짐", dotColor: "bg-gray-200" },
};
