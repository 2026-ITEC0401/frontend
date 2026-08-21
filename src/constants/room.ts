import { type RoomLabel } from "@/types/room";
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
