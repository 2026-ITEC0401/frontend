import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import { deviceStatusMeta, roomImages } from "@/constants/room";
import { mockDeviceData } from "@/mocks/room";
import { type RoomDevice } from "@/types/room";

export default function DeviceListPage() {
  // GET /households/{id}/devices 연동 지점 (지금은 mock, 고정 4개 기기)
  const [devices, setDevices] = useState<RoomDevice[]>(mockDeviceData);

  // 재연결 = PATCH .../connection { enabled: true } (MQTT 연결 재활성화)
  // 지금은 mock 낙관적 업데이트. 실제로는 응답/WS로 connected 반영.
  const reconnect = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.device_id === deviceId
          ? { ...d, desired_mqtt_connected: true, ui_status: "connected" }
          : d,
      ),
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="기기 관리" />

      <div className="flex flex-col gap-3 px-5 py-4">
        {devices.map((device) => (
          <DeviceRow
            key={device.device_id}
            device={device}
            onReconnect={() => reconnect(device.device_id)}
          />
        ))}
      </div>
    </div>
  );
}

interface DeviceRowProps {
  device: RoomDevice;
  onReconnect: () => void;
}

function DeviceRow({ device, onReconnect }: DeviceRowProps) {
  const status = deviceStatusMeta[device.ui_status];
  const isConnected = device.ui_status === "connected";

  return (
    <Link
      to={`/settings/device/${device.device_id}`}
      className="flex items-center gap-4 rounded-2xl bg-white px-4 py-4 no-underline shadow-02 transition-colors hover:bg-gray-100"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center">
        <img
          src={roomImages[device.location]}
          alt={`${device.location} 아이콘`}
          className="max-h-full object-contain"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${status.dotColor}`}
          />
          <span className="text-subtitle-03 text-gray-600">
            {device.location}
          </span>
        </div>
        <span className="text-body-02 text-gray-300">{status.label}</span>
      </div>

      {isConnected ? (
        <ChevronRight size={22} className="shrink-0 text-gray-200" />
      ) : (
        <button
          type="button"
          onClick={(e) => {
            // 카드 전체가 Link라 상세 이동을 막고 재연결만 실행
            e.preventDefault();
            e.stopPropagation();
            onReconnect();
          }}
          className="shrink-0 cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-label-05 text-gray-400"
        >
          재연결
        </button>
      )}
    </Link>
  );
}
