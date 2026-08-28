import { useState } from "react";
import Header from "@/components/Header";
import Toggle from "@/components/Toggle";
import { getAlarmSoundEnabled, setAlarmSoundEnabled } from "@/lib/preferences";

// 명세 회신: 진동 알림은 제거, 알림 소리 ON/OFF만 localStorage로 저장.
export default function NotificationSettingsPage() {
  const [soundEnabled, setSoundEnabled] = useState(getAlarmSoundEnabled);

  const toggleSound = (value: boolean) => {
    setSoundEnabled(value);
    setAlarmSoundEnabled(value);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="알림 설정" />

      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-02">
          <div className="flex flex-col gap-1">
            <p className="m-0 text-subtitle-02 text-gray-500">알림 소리</p>
            <p className="m-0 text-body-02 text-gray-300">
              기본 알림음 · 사이렌
            </p>
          </div>
          <Toggle checked={soundEnabled} onChange={toggleSound} />
        </div>
      </div>
    </div>
  );
}
