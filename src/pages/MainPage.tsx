import { useState, useEffect } from "react";
import AlertCard from "@/components/AlertCard";
import Notification from "@/components/Notification";
import Room from "@/components/Room";
import FullScreenAlert from "@/components/FullScreenAlert";
import { type AlertWebData } from "@/types/alert";

import { getLatestAlarm } from "@/api/alarmApi";
import { getHouseholdId } from "@/lib/auth";
import type { RoomDevice } from "@/types/room";

import { connectWs } from "@/lib/ws";
import { toWebDataFromRealtime, toWebDataFromList } from "@/utils/alertMapper";

// 목업 데이터 - IS_MOCK_MODE 로 서버 연결/해제 가능
import { mockDeviceData } from "@/mocks/room";
import { mockUnreadCount, mockAlertData } from "@/mocks/alert";
import { IS_MOCK_MODE } from "@/mocks/config";
import MockAlertTrigger from "@/mocks/MockAlertTrigger";

export default function MainPage() {
  const [currentAlert, setCurrentAlert] = useState<null | AlertWebData>(null);
  const [alertList, setAlertList] = useState<AlertWebData[]>(
    IS_MOCK_MODE ? mockAlertData : [],
  );
  const [deviceList, setDeviceList] = useState<RoomDevice[]>(
    IS_MOCK_MODE ? mockDeviceData : [],
  );
  // 초기 로드 — 앱 진입 시점의 최신 알림 1건 (REST)
  useEffect(() => {
    if (IS_MOCK_MODE) return;

    const household_id = getHouseholdId();
    if (!household_id) return;

    getLatestAlarm(household_id)
      .then((res) => {
        if (res.alarm) {
          const webData = toWebDataFromList(res.alarm);
          setAlertList((prev) =>
            prev.some((a) => a.id === webData.id) ? prev : [...prev, webData],
          );
        }
      })
      .catch((e) => {
        console.error("최신 알림 로드 실패", e);
      });
  }, []);

  // 실시간 알림 (WebSocket)
  useEffect(() => {
    if (IS_MOCK_MODE) return;

    const household_id = getHouseholdId();
    if (!household_id) return;

    const ws = connectWs(
      household_id,
      (alarm) => {
        const webData = toWebDataFromRealtime(alarm);
        setCurrentAlert(webData);
        setAlertList((prev) => [webData, ...prev]);
      },
      (devices) => {
        setDeviceList(devices);
      },
      (device_id, ui_status) => {
        setDeviceList((prev) =>
          prev.map((d) =>
            d.device_id === device_id ? { ...d, ui_status } : d,
          ),
        );
      },
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
        {IS_MOCK_MODE && <MockAlertTrigger onTrigger={setCurrentAlert} />}
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
