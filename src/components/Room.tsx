import livingRoom from "@/assets/living.svg";
import bedRoom from "@/assets/bed.svg";
import bathRoom from "@/assets/wash.png";
import frontDoor from "@/assets/door.svg";
import { type RoomLabel } from "../types/room";

interface RoomProps {
  name: RoomLabel;
  isConnected: boolean;
}

const roomImages = {
  거실: livingRoom,
  안방: bedRoom,
  화장실: bathRoom,
  현관: frontDoor,
};

export default function Room({ name, isConnected }: RoomProps) {
  return (
    <div className="flex cursor-pointer flex-col gap-2 rounded-2xl bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
      {/* 가장 키가 큰 이미지(현관 도어락)가 들어갈 수 있을 만큼의 넉넉한 고정 높이를 줍니다. */}
      <div className="flex h-[90px] w-full items-center justify-center">
        <img
          src={roomImages[name]}
          alt={`${name} 아이콘`}
          className="max-h-full object-contain"
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="relative flex items-center">
          {/* 점을 공중에 띄워서 왼쪽 바깥으로 밀어냅니다 */}
          <div
            className={`absolute right-full mr-2 h-3 w-3 rounded-full ${
              isConnected ? "bg-[#34C759]" : "bg-[#FF3B30]"
            }`}
          />
          <h3 className="m-0 text-2xl leading-[1.2] font-bold text-black">
            {name}
          </h3>
        </div>
      </div>
    </div>
  );
}
