import livingRoom from "@/assets/room-living.png";
import bedRoom from "@/assets/room-bed.png";
import bathRoom from "@/assets/room-bath.png";
import frontDoor from "@/assets/room-entrance.png";
import { type RoomLabel } from "@/types/room";

interface RoomProps {
  name: RoomLabel;
  isConnected: boolean;
}

const roomImages: Record<RoomLabel, string> = {
  거실: livingRoom,
  안방: bedRoom,
  화장실: bathRoom,
  현관: frontDoor,
};

export default function Room({ name, isConnected }: RoomProps) {
  return (
    <div className="flex cursor-pointer flex-col gap-2 rounded-4xl bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
      <div className="flex h-25 w-full items-center justify-center">
        <img
          src={roomImages[name]}
          alt={`${name} 아이콘`}
          className="max-h-full object-contain"
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="relative flex items-center">
          <div
            className={`absolute right-full mr-2.5 h-3 w-3 rounded-full ${
              isConnected ? "bg-success" : "bg-gray-200"
            }`}
          />
          <p className="m-0 text-head-03 text-black">{name}</p>
        </div>
      </div>
    </div>
  );
}
