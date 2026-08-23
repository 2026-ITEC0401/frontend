import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Toggle from "@/components/Toggle";
import { roomImages } from "@/constants/room";
import { mockDeviceData } from "@/mocks/room";
import { type RoomDevice } from "@/types/room";

export default function DeviceSettingPage() {
  const { id } = useParams<{ id: string }>();
  const device = mockDeviceData.find((d) => d.device_id === id);

  // 설정 값 로컬 상태 (서버 연동 시 초기값/저장 로직 교체)
  const [settings, setSettings] = useState<RoomDevice | undefined>(device);

  if (!settings) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Header title="상세 보기" />
        <div className="flex flex-1 items-center justify-center text-body-01 text-gray-300">
          기기를 찾을 수 없어요.
        </div>
      </div>
    );
  }

  const update = (patch: Partial<RoomDevice>) =>
    setSettings((prev) => (prev ? { ...prev, ...patch } : prev));

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="상세 보기" />

      {/* 기기 아이콘 + 위치 (원 안에 함께 표시) */}
      <div className="flex flex-col items-center py-12">
        <div
          className={`flex h-50 w-50 flex-col items-center justify-center gap-1 rounded-full bg-white shadow-01 ${
            settings.ui_status === "connected"
              ? "border-8 border-success"
              : "border-8 border-gray-200"
          }`}
        >
          <img
            src={roomImages[settings.location]}
            alt={`${settings.location} 아이콘`}
            className="h-24 w-24 object-contain"
          />
          <p className="m-0 text-head-03 text-gray-600">{settings.location}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5">
        <SettingRow label="기기 연결 상태">
          <Toggle
            checked={settings.desired_mqtt_connected}
            onChange={(v) => update({ desired_mqtt_connected: v })}
          />
        </SettingRow>

        <SettingRow label="LED 알림">
          <Toggle
            checked={settings.led_alert_enabled}
            onChange={(v) => update({ led_alert_enabled: v })}
          />
        </SettingRow>
      </div>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  children: React.ReactNode;
}

function SettingRow({ label, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between rounded-4xl bg-white px-5 py-4 shadow-02">
      <p className="m-0 text-subtitle-02 text-gray-500">{label}</p>
      {children}
    </div>
  );
}
