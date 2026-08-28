import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { useState, useEffect } from "react";
import AlertCard from "@/components/AlertCard";
import Notification from "@/components/Notification";
import Room from "@/components/Room";
import FullScreenAlert from "@/components/FullScreenAlert";
import { type AlertWebData, type AlertRealtime } from "@/types/alert";

import { getLatestAlarm } from "@/api/alarmApi";
import { toWebDataFromList } from "@/utils/alertMapper";
import { getHouseholdId } from "@/lib/auth";

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

  // 초기 로드 — 앱 진입 시점의 최신 알림 1건 (REST)
  useEffect(() => {
    if (IS_MOCK_MODE) return;

    const household_id = getHouseholdId();
    if (!household_id) return;

    getLatestAlarm(household_id)
      .then((res) => {
        if (res.alarm) {
          setAlertList([toWebDataFromList(res.alarm)]);
        }
      })
      .catch((e) => {
        console.error("최신 알림 로드 실패", e);
      });
  }, []);

  // 실시간 구독 — 곧 WebSocket으로 교체 예정
  useEffect(() => {
    if (IS_MOCK_MODE) {
      return;
    }

    // time을 기준으로 최신순 정렬
    const q = query(
      collection(db, "alarms"),
      orderBy("time", "desc"),
      limit(1),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // 파이어베이스에서 막 도착한 순수 원본 데이터
          const serverData = change.doc.data() as AlertRealtime;

          // 🚨 F12 관리자 모드 콘솔창에 데이터 찍기
          console.log("====================================");
          console.log("📡 [서버 원본 데이터 수신] :", serverData);
          console.log("====================================");

          let displayTime = "시간 오류";
          if (serverData.time) {
            displayTime = new Date(serverData.time).toLocaleTimeString(
              "ko-KR",
              {
                hour: "2-digit",
                minute: "2-digit",
              },
            );
          }

          const finalAlertData: AlertWebData = {
            id: serverData.id || change.doc.id,
            display_time: displayTime,
            location: serverData.location,
            sound: serverData.sound,
            raw_label: serverData.raw_label,
            type: serverData.type,
          };

          console.log("🛠️ [UI 변환 결과 프리뷰] :", finalAlertData);

          // 💡 화면 렌더링 실행: 주석을 해제하여 콘솔 로그 출력과 함께 화면 팝업도 띄웁니다.
          setCurrentAlert(finalAlertData);
          setAlertList((prev) => [finalAlertData, ...prev]);
        }
      });
    });

    return () => unsubscribe();
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
            {mockDeviceData.map((device) => (
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
