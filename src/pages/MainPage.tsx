import { useState, useEffect, useRef } from "react";
import AlertCard from "@/components/AlertCard";
import Notification from "@/components/Notification";
import Room from "@/components/Room";
import Button from "@/components/Button";
import FullScreenAlert from "@/components/FullScreenAlert";
import { type AlertWebData } from "@/types/alert";

import { getLatestAlarm, getUnreadCount } from "@/api/alarmApi";
import { getDevices } from "@/api/deviceApi";
import { getHouseholdId } from "@/lib/auth";
import { getCurrentHousehold } from "@/api/householdApi";
import type { CurrentHouseholdResponse } from "@/types/household";
import type { RoomDevice } from "@/types/room";

import { connectWs } from "@/lib/ws";
import { toWebDataFromRealtime, toWebDataFromList } from "@/utils/alertMapper";

import { useNavigate } from "react-router-dom";
import { IS_MOCK_MODE } from "@/mocks/config";

export default function MainPage() {
  const [currentAlert, setCurrentAlert] = useState<null | AlertWebData>(null);
  const [alertList, setAlertList] = useState<AlertWebData[]>([]);
  const [deviceList, setDeviceList] = useState<RoomDevice[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [household, setHousehold] = useState<CurrentHouseholdResponse | null>(
    null,
  );
  const [checking, setChecking] = useState(!IS_MOCK_MODE);
  // WS로 이미 +1한 알림 id — 동일 알림 중복 수신 시 이중 카운트 방지
  const countedAlarmIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (IS_MOCK_MODE) return;

    getCurrentHousehold()
      .then((res) => setHousehold(res))
      .catch(() => setHousehold(null))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    const household_id = getHouseholdId();
    if (!household_id) return;

    getDevices(household_id)
      .then((res) => setDeviceList(res.devices))
      .catch((e) => console.error("기기 목록 로드 실패", e));

    getUnreadCount(household_id)
      .then((res) => setUnreadCount(res.unread_count))
      .catch((e) => console.error("미확인 알림 개수 로드 실패", e));

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
        if (!countedAlarmIds.current.has(alarm.id)) {
          countedAlarmIds.current.add(alarm.id);
          setUnreadCount((c) => c + 1);
        }
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

  // 미연동 사용자 — 가구가 없으면 초대 코드 안내만 표시
  if (checking) {
    return null;
  }

  // 미연동
  if (household?.household_link_status === "unlinked") {
    return <EmptyHouseholdView variant="no-household" />;
  }

  // owner인데 주소 미등록
  if (household?.onboarding?.next_action === "register_emergency_address") {
    return <EmptyHouseholdView variant="no-address" />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-500">
      <div className="flex flex-col gap-5 bg-gray-500 px-5 py-4">
        <Notification unreadCount={unreadCount} />
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

function EmptyHouseholdView({
  variant,
}: {
  variant: "no-household" | "no-address";
}) {
  const navigate = useNavigate();

  const config = {
    "no-household": {
      title: "등록된 가구가 없습니다",
      desc: (
        <>
          가족에게 받은 초대 코드를
          <br />
          입력해 주세요.
        </>
      ),
      buttonText: "초대 코드 입력",
      to: "/signup/invite",
    },
    "no-address": {
      title: "집 주소가 필요해요",
      desc: (
        <>
          긴급 상황에 대비해
          <br />집 주소를 등록해 주세요.
        </>
      ),
      buttonText: "주소 등록",
      to: "/signup/address",
    },
  }[variant];

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 px-5 pt-10 pb-25">
      <div className="rounded-2xl bg-white p-6 shadow-03">
        <h1 className="text-head-03 text-gray-500">{config.title}</h1>
        <p className="mt-2 text-body-01 text-gray-300">{config.desc}</p>
        <div className="mt-6">
          <Button variant="dark" onClick={() => navigate(config.to)}>
            {config.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
