import { useNavigate } from "react-router-dom";
import { roomImages } from "@/constants/room";
import {
  type DeviceUiStatus,
  type DeviceId,
  type RoomLabel,
} from "@/types/room";

interface RoomProps {
  device_id: DeviceId;
  location: RoomLabel;
  ui_status: DeviceUiStatus;
}

export default function Room({ device_id, location, ui_status }: RoomProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/settings/device/${device_id}`)}
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
              ui_status === "connected" ? "bg-success" : "bg-gray-200"
            }`}
          />
          <p className="m-0 text-subtitle-01 text-black">{location}</p>
        </div>
      </div>
    </div>
  );
}
