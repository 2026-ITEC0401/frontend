import { useNavigate } from "react-router-dom";
import { roomImages } from "@/constants/room";
import { type DeviceId, type RoomLabel } from "@/types/room";

interface RoomProps {
  id: DeviceId;
  location: RoomLabel;
  isConnected: boolean;
}

export default function Room({ id, location, isConnected }: RoomProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/settings/device/${id}`)}
      className="flex cursor-pointer flex-col gap-2 rounded-4xl bg-white p-4 shadow-02"
    >
      <div className="flex h-25 w-full items-center justify-center">
        <img
          src={roomImages[location]}
          alt={`${location} 아이콘`}
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
          <p className="m-0 text-head-03 text-black">{location}</p>
        </div>
      </div>
    </div>
  );
}
