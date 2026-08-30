import { useState, useEffect } from "react";
import AlertCard from "@/components/AlertCard";
import Notification from "@/components/Notification";
import Room from "@/components/Room";
import FullScreenAlert from "@/components/FullScreenAlert";
import { type AlertWebData } from "@/types/alert";

import { getLatestAlarm } from "@/api/alarmApi";
import { getDevices } from "@/api/deviceApi";
import { getHouseholdId } from "@/lib/auth";
import type { RoomDevice } from "@/types/room";

import { connectWs } from "@/lib/ws";
import { toWebDataFromRealtime, toWebDataFromList } from "@/utils/alertMapper";

// unread 배너 개수는 서버 API 미정으로 임시 플레이스홀더 (백엔드 회신 대기)
import { mockUnreadCount } from "@/mocks/alert";

export default function MainPage() {
  const [currentAlert, setCurrentAlert] = useState<null | AlertWebData>(null);
  const [alertList, setAlertList] = useState<AlertWebData[]>([]);
  const [deviceList, setDeviceList] = useState<RoomDevice[]>([]);

  useEffect(() => {
    const household_id = getHouseholdId();
    if (!household_id) return;

    getDevices(household_id)
      .then((res) => setDeviceList(res.devices))
      .catch((e) => console.error("기기 목록 로드 실패", e));

    getLatestAlarm(household_id)
      .then((res) => {
        if (res.alarm) {
          const webData = toWebDataFromList(res.alarm);
          setAlertList((prev) =>
            prev.some((a) => a.id === webData.id) ? prev : [webData, ...prev],
          );
        }
      })
      .catch((e) => console.error("최신 알림 로드 실패", e));
  }, []);

  useEffect(() => {
    const household_id = getHouseholdId();
    if (!household_id) return;

    const ws = connectWs(
      household_id,
      (alarm) => {
        const webData = toWebDataFromRealtime(alarm);
        setCurrentAlert(webData);
        setAlertList((prev) => [webData, ...prev]);
      },
      (devices) => setDeviceList(devices),
      (device_id, ui_status) =>
        setDeviceList((prev) =>
          prev.map((d) =>
            d.device_id === device_id ? { ...d, ui_status } : d,
          ),
        ),
    );

    return () => ws.close();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-500">
      <div className="flex flex-col gap-5 bg-gray-500 px-5 py-4">
        <Notification unreadCount={mockUnreadCount} />
      </div>
      <div className="min-h-[calc(100vh-250px)] flex-1 rounded-t-4xl bg-gray-100 pt-5 pb-25">
        <div className="px-5 py-7">
          <div>
            <p className="m-0 text-head-01 text-gray-500">기기 연결 상태</p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {deviceList.map((device) => (
              <Room
                key={device.device_id}
                device_id={device.device_id}
                location={device.location}
                ui_status={device.ui_status}
              />
            ))}
          </div>
        </div>
        <div className="px-5 py-2.5">
          <div>
            <p className="m-0 text-head-01 text-gray-500">실시간 소리 알림</p>
          </div>

          <div className="mt-4 flex flex-col">
            {alertList.map((alert) => (
              <AlertCard
                key={alert.id}
                id={alert.id}
                display_time={alert.display_time}
                location={alert.location}
                sound={alert.sound}
                type={alert.type}
              />
            ))}
          </div>
        </div>
      </div>

      {currentAlert && (
        <FullScreenAlert
          alertData={currentAlert}
          onClose={() => setCurrentAlert(null)}
        />
      )}
    </div>
  );
}
